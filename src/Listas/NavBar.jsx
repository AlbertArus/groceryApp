import { useState, useEffect, useRef } from "react"
import OptionsMenuHome from "../components/OptionsMenuHome"

const NavBar = () => {

    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
    const optionsMenuHomeRef = useRef(null)

    const handleMenuVisibility = () => {
        setIsOptionsMenuVisible(prevState => !prevState)
    }

    // Ocultar desplegable si clicas fuera. No funciona
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOptionsMenuVisible && optionsMenuHomeRef.current && !optionsMenuHomeRef.current.contains(event.target)) {
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
        if(optionsMenuHomeRef.current) {
            optionsMenuHomeRef.current.style.display = isOptionsMenuVisible ? "block" : "none"
        }
    }, [isOptionsMenuVisible])

    return (
        <div className="NavBar header headingPhone">
            <div className="fila-between app-margin" style={{marginTop: "7px", display: "flex", alignItems: "center"}}>
                <div className="titleNavBar fila-start-group">
                <img className="favicon" src="/Fotos GroceryApp/favicon/favicon-16x16.png" alt="iconWeb" />
                <h3 style={{marginLeft: "6px"}}>GroceryApp</h3>
                </div>
                <div className="iconsNavBar" style={{position: "relative"}}>
                    <button className="buttonRegistro">Registrarse</button>
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="material-symbols-outlined" onClick={handleMenuVisibility}>more_vert</span>
                    {isOptionsMenuVisible && 
                        <OptionsMenuHome
                            // ref={optionsMenuHomeRef}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default NavBar