import './styles.css'
import {useEffect, useState, useMemo, useCallback} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {getPokemon} from '../../store/actions/pokemonActions.js'
import {motion, useMotionValue, useTransform, animate } from 'framer-motion';
import {useLocation} from 'wouter'
import MoveButton from '../../components/movesButtons/moveButton'
import {io} from 'https://cdn.socket.io/4.8.0/socket.io.esm.min.js'


export default function Battlefield(){
	const {VITE_API_URL : API_URL} = import.meta.env;
	const dispatch = useDispatch()
	const {loading, pokemonStore, error} = useSelector(state => {return state.pokemonReducer})
	const [renderData, setRenderData] = useState([])
  const [allPokemon, setAllPokemon] = useState([])
	const [moves, setMoves] = useState([])
  const [pokemonTwo, setPokemonTwo] = useState()
  const [pokemonOne, setPokemonOne] = useState()
	const index1 = pokemonOne?.id -1
	const index2 = pokemonTwo?.id -1
	const [hpOne, setHpOne] = useState(0)
  const [hpTwo, setHpTwo] = useState(0)
	const [pokeMoves, setPokeMoves] = useState([])
  const [moveRunning, setMoveRunning] = useState(false)
  const [effectEntrie, setEffectEntrie] = useState()
  const [percentHpOne, setPercentHpOne] = useState()
  const [percentHpTwo, setPercentHpTwo] = useState()
  const initialHpTwo = pokemonTwo?.stats[0].actual_stat ?? pokemonTwo?.stats[0].base_stat
  const initialHpOne = pokemonOne?.stats[0].actual_stat
  const [renderImage, setRenderImage] = useState()
  const [types, setTypes] = useState()
  const [pp, setPpOne] = useState([null, null, null, null])
  const [currentPlayer, setCurrentPlayer] = useState("One")
  const socket = io(`${API_URL}`)

  const getEffectiveness = (movetype, enemytypes)=>{
  const mtype = types.find(type => type.name == movetype.name).damage_relations

  let isDouble = mtype.double_damage_to.some(type => enemytypes.some(t => t.type.name == type.name))
  let isHalf = mtype.half_damage_to.some(type => enemytypes.some(t => t.type.name == type.name))
  let isNo = mtype.no_damage_to.some(type => enemytypes.some(t => t.type.name == type.name))
  
  const effectiveness = isDouble ? 2 : isHalf ? 0.5 : isNo ? 0 : 1
  return(effectiveness)  
  }

  const getBonus = (movetype, owntypes) =>{
  let Is50Percent = owntypes.some(owntype => owntype.type.name == movetype.name)
  const bonus = Is50Percent ? 1.5 : 1
  return bonus
  }


	useEffect(() => {
 // dispatch(getPokemon(''))
  Promise.all([
    fetch(`${API_URL}pokemons/users/pokemon`),
    fetch(`${API_URL}pokemons/data/moves`),
    fetch(`${API_URL}pokemons/data/types`),
  ])
  .then(([response1, response2, response3]) => {
    Promise.all([response1.json(), response2.json(), response3.json()])
    .then(([data1, data2, data3]) => {
      setPokemonTwo(data1[3])   
      setHpTwo(data1[3].stats[0].actual_stat)
      setRenderData(data1);
      setMoves(data2);
      setTypes(data3);
    });
  });
}, []);


  const count = useMotionValue(0)
  const rounded = useTransform(count, latest => Math.round(latest)) 

  const count1 = useMotionValue(0)
  const rounded1 = useTransform(count1, latest => Math.round(latest))   

  useEffect(() => {
  const controls = animate(count, hpTwo, {velocity:2, duration:2})
  return () => controls.stop()
}, [hpTwo])

  useEffect(() => {
  const controls1 = animate(count1, hpOne, {velocity:2, duration:2})
  return () => controls1.stop()
}, [hpOne])

   const movesOne = pokemonOne?.moves?.map(move => {
    const moveId = move.move.url.split('/')[4];
    return moves[moveId];
  });
   const movesTwo = pokemonTwo?.moves?.map(move => {
    const moveId = move.move.url.split('/')[4];
    return moves[moveId];
  });

   const handlePlaySound = (soundUrl) => {
    const audio = new Audio(soundUrl);
    audio.volume = 0.2;
    audio.play();
  }

const machinePlayer = ()=>{
  const randomAttackNum = Math.floor(Math.random() * pokemonTwo?.moves?.length) + 0;
  const move = movesTwo[randomAttackNum]
  setMoveRunning(true)
  setEffectEntrie(pokemonTwo.name.toUpperCase() + " used " + move.name.toUpperCase() +"!")
  handlePlaySound(pokemonTwo.cries.latest)
  let isFailed = false 
  if(Math.floor(Math.random() * 100 + 1) >= move.accuracy){isFailed = true}
  let V = Math.floor(Math.random() * 16) + 85; //Varación. entre 85 y 100
  let N = pokemonTwo.level ?? 5 // Nivel del pokemón atacante
  let A = pokemonTwo.stats[1].actual_stat // Cantidad de ataque. fisico-especial
  let D = pokemonOne.stats[2].actual_stat // Defensa del rival. fisica-especial
  let B = getBonus(move.type, pokemonTwo?.types) //Bonificacion. 1 - 1.5 - 2
  let E = getEffectiveness(move.type, pokemonOne?.types) // Efectividad. 0 - 0.25 - 0.5 - 1 - 2 - 4
  let P = move.power
  console.log("Bonus: " + B, "Efectividad: "+ E )
  let finalDamage = Math.floor(0.01 * B * E * V * ( (0.2 * N + 1) * A * P / (25 * D) + 2))
  if(isFailed){finalDamage = 0}
  setTimeout(()=>{
  let finalHpOne = !hpOne ? initialHpOne - finalDamage : hpOne - finalDamage
  console.log(finalHpOne)
  setHpOne(finalHpOne)
  setPercentHpOne(finalHpOne <= 0 ? 0 : finalHpOne * 69 / initialHpOne)
          setTimeout(()=>{
          let effectEntrie = isFailed ? "El ataque falló" : E == 2 ? "El ataque fue super efectivo" : E == 0.5 ? "El ataque tuvo un efecto debil" : ""
          setEffectEntrie(effectEntrie)
                setTimeout(()=>{            
                setMoveRunning(false)
                  if(finalHpOne <= 0) {alert(pokemonTwo.name.toUpperCase() + " WINS") }
                },1000)
          },1500)
  },1500)

}



const handleAttack = (move, index, hitsToGive, randomVs)=>{
  setMoveRunning(true)
  setEffectEntrie(pokemonOne.name.toUpperCase() + " usó " + move.name.toUpperCase() +"!")
  handlePlaySound(pokemonOne.cries.latest)
  setPpOne([...pp.slice(0, index), pp[index] - 1, ...pp.slice(index + 1)]);
  // const hitsToGive = move.meta.max_hits != null ? Math.floor(Math.random() * (move.meta.max_hits - move.meta.min_hits +1)) + move.meta.min_hits : 1
  var hitsGiven = 0
  var actualHp = hpTwo
  const processAttack = ()=>{
  var isFailed = false 
  if(Math.floor(Math.random() * 100 + 1) >= move.accuracy && move.accuracy != null){isFailed = true}
  const V = randomVs[hitsGiven]//Math.floor(Math.random() * 16) + 85; //Varación. entre 85 y 100
  const N = pokemonOne.level // Nivel del pokemón atacante
  const A = pokemonOne.stats[1].actual_stat // Cantidad de ataque. fisico-especial
  const D = pokemonTwo.stats[2].actual_stat // Defensa del rival. fisica-especial
  const B = getBonus(move.type, pokemonOne?.types) //Bonificacion. 1 - 1.5 - 2
  const E = getEffectiveness(move.type, pokemonTwo?.types) // Efectividad. 0 - 0.25 - 0.5 - 1 - 2 - 4
  const P = move.power
  console.log("Bonus: " + B, "Efectividad: "+ E )
  var finalDamage = Math.floor(0.01 * B * E * V * ( (0.2 * N + 1) * A * P / (25 * D) + 2))
  if(isFailed){finalDamage = 0}
          setTimeout(()=>{
          setHpTwo(oldHp => oldHp - finalDamage)
          actualHp -= finalDamage
          setPercentHpTwo(actualHp <= 0 ? 0 : actualHp * 100 / initialHpTwo)
          hitsGiven += 1
          if(hitsToGive == hitsGiven){
                setTimeout(()=>{
                const effectEntrie = isFailed ? "El ataque falló" : E == 2 ? "El ataque fue super efectivo" : E == 0.5 ? "El ataque tuvo un efecto debil" : ""
                setEffectEntrie(effectEntrie)
                            setTimeout(()=>{            
                            setMoveRunning(false)
                            machinePlayer()
                            if(hpTwo <= 0) {alert(pokemonOne.name.toUpperCase() + " WINS")}
                            },1000)
                },1000)} else processAttack()
          },1500)
    }
    processAttack() 
}


const setPokemon = (pokemonIndex, player)=>{
  const setPokemon = player == "One" ? setPokemonOne : setPokemonTwo
  const setHp = player == "One" ? setHpOne : setHpTwo
  const setPercent = player == "One" ? setPercentHpOne : setPercentHpTwo
  const setPp = player == "One" ? setPpOne : setPpOne
  setPokemon(renderData[pokemonIndex])
  setHp(renderData[pokemonIndex].stats[0].actual_stat)
  setPercent(currentPlayer == "One"? 63 : 100)
  const reducedMoves = renderData[pokemonIndex].moves?.map(move => {
    const moveId = move.move.url.split('/')[4];
    return moves[moveId];
  })
  setPp([reducedMoves[0]?.pp,reducedMoves[1]?.pp,reducedMoves[2]?.pp,reducedMoves[3]?.pp])
}
const setRandomPokemon = ()=>{
  const pokemonIndex = Math.floor(Math.random() * renderData.length)

        const inputPokemon = renderData[pokemonIndex]
        const baseExp = inputPokemon.base_experience
        const pokemonLevel = 4
        const ownMoves = inputPokemon.moves.filter(move => move.version_group_details[0].level_learned_at < pokemonLevel && move.version_group_details[0].move_learn_method.name == "level-up")
        const randomMoves = []
        for(let i = 0; i < 4; i++){
          let randomIndex = Math.floor(Math.random() * ownMoves.length)
          randomMoves.push(ownMoves.splice(randomIndex, 1)[0]);
          if(ownMoves.length == 0){break;}
        }  
        const finalPokemon = {
          ...inputPokemon,
          level : pokemonLevel,
          moves : randomMoves,
          stats : [
            {...inputPokemon.stats[0], actual_stat : 25},
            {...inputPokemon.stats[1], actual_stat : 15},
            {...inputPokemon.stats[2], actual_stat : 15},
            {...inputPokemon.stats[3], actual_stat : 15},
            {...inputPokemon.stats[4], actual_stat : 15},
            {...inputPokemon.stats[5], actual_stat : 15}
            ]
        }
  setPokemonTwo(finalPokemon)
  setHpTwo(finalPokemon.stats[0].actual_stat)
  setPercentHpTwo(100)
}
  const updateLevel = (index)=>{
      fetch('http://localhost:5050/pokemons/users/updatelevel',{
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
          userId : '198b73c5-50b6-4fbc-a7dc-d93a6c2ec1d6',
          pokemonId : index,
          pokemonExp : pokemonOne.actual_exp + 50
        })
      }).then(response => response.json()).then(data=>setPokemonOne(data))
  }

  
  useEffect(() => {
    // Remove any existing listeners before adding a new one
    socket.off('chat message');

    socket.on('chat message', (msg) => {
      console.log('Received message:', msg);
      machinePlayer()
      // Perform actions based on the message content here (e.g., update UI)
    });

    // Cleanup function to remove the listener when the component unmounts
    return () => socket.off('chat message');
  }, [setRandomPokemon]);

  const randomAttackHandler = ()=>{
    socket.emit('chat message', 'fromother') 
  }





useEffect(()=>{
  socket.off('attack');

  socket.on('attack', (msg) =>{
    console.log(msg.move)
    handleAttack(msg.move, msg.index, msg.hitsToGive, msg.randomVs)
  })
  return () => socket.off('attack');
},[movesOne])

const emitAttack = (move, index)=>{
  const hitsToGive = move.meta.max_hits != null ? Math.floor(Math.random() * (move.meta.max_hits - move.meta.min_hits +1)) + move.meta.min_hits : 1;
  var randomVs = []
  for(let i=0; i < hitsToGive ; i++){
     const V = Math.floor(Math.random() * 16) + 85;
     randomVs.push(V)
  }

  socket.emit('attack', {move, index, hitsToGive, randomVs})
}


useEffect(() => {
    // Remove any existing listeners before adding a new one
    socket.off('setpokemon');
    socket.on('setpokemon', (msg) => {
      console.log('Received message:', msg + " " + msg.currentPlayer);
      setPokemon(msg.index, msg.currentPlayer)
      // Perform actions based on the message content here (e.g., update UI)
    });

    // Cleanup function to remove the listener when the component unmounts
    return () => socket.off('setpokemon');
  }, [renderData, currentPlayer]);

  const emitSetPokemon = (index)=>{
    socket.emit('setpokemon', {index, currentPlayer}) 
  }

const playerPokemon = ()=>{
    return renderData.map((pokemon, index)=>(
      <article key={index} onClick={()=>emitSetPokemon(index)}>
      <div><img src={pokemon.sprites.front_default}></img><h3>{pokemon.name.toUpperCase()}</h3><h3>{pokemon.stats[0].actual_stat}/{pokemon.stats[0].actual_stat}</h3></div>
      <h4>LVL: {pokemon.level} <button onClick={()=>updateLevel(index)}>+</button></h4></article>))
  }

	return <>
  <div className="champ-selection">
    <h2>SELECCIONA TU POKEMÓN</h2>
    {playerPokemon()}
    <button onClick={setRandomPokemon}>Play With Random</button>
    <br/>
    <button onClick={randomAttackHandler}>Random Attack</button>
    <br/>
    <button onClick={()=>setCurrentPlayer("Two")}>SET PLAYER TWO</button>
  </div>
	{!pokemonOne ? <h1></h1> : (<div className="canvas">
      <div className="player-two-container">
        <div id="pokeballsP2">
          <h2>{pokemonTwo?.name.toUpperCase()}<span className="health-count-p2"><motion.div>{rounded}</motion.div>/{initialHpTwo} </span></h2>
          <div className="hp-container-mew">
            <progress style={{width:`${percentHpTwo}%`}} /*value={hpTwo || initialHpTwo} max={initialHpTwo}*/ className="bar p2-health"></progress>
          </div>
        </div>
        <img id="ai-image" style={{
        animation: 'myAnimation 2s linear infinite',
        animationDelay: `-10s`
      }}src={pokemonTwo?.sprites?.other?.showdown?.front_default} />
      </div>



      <div className="player-one-container">
      <div id="pokeballsP1">
            <img src={pokemonOne?.sprites?.other?.showdown?.back_default} id="charmander" />
        <div className="hp-container">
        <h2>{pokemonOne?.name.toUpperCase()}</h2>
        <span className="health-count-p1">HP<motion.div>{rounded1}</motion.div>/{initialHpOne}<progress style={{width:`${percentHpOne}%`}} /*value={hpOne || initialHpOne} max={initialHpOne}*/ className="bar p1-health"></progress> </span>
        </div>
        </div>
        
        <h1 className="game-state"></h1>
          { !moveRunning ? <div className="attack-container">
          {movesOne && movesOne.map((move, index) => <MoveButton key={move.id} move={move} handleAttack={emitAttack} pp={pp[index]} index={index}></MoveButton>)}
          
        </div> : <div className="move-container">{effectEntrie}</div>}
        <button className="restart-game">Restart Game</button>
      </div>
    </div>)}
	</>
}