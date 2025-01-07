import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ButtonFAB from '../ui-components/ButtonFAB'
import NavBar from "./NavBar"
import OptionsMenuListHome from "../components/OptionsMenuListHome"
import ToggleLista from "./ToggleLista";
import EmptyState from "../ui-components/EmptyState";

const Home = ({ usuario, listas, addLista, deleteLista, handleArchive, AllArchived, handleIsNotified, handleDuplicate, updateLista }) => {
    const [isEStateHome, setIsEStateHome] = useState(false)
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(null)
    const [filteredListas, setFilteredListas] = useState(listas)
    const archivadosRef = useRef(null)
    const optionsMenuListHomeRef = useRef(null)
    const buttonMenuRefs = useRef({})
    const navigate = useNavigate()

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
                    <h1 style={{fontWeight: "500"}}>{`Hola ${usuario.nombre}!`}</h1>
                    <h5>{listaslength === 1 ? "Tienes 1 lista activa" : `Tienes ${listaslength} listas activas`}</h5>
                </div>
            </div>
            {isEStateHome && (
                <EmptyState
                    addLista={addLista}
                    img={"_e409535c-8a88-419e-8a05-5437f5a91f35-removebg-preview"}
                    alt={"Set of grocery bags full of items"}
                    description={"Compra en grupo creando tu primera lista ahora"}
                    onClick={() => navigate(`/${"newlist"}`)}
                    buttonCopy={"Nueva lista"}
                    // style={{display: "none"}}
                />
            )}
            {!isEStateHome && (
                <>
                <ToggleLista
                    usuario={usuario}
                    listas={listas}
                    setFilteredListas={setFilteredListas}
                />
                <div className="listasHome" style={{marginTop: "10px"}}>
                    {filteredListas && (
                        <>
                            {filteredListas.length > 0 ? (
                                <>
                                    {filteredListas.map(lista => (
                                        <div key={lista.id}>
                                            <div className="vistaDatos app-margin">
                                                <div className="fila-between" style={{alignItems: "flex-start"}}>
                                                    <div className="linkedPart" style={{flex: "1"}}>
                                                        <Link to={`/list/${lista.id}`} style={{ textDecoration: 'none', color: 'inherit'}}>
                                                            <div className="fila-between">
                                                                <h3 style={{fontWeight: "500", marginBottom: "4px"}}>{lista.listaName}</h3>
                                                            </div>
                                                            <div className="fila-start">
                                                                <div className="fila-start-group">
                                                                    <span className="material-symbols-outlined icon-small">group</span>
                                                                    <h5>{`${lista.userMember.length} pers.`}</h5>
                                                                </div>
                                                                <h5>{`Items: ${getListaItemsLength(lista.id)}`}</h5>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                    <div className="fila-start" style={{position: "relative"}}>
                                                        <span className="material-symbols-outlined icon-medium pointer" onClick={() => {handleIsNotified(lista)}}>{lista.userConfig?.[usuario.uid]?.isNotified ? "notifications_active" : "notifications_off"}</span>
                                                        <span className="material-symbols-outlined icon-medium pointer"style={{marginLeft:"4px"}} onClick={(e) => handleMenuVisibility(e, lista.id)} ref={el => buttonMenuRefs.current[lista.id] = el}>more_vert</span>
                                                        {isOptionsMenuVisible === lista.id && ( 
                                                            <OptionsMenuListHome
                                                                style={{right: "0"}}
                                                                key={lista.id}
                                                                ref={optionsMenuListHomeRef}
                                                                handleDuplicate={() => handleDuplicate(lista.id)}
                                                                handleArchive={handleArchive}
                                                                deleteLista={deleteLista}
                                                                lista={lista}
                                                                usuario={usuario}
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
                                            <h5 className="app-margin center">No tienes listas aquí </h5>
                                        )}
                                    </>
                                )
                            }
                        </>
                    )}
                </div>
                <h5 className="app-margin center archivedSummary" style={{ display: AllArchived > 0 ? "flex" : "none", cursor: "pointer", marginTop:"15px"}} onClick={() => navigate("/archived")} ref={archivadosRef}>{AllArchived === 1 ? "1 lista archivada" : `${AllArchived} listas archivadas`}</h5>
                <ButtonFAB
                    path={"newlist"}
                    icon={"add"}
                    label={""}
                />
                </>
            )}
        </div>
    )
}

export default Home