import React from 'react'
import './Login-SignUp.css'
import Login from './Login'
import SignUp from './SignUp'

const Sample = () => {
  return (
    <div className='container'>
 
        <div class="wrapper">
                <div class="card-switch">
                    <label class="switch">
                        <input type="checkbox" class="toggle"/>
                        <span class="slider"></span>
                        <span class="card-side"></span>
                        <div class="flip-card__inner">

                        <div class="flip-card__front">
                            <Login/>
                        </div>

                        <div class="flip-card__back">
                            <SignUp/>
                        </div>

                    </div>
                    </label>
                </div>   
        </div>  
    </div>
  )
}

export default Sample
