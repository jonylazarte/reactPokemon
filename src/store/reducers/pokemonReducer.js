import {POKEMON_REQUEST, POKEMON_SUCCESS, POKEMON_FAILURE} from '../types.js'

const initialState = {
	loading: false,
	pokemonStore: [],
	error: "",
}

const pokemonReducer = (state = initialState, action) =>{

	switch(action.type){
		case POKEMON_REQUEST: return{
		...state,
		loading : true
		}
		case POKEMON_SUCCESS: return{
		loading : false,
		pokemonStore : action.payload,
		error : ""
		}
		case POKEMON_FAILURE: return{
		loading : false,
		pokemonStore : {},
		error : action.payload
		}
		default : return state 
	}

}
export default pokemonReducer