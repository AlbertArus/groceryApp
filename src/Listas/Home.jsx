import { Link } from "react-router-dom";
import NewLista from "./NewLista"
import NavBar from "./NavBar"
import { useEffect, useRef, useState } from "react";
import EStateHome from "../components/EStateHome";

const Home = ({ usuario, listas, addLista, deleteLista, listaslength, showArchived, AllArchived, handleNotified }) => {
    const archivadosRef = useRef(null)
    const [isEStateHome, setIsEStateHome] = useState(false)

    useEffect(() => {
        if (listaslength === 0) {
          setIsEStateHome(true);
        } else {
            setIsEStateHome(false);
        }
      }, [listaslength]);

    useEffect(() => {
        if (AllArchived === 0) {
            if (archivadosRef.current) {
                archivadosRef.current.style.display = "none"
            } else {
                if (archivadosRef.current) {
                    archivadosRef.current.style.display = "block"
                }
            }
        }
    }, [AllArchived])
    
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
            {isEStateHome && 
                <div className="emptyState">
                    <EStateHome 
                        addLista={addLista}
                    />
                </div>
            }
            {listas && listas.map(lista => (
                <div key={lista.id}>
                    <div className="vistaListas">
                        <Link to={`/list/${lista.id}`} className="linkListas">
                            <div className="fila-between">
                                <h4>{lista.listaName}</h4>
                                <div className="fila-start">
                                <span className="material-symbols-outlined" onClick={() => handleNotified(lista.id)}>{lista.isNotified ? "notifications_active" : "notifications_off"}</span>
                                <span className="material-symbols-outlined"style={{marginLeft:"4px"}}>more_vert</span>
                                </div>
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
            <h5 className="archivedSummary" style={{ cursor: "pointer" }} onClick={showArchived} ref={archivadosRef}>{`${AllArchived} listas archivadas`}</h5>
            <NewLista
                addLista={addLista}
            />
        </div>
    )
}

export default Home