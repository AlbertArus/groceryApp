import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import OptionsMenu from "../components/OptionsMenu"
import {ShareButton} from "../components/ShareButton"

const Header = ({listaName, members, planIcon, plan, votesShown, handleVotesVisible, handleArchive, deleteLista, itemslength, lista, items, price, handleCheckAll, handleUnCheckAll}) => {
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const optionsMenuRef = useRef(null)
    const buttonMenuRef = useRef(null)
    const navigate = useNavigate()
    const handleShare = ShareButton();

    const handleMenuVisibility = (event) => {
        event.stopPropagation()
        setIsOptionsMenuVisible(prevState => !prevState)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if ( optionsMenuRef.current && !optionsMenuRef.current.contains(event.target) && buttonMenuRef.current && !buttonMenuRef.current.contains(event.target)) {
                setIsOptionsMenuVisible(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 40) {
            setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    },[])

  return (
    <div className="head">
        <div className="app-margin">
            <div className="headerLista">
                <div className="headerArrow">
                    <span className="material-symbols-outlined icon-large" onClick={() => navigate("/")}>arrow_back</span>
                </div>
                <div className="headerText" style={{flex: "1"}}>
                    <div className="fila-between">
                        <h2 className="headerTitle">{typeof listaName === 'string' ? listaName : ''}</h2>
                        <div className="fila-start" style={{position: "relative"}}>
                            <span className="material-symbols-outlined icon-large" onClick={handleShare}>share</span>
                            <span className="material-symbols-outlined icon-large" onClick={handleMenuVisibility} ref={buttonMenuRef}>more_vert</span>
                            {isOptionsMenuVisible && 
                                <OptionsMenu 
                                    ref={optionsMenuRef}
                                    votesShown={votesShown}
                                    handleVotesVisible={handleVotesVisible}
                                    deleteLista={deleteLista}
                                    handleArchive={handleArchive}
                                    itemslength={itemslength}
                                    lista={lista}
                                    handleCheckAll={handleCheckAll}
                                    handleUnCheckAll={handleUnCheckAll}
                                />
                            }
                        </div>
                    </div>
                    <div className="fila-start" style={{display: !isScrolled ? "flex" : "none"}}>
                        <div className="fila-start-group">
                            <span className="material-symbols-outlined icon-medium">group</span>
                            <h5>{members} pers.</h5>
                        </div>
                        <div className="fila-start-group">
                            <span className="material-symbols-outlined icon-medium">{planIcon}</span>
                            <h5>{plan}</h5>
                        </div>
                    </div>
                    <div className="datosSubHeader fila-start" style={{display: isScrolled ? "flex" : "none"}}>
                        <h5 style={{marginRight: "8px"}}>Items: {items}</h5>
                        <h5>Precio: {price}</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Header