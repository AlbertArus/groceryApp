import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import OptionsMenuListHome from "../components/OptionsMenuListHome"
import Head from "../components/Head"

const Archived = ({ listas, handleArchive, deleteLista }) => {
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(null)
    const optionsMenuListHomeRef = useRef(null)
    const buttonMenuRefs = useRef({})
    
    const listaslength = listas.length
    
    const handleMenuVisibility = (event, id) => {
        event.stopPropagation()
        setIsOptionsMenuVisible(prevId => (prevId === id ? null : id))
    }

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
        const lista = listas.find(lista => lista.id === id)
        return lista.categories.reduce((total, category) => {
            return total + category.items.length
        }, 0)
    }

    return (
        <div className="Home app">
            <Head
                sectionName={"Archivo"}
            />
            <div className="app-margin">
                <div className="welcome" style={{ marginBottom: "12px" }}>
                    <h5>{listaslength === 1 ? "Tienes 1 lista archivada" : `Tienes ${listaslength} listas archivadas`}</h5>
                </div>
            </div>
            {listas && listas.map(lista => lista.isArchived === true && (
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
                                            <h5>{lista.userMember.length} pers.</h5>
                                        </div>
                                        <div className="fila-start-group">
                                            <span className="material-symbols-outlined icon-medium">{""}</span>
                                            <h5>{lista.plan}</h5>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="fila-start" style={{position: "relative"}}>
                                <span className="material-symbols-outlined"style={{marginLeft:"4px"}} onClick={(e) => handleMenuVisibility(e, lista.id)} ref={el => buttonMenuRefs.current[lista.id] = el}>more_vert</span>
                                {isOptionsMenuVisible === lista.id && (
                                    <OptionsMenuListHome
                                        style={{right: "0"}}
                                        key={lista.id}
                                        ref={optionsMenuListHomeRef}
                                        handleArchive={() => handleArchive(lista.id, lista.isArchived)} //Envío desde aquí porque dentro colisiona con lista.id de Home que son distintas (archivadas y no)
                                        deleteLista={deleteLista}
                                        listaArchivada={lista}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Archived