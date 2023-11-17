import react,{useState} from 'react'

import GameContext from './GameContext'

const GameContextProvider = ({children}) =>{
    const [game,setGame] = useState(null);
    return (
        <GameContext.Provider value={{game,setGame}}>
            {children}
        </GameContext.Provider>
    )
}

export default GameContextProvider