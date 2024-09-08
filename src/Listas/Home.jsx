// import { useState } from "react"
// import { v4 as uuidv4 } from 'uuid'
import { Link } from "react-router-dom";
import NewLista from "./NewLista"
import NavBar from "./NavBar"

const Home = ({ usuario, listas, addLista, deleteLista, listaslength, updateListaItems, updateListaCategories, setListas, loading, setLoading }) => {

    return (
        <div className="Home app">
            <NavBar

            />
            <div className="app-margin">
                <div className="welcome" style={{ marginBottom: "12px" }}>
                    <h2>{`Hola ${usuario}!`}</h2>
                    <h5>{`Tienes ${listaslength} listas activas.`}</h5>
                </div>
            </div>
            {listas && listas.map(lista => (
                <div key={lista.id}>
                    <div className="vistaListas">
                        <Link to={`/list/${lista.id}`} className="linkListas">
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
                        </Link>
                    </div>
                </div>
            ))}
            <NewLista
                addLista={addLista}
            />
        </div>
    )
}

export default Home