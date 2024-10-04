import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import OptionsMenuListHome from "../components/OptionsMenuListHome"

const Archived = ({ listas, handleArchive, deleteLista }) => {
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
    const optionsMenuListHomeRef = useRef(null)
    const buttonMenuRef = useRef(null)
    const navigate = useNavigate()
    const listaslength = listas.length
    
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

    const getListaItemsLength = (id) => {
        const lista = listas.find(lista => lista.id === id)
        return lista.categories.reduce((total, category) => {
            return total + category.items.length
        }, 0)
    }

    return (
        <div className="Home app">
            <div className="head">
                <div className="app-margin">
                    <div className="headerLista">
                        <div className="headerArrow">
                            <span className="material-symbols-outlined icon-large" onClick={() => navigate("/")}>arrow_back</span>
                        </div>
                        <div className="headerText" style={{flex: "1"}}>
                            <div className="fila-between">
                                <h2 className="headerTitle">Archivo</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                                        <h2>{lista.listaName}</h2>
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
                                <span className="material-symbols-outlined"style={{marginLeft:"4px"}} onClick={handleMenuVisibility} ref={buttonMenuRef}>more_vert</span>
                                {isOptionsMenuVisible && 
                                    <OptionsMenuListHome
                                        ref={optionsMenuListHomeRef}
                                        handleArchive={() => handleArchive(lista.id)}
                                        deleteLista={deleteLista}
                                        listaArchivada={lista}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Archived