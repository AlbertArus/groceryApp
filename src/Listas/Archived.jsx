import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import NavBar from "./NavBar"
import OptionsMenuListHome from "../components/OptionsMenuListHome"

const Archived = ({ listas, AllArchived, usuario, handleArchive, deleteLista }) => {
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
    const optionsMenuListHomeRef = useRef(null)
    const buttonMenuRef = useRef(null)
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

    return (
        <div className="Home app">
            <NavBar
            />
            <div className="app-margin">
                <div className="welcome" style={{ marginBottom: "12px" }}>
                    <h2>{`Hola ${usuario}!`}</h2>
                    <h5>{listaslength === 1 ? "Tienes 1 lista archivada" : `Tienes ${listaslength} listas archivadas`}</h5>
                </div>
            </div>
            {listas && listas.map(lista => lista.isArchived === true && (
                <div key={lista.id}>
                    <div className="vistaListas app-margin">
                        <Link to={`/list/${lista.id}`} className="linkListas">
                            <div className="fila-between">
                                <h4>{lista.listaName}</h4>
                                <div className="fila-start" style={{position: "relative"}}>
                                    <span className="material-symbols-outlined"style={{marginLeft:"4px"}} onClick={handleMenuVisibility} ref={buttonMenuRef}>more_vert</span>
                                    {isOptionsMenuVisible && 
                                        <OptionsMenuListHome
                                            ref={optionsMenuListHomeRef}
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
        </div>
    )
}

export default Archived