import react,{useState} from 'react'

import SocketContext from './SocketContext'

const SocketContextProvider = ({children}) =>{
    const [socket,setSocket] = useState(null);
    return (
        <SocketContext.Provider value={{socket,setSocket}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketContextProvider