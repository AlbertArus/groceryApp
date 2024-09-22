import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import NewLista from "./NewLista"
import NavBar from "./NavBar"
import EStateHome from "../components/EStateHome";
import OptionsMenuListHome from "../components/OptionsMenuListHome"

const Home = ({ usuario, listas, addLista, deleteLista, handleArchive, goToArchived, AllArchived, handleNotified, handleDuplicate }) => {
    const [isEStateHome, setIsEStateHome] = useState(false)
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
    const archivadosRef = useRef(null)
    const optionsMenuListHomeRef = useRef(null)
    const buttonMenuRef = useRef(null)

    const listaslength = listas.length
    console.log(listas)
    useEffect(() => {
        if (listaslength === 0) {
          setIsEStateHome(true);
        } else {
            setIsEStateHome(false);
        }
      }, [listaslength]);

    const handleMenuVisibility = (event) => {
        event.stopPropagation()
        setIsOptionsMenuVisible(prevState => !prevState)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if ( optionsMenuListHomeRef.current && !optionsMenuListHomeRef.current.contains(event.target) && buttonMenuRef.current && !buttonMenuRef.current.contains(event.target)) {
                setIsOptionsMenuVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    return (
        <div className="Home app">
            <NavBar
            />
            <div className="app-margin">
                <div className="welcome" style={{ marginBottom: "12px" }}>
                    <h2>{`Hola ${usuario}!`}</h2>
                    <h5>{listaslength === 1 ? "Tienes 1 lista activa" : `Tienes ${listaslength} listas activas`}</h5>
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
                    <div className="vistaListas app-margin">
                        <Link to={`/list/${lista.id}`} className="linkListas">
                            <div className="fila-between">
                                <h4>{lista.listaName}</h4>
                                <div className="fila-start" style={{position: "relative"}}>
                                    <span className="material-symbols-outlined" onClick={() => handleNotified(lista.id)}>{lista.isNotified ? "notifications_active" : "notifications_off"}</span>
                                    <span className="material-symbols-outlined"style={{marginLeft:"4px"}} onClick={handleMenuVisibility} ref={buttonMenuRef}>more_vert</span>
                                    {isOptionsMenuVisible && 
                                        <OptionsMenuListHome
                                            ref={optionsMenuListHomeRef}
                                            handleDuplicate={handleDuplicate}
                                            handleArchive={() => handleArchive(lista.id)}
                                            deleteLista={deleteLista}
                                        />
                                    }
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
            <h5 className="archivedSummary" style={{ display: AllArchived > 0 ? "block" : "none", cursor: "pointer", marginTop:"15px"}} onClick={goToArchived} ref={archivadosRef}>{AllArchived === 1 ? "1 lista archivada" : `${AllArchived} listas archivadas`}</h5>
            {!isEStateHome && 
                <NewLista
                    addLista={addLista}
                />
            }
        </div>
    )
}

export default Home