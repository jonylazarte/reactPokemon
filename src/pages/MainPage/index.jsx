import './sidenav.css'; import './styles.css'
import {react, useState, useEffect} from 'react'
import Card from '../../components/cards/pokeCard.jsx'
import {getPokemon} from '../../store/actions/pokemonActions.js'
import {useSelector, useDispatch} from 'react-redux'
import {useLocation} from 'wouter'



export default function MainPage(){
    const {VITE_API_URL : API_URL} = import.meta.env;
	const toggleMenu = () => document.body.classList.toggle("open");
    const dispatch = useDispatch()
	const [pokemon, setPokemon] = useState([]);
	const [species, setSpecies] = useState([]);
	const [renderData, setRenderData] = useState([]) 
	const [searchKeys, setSearchKeys] = useState()
	const {loading, pokemonStore, error} = useSelector(state => {return state.pokemonReducer})
    const [type, setType] = useState()
    const [pokemonFrom, setPokemonFrom] = useState()
    const [path, setLocation] = useLocation();
    

  	useEffect(()=>{
  		 dispatch(getPokemon(`${pokemonFrom == "User" ? "users/pokemon" : ""}`))
  		fetch(`${API_URL}pokemons/data/species`)
    	.then(response => response.json())
    	.then(data => {
        setSpecies(data)
	    })

  		fetch(`${API_URL}pokemons/${pokemonFrom == "User" ? "users/pokemon" : ""}`)
    	.then(response => response.json())
    	.then(data => {setPokemon(data); setRenderData(data); });

  	},[pokemonFrom])
  	
   useEffect(()=>{
   if(searchKeys){ setRenderData(pokemon.filter(poke => poke.name.startsWith(searchKeys.toLowerCase()))) } else {setRenderData(pokemon)}
   },[searchKeys])

   useEffect(()=>{
    if(type){setRenderData(pokemon.filter(poke => poke.types.some(t => t.type.name == type)))}
   },[type])

   const LoadPokemon = () =>{
   	return renderData.map(poke => (
   		<Card key={poke.id} speciesData={species} data={poke}></Card>    
      ))	
   }


return <>
    {loading ? <div>LOADING...</div> : ""}	
    <button className="burger" onClick={toggleMenu}>
      <i className="fa-solid fa-bars"></i>
      <i className="fa-solid fa-close"></i>
    </button>
    <aside>
      <a>Home</a>
      <a onClick={()=>setLocation(`/Battlefield`)}>Battle</a>
      <a>Blog</a>
      <h3>Product</h3>
      <a>Why SurrealDB?</a>
      <a>Features</a>
      <a>Releases</a>
      <a>Roadmap</a>
      <a>Documentation</a>
      <button>Log Out</button>
    </aside>
    <header className="mainHeader">
    <input type="search" onKeyUp={(event)=>setSearchKeys(event.currentTarget.value)}></input>
    <select onChange={(event)=>{setType(event.currentTarget.value)}}>
    <option value="normal">NORMAL</option>
    <option value="fighting">FIGHTING</option>
    <option value="flying">FLYING</option>
    <option value="poison">POISON</option>
    <option value="ground">GROUND</option>
    <option value="rock">ROCK</option>
    <option value="bug">BUG</option>
    <option value="ghost">GHOST</option>
    <option value="steel">STEEL</option>
    <option value="fire">FIRE</option>
    <option value="water">WATER</option>
    <option value="grass">GRASS</option>
    <option value="electric">ELECTRIC</option>
    <option value="psychic">PSYCHIC</option>
    <option value="ice">ICE</option>
    <option value="dragon">DRAGON</option>
    <option value="dark">DARK</option>
    <option value="fairy">FAIRY</option>
    <option value="stellar">STELLAR</option>
    <option value="unknow">UNKOW</option>
    <option value="shadow">SHADOW</option>
    </select>
        <select onChange={(event)=>{setPokemonFrom(event.currentTarget.value)}}><option value="All">All</option><option value ="User">Owneds</option></select>
    </header>
    <main>{LoadPokemon()}</main>
</>
	
}