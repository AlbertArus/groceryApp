import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import OptionsMenuListHome from "../components/OptionsMenuListHome"
import Head from "../components/Head"

const Archived = ({ listas, deleteLista, updateLista, handleArchive, usuario }) => {
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(null)
    const optionsMenuListHomeRef = useRef(null)
    const buttonMenuRefs = useRef({})
    const navigate = useNavigate()

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

    useEffect(() => {
        if(listaslength > 0) {
            return;
        } else if (listaslength === 0){
            navigate("/")
        }
    },[listaslength])

    return (
        <div className="Home app">
            <Head
                path={""}
                sectionName={"Archivo"}
            />
            <div className="app-margin">
                <div className="welcome" style={{ marginBottom: "12px" }}>
                    <h5>{listaslength === 1 ? "Tienes 1 lista archivada" : `Tienes ${listaslength} listas archivadas`}</h5>
                </div>
            </div>
            {listas && listas.map(lista => 
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
                                            <span className="material-symbols-outlined icon-medium">group</span>
                                            <h5>{lista.userMember.length} pers.</h5>
                                        </div>
                                        <h5>{`Items: ${getListaItemsLength(lista.id)}`}</h5>
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
            )}
        </div>
    )
}

export default Archived