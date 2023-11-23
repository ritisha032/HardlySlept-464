import React from 'react'
import './Player.css'

function Player(props) {
  return (
      <div className='player-cont'>{props.user}</div>
  )
}

export default Player