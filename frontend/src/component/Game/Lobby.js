import React from 'react'
import Logout from '../login/Logout'
import { useContext } from 'react'
import GameContext from '../../context/GameContext'

const Lobby = () => {
  const {game} = useContext(GameContext)
  return (
    <div>{game.type}
      <Logout></Logout>
    </div>
  )
}

export default Lobby