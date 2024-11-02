import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import NewLista from "./NewLista"
import NavBar from "./NavBar"
import EStateHome from "../components/EStateHome";
import OptionsMenuListHome from "../components/OptionsMenuListHome"
import ToggleLista from "./ToggleLista";

const Home = ({ usuario, listas, addLista, deleteLista, handleArchive, goToArchived, AllArchived, handleNotified, handleDuplicate, setListas }) => {
    const [isEStateHome, setIsEStateHome] = useState(false)
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(null)
    const [filteredListas, setFilteredListas] = useState(listas)
    const archivadosRef = useRef(null)
    const optionsMenuListHomeRef = useRef(null)
    const buttonMenuRefs = useRef({})

    const listaslength = listas.length
    useEffect(() => {
        if (listaslength === 0) {
          setIsEStateHome(true);
        } else {
            setIsEStateHome(false);
        }
      }, [listaslength]);

    const handleMenuVisibility = (event, id) => {
        event.stopPropagation()
        event.preventDefault()
        setIsOptionsMenuVisible(prevId => (prevId === id ? null : id))
    } // Si el abierto (previo) es el mismo que el id, ciérralo, sino ábrelo

    useEffect(() => {
        const handleClickOutside = (event) => {
            if ( optionsMenuListHomeRef.current && !optionsMenuListHomeRef.current.contains(event.target) && buttonMenuRefs.current[isOptionsMenuVisible] && !buttonMenuRefs.current[isOptionsMenuVisible].contains(event.target)) {
                setIsOptionsMenuVisible(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOptionsMenuVisible]);

    useEffect(() => {
        const handleClickOnMenu = (event) => {
            if(optionsMenuListHomeRef.current && optionsMenuListHomeRef.current.contains(event.target)) {
                setIsOptionsMenuVisible(null)
            }
        }
        document.addEventListener("click", handleClickOnMenu);
    
        return () => {
            document.removeEventListener("click", handleClickOnMenu);
        };
    },[])

    const getListaItemsLength = (id) => {
        const filteredLista = filteredListas.find(lista => lista.id === id)
        return filteredLista.categories.reduce((total, category) => {
            return total + category.items.length
        }, 0)
    }

    return (
        <div className="Home app">
            <NavBar
            />
            <div className="app-margin">
                <div className="welcome" style={{ marginBottom: "12px" }}>
                    <h2 style={{fontWeight: "500"}}>{`Hola ${usuario.nombre}!`}</h2>
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
            {!isEStateHome && (
                <ToggleLista
                    usuario={usuario}
                    listas={listas}
                    setFilteredListas={setFilteredListas}
                />
            )}
            {filteredListas && (
                <>
                    {filteredListas.length > 0 ? (
                        <>
                            {filteredListas.map(lista => (
                                <div key={lista.id}>
                                    <div className="vistaListas app-margin">
                                        <div className="fila-between" style={{padding: "7px", alignItems: "flex-start"}}>
                                            <div className="linkedPart" style={{flex: "1"}}>
                                                <Link to={`/list/${lista.id}`} style={{ textDecoration: 'none', color: 'inherit'}}>
                                                    <div className="fila-between">
                                                        <h3>{lista.listaName}</h3>
                                                    </div>
                                                    <div>{`Items: ${getListaItemsLength(lista.id)}`}</div>
                                                    <div className="fila-start">
                                                        <div className="fila-start-group">
                                                            <span className="material-symbols-outlined icon-medium">group</span>
                                                            <h5>{`${lista.userMember.length} pers.`}</h5>
                                                        </div>
                                                        <div className="fila-start-group">
                                                            <span className="material-symbols-outlined icon-medium">{""}</span>
                                                            <h5>{lista.plan}</h5>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className="fila-start" style={{position: "relative"}}>
                                                <span className="material-symbols-outlined pointer" onClick={(event) => {event.preventDefault(); handleNotified(lista.id)}}>{lista.isNotified ? "notifications_active" : "notifications_off"}</span>
                                                <span className="material-symbols-outlined pointer"style={{marginLeft:"4px"}} onClick={(e) => handleMenuVisibility(e, lista.id)} ref={el => buttonMenuRefs.current[lista.id] = el}>more_vert</span>
                                                {isOptionsMenuVisible === lista.id && ( 
                                                    <OptionsMenuListHome
                                                        style={{right: "0"}}
                                                        key={lista.id}
                                                        ref={optionsMenuListHomeRef}
                                                        handleDuplicate={() => handleDuplicate(lista.id)}
                                                        handleArchive={() => handleArchive(lista.id)}
                                                        deleteLista={deleteLista}
                                                        lista={lista}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                        ) : (
                            <>
                                {!isEStateHome && (
                                    <div className="app-margin center">No tienes listas aquí </div>
                                )}
                            </>
                        )
                    }
                </>
            )}
            <h5 className="app-margin center archivedSummary" style={{ display: AllArchived > 0 ? "flex" : "none", cursor: "pointer", marginTop:"15px"}} onClick={goToArchived} ref={archivadosRef}>{AllArchived === 1 ? "1 lista archivada" : `${AllArchived} listas archivadas`}</h5>
            {!isEStateHome && 
                <NewLista
                />
            }
        </div>
    )
}

export default Home