// import { useState } from "react"
// import { v4 as uuidv4 } from 'uuid'
import Lista from "../Lista/Lista"
import NewLista from "./NewLista"
import NavBar from "./NavBar"
import FormLista from "../components/FormLista"

const Home = ({usuario, listas, addLista, deleteLista, listaslength}) => {

    return (
        <div className="Home app">
            <NavBar 
            
            />
            <NewLista
            addLista={addLista}
            />
            <div className="app-margin">
                <div className="welcome" style={{marginBottom: "12px"}}>
                    <h2>{`Hola ${usuario}!`}</h2>
                    <h5>{`Tienes ${listaslength} listas activas.`}
                    {/* <br/>{`Compra ahora o crea una nueva y compártela!`} */}
                    </h5>
                </div>
            </div>
            <div className="vistaListas">
                {listas && listas.map(lista => (
                    <div key={lista.id}>
                        <div className="fila-between">
                            <h4>{lista.listaName}</h4>
                            <span className="material-symbols-outlined">more_vert</span>
                        </div>
                        <div className="fila-start">
                            <div className="fila-start-group">
                                <span className="material-symbols-outlined icon-medium">group</span>
                                <h5>{lista.members} pers.</h5>
                            </div>
                            <div className="fila-start-group">
                                <span className="material-symbols-outlined icon-medium">{""}</span>
                                <h5>{lista.plan}</h5>
                            </div>
                        </div>
                        <Lista 
                            key={lista.id}
                            id={lista.id}
                            listaName={lista.listaName}
                            members={lista.members}
                            plan={lista.plan}
                            deleteLista={deleteLista}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home