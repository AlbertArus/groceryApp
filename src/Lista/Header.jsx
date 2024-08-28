import { useState, useRef, useEffect } from "react"
import OptionsMenu from "../components/OptionsMenu"

const Header = ({title, persons, planIcon, plan, votesShown, handleVotesVisible}) => {
    const [OptionsMenuVisible, setOptionsMenuVisible] = useState(false)
    const OptionsMenuRef = useRef(null)

    const handleMenuVisibility = () => {
        setOptionsMenuVisible(prevState => !prevState)
    }

    useEffect(() => {
        window.addEventListener("click", function() {
            if(OptionsMenuVisible) {
                setOptionsMenuVisible(false)
            }
        })
    },[OptionsMenuVisible])

    useEffect(() => {
        if(OptionsMenuRef.current) {
            OptionsMenuRef.current.style.display(OptionsMenuVisible ? "block" : "none") 
        }
    }, [OptionsMenuVisible])
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
                            <h2 className="headerTitle">{title}</h2>
                            <div className="headerLista-firstLine-icons">
                                <span className="material-symbols-outlined icon-large">share</span>
                                <span className="material-symbols-outlined icon-large" onClick={handleMenuVisibility}>more_vert</span>
                                {OptionsMenuVisible && 
                                <OptionsMenu 
                                    ref={OptionsMenuRef}
                                    votesShown={votesShown}
                                    handleVotesVisible={handleVotesVisible}
                                />
                                }
                            </div>
                        </div>
                        <div className="fila-start">
                            <div className="fila-start-group">
                                <span className="material-symbols-outlined icon-medium">group</span>
                                <h5>{persons} pers.</h5>
                            </div>
                            <div className="fila-start-group">
                                <span className="material-symbols-outlined icon-medium">{planIcon}</span>
                                <h5>{plan}</h5>
                            </div>
                            {/* <button onClick={handleVotesVisible}>{votesShown ? "Ocultar" : "Mostrar" } </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Header