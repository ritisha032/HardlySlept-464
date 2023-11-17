import React from 'react'
import Logout from '../login/Logout'
import { useContext } from 'react'
import GameContext from '../../context/GameContext'
import Player from './Player'

const Lobby = () => {
  const {game} = useContext(GameContext)
  return (
    <div><h1>{game.type}</h1>

     { game.player_names.map((data,index)=>{
        return <Player user={data}/>
      })}
      <Logout></Logout>
    </div>
  )
}

export default Lobby