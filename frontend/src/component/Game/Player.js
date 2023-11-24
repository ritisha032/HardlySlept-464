import React from 'react'
import './Player.css'

function Player(props) {
  return (
    <div className='player-cont'>
      {props.user} {(props.score!=undefined)?<div>score-{props.score.score}</div>:""}</div>
  )
}

export default Player