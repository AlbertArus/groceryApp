import { useState, useEffect, useRef } from "react"
import OptionsMenuNavBar from "../components/OptionsMenuNavBar"
import { useNavigate } from "react-router-dom"

const NavBar = () => {

    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
    const optionsMenuNavBarRef = useRef(null)
    const buttonMenuRef = useRef(null)
    const navigate = useNavigate()

    const handleMenuVisibility = () => {
        setIsOptionsMenuVisible(prevState => !prevState)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if ( optionsMenuNavBarRef.current && !optionsMenuNavBarRef.current.contains(event.target) && buttonMenuRef.current && !buttonMenuRef.current.contains(event.target)) {
                setIsOptionsMenuVisible(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOnMenu = (event) => {
            if(optionsMenuNavBarRef.current && optionsMenuNavBarRef.current.contains(event.target)) {
                setIsOptionsMenuVisible(false)
            }
        }
        document.addEventListener("click", handleClickOnMenu);
    
        return () => {
            document.removeEventListener("click", handleClickOnMenu);
        };
    },[])

    useEffect(() => {
        if(optionsMenuNavBarRef.current) {
            optionsMenuNavBarRef.current.style.display = isOptionsMenuVisible ? "block" : "none"
        }
    }, [isOptionsMenuVisible])

    return (
        <div className="NavBar head">
            <div className="fila-between app-margin" style={{marginTop: "7px"}}>
                <div className="titleNavBar fila-start-group">
                <img className="favicon" src="/Fotos GroceryApp/favicon/favicon-16x16.png" alt="iconWeb" />
                <h3 style={{marginLeft: "6px"}}>GroceryApp</h3>
                </div>
                <div className="iconsNavBar fila-start" style={{position: "relative", alignItems: "center"}}>
                    <button className="buttonRegistro pointer" onClick={() => navigate("/Registro")}>Registrarse</button>
                    <span className="material-symbols-outlined pointer">notifications</span>
                    <span className="material-symbols-outlined pointer" onClick={handleMenuVisibility} ref={buttonMenuRef}>more_vert</span>
                    {isOptionsMenuVisible && 
                        <OptionsMenuNavBar
                            ref={optionsMenuNavBarRef}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default NavBar