import { useState, useEffect, useRef } from "react"
import OptionsMenuNavBar from "../components/OptionsMenuNavBar"
import { useLocation } from 'react-router-dom'

const NavBar = ({isRegistered}) => {
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
    const optionsMenuNavBarRef = useRef(null)
    const buttonMenuRef = useRef(null)
    let location = useLocation()

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
            <div className="fila-between app-margin" style={{padding: "4px 0px"}}>
                <div className="titleNavBar fila-start-group">
                    <img className="favicon" src="/Fotos GroceryApp/favicon/favicon-16x16.png" alt="iconWeb" />
                    <h style={{marginLeft: "6px"}}>GroceryApp</h>
                </div>
                <div className="fila-start" style={{position: "relative", alignItems: "center", display: (location.pathname === "/registro" || isRegistered) ? "none" : "flex"}}>
                    <span className="material-symbols-outlined icon-medium pointer">notifications</span>
                    <span className="material-symbols-outlined pointer" style={{marginLeft: "4px"}} onClick={handleMenuVisibility} ref={buttonMenuRef}>more_vert</span>
                    {isOptionsMenuVisible && 
                        <OptionsMenuNavBar
                            style={{right:"0"}}
                            ref={optionsMenuNavBarRef}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default NavBar