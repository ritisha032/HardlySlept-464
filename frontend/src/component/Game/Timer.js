import React from 'react'
import './Timer.css'

function Timer(props) {
  return (
    <div>
      <div></div>
      <div className='time-count'>{props.time}</div>
   </div>
  )
}

export default Timer