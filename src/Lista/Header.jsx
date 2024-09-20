import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import OptionsMenu from "../components/OptionsMenu"
import ShareButton from "../components/ShareButton"

const Header = ({listaName, members, planIcon, plan, votesShown, handleVotesVisible, handleArchive, deleteLista}) => {
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
    const optionsMenuRef = useRef(null)
    const buttonMenuRef = useRef(null)
    const navigate = useNavigate()

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
                            <ShareButton />
                            <span className="material-symbols-outlined icon-large" onClick={handleMenuVisibility} ref={buttonMenuRef}>more_vert</span>
                            {isOptionsMenuVisible && 
                                <OptionsMenu 
                                    ref={optionsMenuRef}
                                    votesShown={votesShown}
                                    handleVotesVisible={handleVotesVisible}
                                    deleteLista={deleteLista}
                                    handleArchive={handleArchive}
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
  )
}

export default Header