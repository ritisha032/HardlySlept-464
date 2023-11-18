import React, { useContext } from 'react'
import GameContext from '../../context/GameContext'
import Game from './Game'
import Lobby from './Lobby'

function GameRoom() {
    const {game} = useContext(GameContext) 
    return (
    <div>{(game.status=="Lobby")?<Lobby/>:<Game/>}</div>
  )
}

export default GameRoom