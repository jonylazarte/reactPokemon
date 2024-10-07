import { useState } from 'react'
import MainPage from './pages/MainPage/index.jsx'
import PokemonSelection from './pages/PokemonSelection/index.jsx'
import PokemonBattlefield from './pages/Battlefield/index.jsx'
import {Route} from 'wouter'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <Route path='/Battlefield' component ={PokemonBattlefield}></Route>
        <Route path='/' component ={MainPage}></Route>
    </>
  )
}

export default App
