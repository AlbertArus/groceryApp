import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'
import Lista from "../Lista/Lista"
import NewLista from "./NewLista"
import NavBar from "./NavBar"

const Home = ({usuario}) => {
    const [listas, setListas] = useState([])

    const addLista = (listaName, members, plan) => {
        const newLista = {id: uuidv4(), listaName, members, plan}
        setListas(prevListas => [...prevListas, newLista])
    }

    const listaslength = listas.length

    return (
        <div className="Home app">
            <NavBar 
            
            />
            <div className="app-margin">
                <div className="welcome">
                    <h2>{`Hola ${usuario}!`}</h2>
                    <h5>{`Tienes ${listaslength} listas activas.`}<br/>{`Compra ahora o crea una nueva y compártela!`}</h5>
                </div>
            </div>

            {listas && listas.map(lista => (
                <Lista 
                    key={lista.id}
                    id={lista.id}
                    nameLista={lista.nameLista}
                    members={lista.members}
                    plan={lista.plan}
                />
            ))}
            <NewLista
                addLista={addLista}
            />
        </div>
    )
}

export default Home