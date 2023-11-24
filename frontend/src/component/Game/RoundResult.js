import React from 'react'
import './RoundResult.css'

const RoundResult = (props) => {

  const dados = props.score

  return (
        <div className="round-result-playerslist">

            <div className="round-result-table">
              <div>#</div>
              <div>Name</div>
              <div>Score</div>
            </div>
        <div className="round-result-list">
          {Object.keys(dados).map((leader, index) => (
            <div className="round-result-player" key={1}>
              <span> {index + 1}</span>
              <div className="round-result-user">
                <img className="round-result-image" src={'https://cdn-icons-png.flaticon.com/512/186/186037.png'} />
                <span> {leader} </span>
              </div>
              <span> {dados[leader].roundScore} </span>
            </div>
          ))}
        </div>
        </div> 
  )
}

export default RoundResult
