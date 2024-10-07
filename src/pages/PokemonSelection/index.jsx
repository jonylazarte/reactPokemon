import {useSelector, useDispatch} from 'react-redux'
import react from 'react'



export default function PokemonSelection(){
	const {loading, pokemonStore, error} = useSelector(state => {return state.pokemonReducer})

	console.log(pokemonStore)
	return <></>
}