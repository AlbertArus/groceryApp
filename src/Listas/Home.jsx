import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import NewLista from "./NewLista"
import NavBar from "./NavBar"
import EStateHome from "../components/EStateHome";
import OptionsMenuListHome from "../components/OptionsMenuListHome"
// import firebaseApp from "../firebase-config.js"

const Home = ({ usuario, listas, addLista, deleteLista, handleArchive, goToArchived, AllArchived, handleNotified, handleDuplicate }) => {
    const [isEStateHome, setIsEStateHome] = useState(false)
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
    const archivadosRef = useRef(null)
    const optionsMenuListHomeRef = useRef(null)
    const buttonMenuRef = useRef(null)

    const listaslength = listas.length
    useEffect(() => {
        if (listaslength === 0) {
          setIsEStateHome(true);
        } else {
            setIsEStateHome(false);
        }
      }, [listaslength]);

    const handleMenuVisibility = (event) => {
        event.stopPropagation()
        event.preventDefault()
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

    useEffect(() => {
        const handleClickOnMenu = (event) => {
            if(optionsMenuListHomeRef.current && optionsMenuListHomeRef.current.contains(event.target)) {
                setIsOptionsMenuVisible(false)
            }
        }
        document.addEventListener("click", handleClickOnMenu);
    
        return () => {
            document.removeEventListener("click", handleClickOnMenu);
        };
    },[])

    const getListaItemsLength = (id) => {
        const lista = listas.find(lista => lista.id === id)
        return lista.categories.reduce((total, category) => {
            return total + category.items.length
        }, 0)
    }
    
    return (
        <div className="Home app">
            <NavBar
            />
            <div className="app-margin">
                <div className="welcome" style={{ marginBottom: "12px" }}>
                    <h2 style={{fontWeight: "500"}}>{`Hola ${usuario}!`}</h2>
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
                        <div className="fila-between" style={{padding: "7px", alignItems: "flex-start"}}>
                            <div className="linkedPart" style={{flex: "1"}}>
                                <Link to={`/list/${lista.id}`} style={{ textDecoration: 'none', color: 'inherit'}}>
                                    <div className="fila-between">
                                        <h3 style={{fontWeight: "500"}}>{lista.listaName}</h3>
                                    </div>
                                    <div className="fi">{`Items: ${getListaItemsLength(lista.id)}`}</div>
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
                            <div className="fila-start" style={{position: "relative"}}>
                                <span className="material-symbols-outlined" onClick={(event) => {event.preventDefault(); handleNotified(lista.id)}}>{lista.isNotified ? "notifications_active" : "notifications_off"}</span>
                                <span className="material-symbols-outlined"style={{marginLeft:"4px"}} onClick={handleMenuVisibility} ref={buttonMenuRef}>more_vert</span>
                                {isOptionsMenuVisible && 
                                    <OptionsMenuListHome
                                        ref={optionsMenuListHomeRef}
                                        handleDuplicate={() => handleDuplicate(lista.id)}
                                        handleArchive={() => handleArchive(lista.id)}
                                        deleteLista={deleteLista}
                                        listaNoArchivada={lista}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <h5 className="archivedSummary" style={{ display: AllArchived > 0 ? "block" : "none", cursor: "pointer", marginTop:"15px"}} onClick={goToArchived} ref={archivadosRef}>{AllArchived === 1 ? "1 lista archivada" : `${AllArchived} listas archivadas`}</h5>
            {!isEStateHome && 
                <NewLista
                    addLista={addLista}
                    style={{position: "absolute", bottom: "60px", right: "70px"}}
                    textNewLista={''}
                />
            }
        </div>
    )
}

export default Home