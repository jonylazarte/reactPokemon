import {POKEMON_REQUEST, POKEMON_SUCCESS, POKEMON_FAILURE} from '../types.js'

export const pokemonRequest = ()=>({
	type: POKEMON_REQUEST,
})

export const pokemonSuccess = data=>({
	type: POKEMON_SUCCESS,
	payload: data,
})
export const pokemonFailure = error=>({
	type: POKEMON_FAILURE,
	payload: error,
})

const {VITE_API_URL : API_URL} = import.meta.env;

export const getPokemon = (path) => dispatch =>{
	dispatch(pokemonRequest())
	fetch(`${API_URL}pokemons/${path}`)
    	.then(response => response.json())
    	.then(data => dispatch(pokemonSuccess(data)))
    	.catch(error => dispatch(pokemonFailure(error)))

}