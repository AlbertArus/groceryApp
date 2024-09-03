import { useState, useRef, useEffect } from "react"
import OptionsMenu from "../components/OptionsMenu"

const Header = ({listaName, members, planIcon, plan, descriptionLista, votesShown, handleVotesVisible, deleteLista}) => {
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
    const optionsMenuRef = useRef(null)

    const handleMenuVisibility = () => {
        setIsOptionsMenuVisible(prevState => !prevState)
    }

    // Ocultar desplegable si clicas fuera. No funciona
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOptionsMenuVisible && optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
                setIsOptionsMenuVisible(false)
            }
        }
        if (isOptionsMenuVisible) {
            document.addEventListener("click", handleClickOutside)
        }
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [isOptionsMenuVisible])

    useEffect(() => {
        if(optionsMenuRef.current) {
            optionsMenuRef.current.style.display(isOptionsMenuVisible ? "block" : "none") 
        }
    }, [isOptionsMenuVisible])

    // const [stickyHeader, setStickyHeader] = useState("")

    // Flujo para que se haga sticky al hacer scroll. Útil cuando quiera cambiar información del Header por subHeader (porque se tapará con scroll)
    // useEffect(() => {
    //     const handleHeaderScroll = () => {
    //         setStickyHeader(window.scrollY > 1)
    //     }

    //     window.addEventListener("scroll", handleHeaderScroll)
    //     return () => {
    //         window.removeEventListener("scroll", handleHeaderScroll)
    //     }
    //     }, []);
    // position: stickyHeader ? "sticky" : "static",

  return (
    <div className="head">
        <div className="header" style={{ position: "sticky", zIndex:"500", top: "0" }}>
            <div className="app-margin">
                <div className="headerLista">
                    <div className="headerArrow">
                        <span className="material-symbols-outlined icon-large">arrow_back</span>
                    </div>
                    <div className="headerText">
                        <div className="fila-between">
                            <h2 className="headerTitle">{typeof listaName === 'string' ? listaName : ''}</h2>
                            <div className="headerLista-firstLine-icons">
                                <span className="material-symbols-outlined icon-large">share</span>
                                <span className="material-symbols-outlined icon-large" onClick={handleMenuVisibility}>more_vert</span>
                                {isOptionsMenuVisible && 
                                    <OptionsMenu 
                                        ref={optionsMenuRef}
                                        votesShown={votesShown}
                                        handleVotesVisible={handleVotesVisible}
                                        deleteLista={deleteLista}
                                    />
                                }
                            </div>
                        </div>
                        <div className="fila-start">
                            <div className="fila-start-group">
                                <span className="material-symbols-outlined icon-medium">group</span>
                                <h5>{members} pers.</h5>
                            </div>
                            <div className="fila-start-group">
                                <span className="material-symbols-outlined icon-medium">{planIcon}</span>
                                <h5>{plan}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Header