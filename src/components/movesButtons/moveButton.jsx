import react from 'react'



export const MoveButton = ({move, handleAttack, pp, index})=>{

	return pp != 0 ? <button onClick={()=>handleAttack(move, index)} className={`attack1 btn ${move?.type?.name}`}>{move?.name?.toUpperCase()} <div><span>{pp == null ? move.pp : pp}</span>
	<img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vi/x-y/${move.type.url.split('/')[4]}.png`}></img></div>
	</button> : <button className={`attack1 btn ${move?.type?.name}`}>NO USEFUL</button>
}

export default MoveButton