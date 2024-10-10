import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import OptionsMenu from "../components/OptionsMenu"
import {ShareButton} from "../components/ShareButton"
import MembersList from "../components/MembersList"

const Header = ({votesShown, handleVotesVisible, handleArchive, deleteLista, itemslength, lista, items, price, handleDuplicate, handleCheckAll, handleUnCheckAll, usuario}) => {
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMembersShown, setIsMembersShown] = useState(false)
    const optionsMenuRef = useRef(null)
    const buttonMenuRef = useRef(null)
    const membersListRef = useRef(null)
    const buttonMembersListRef = useRef(null)
    const navigate = useNavigate()
    const handleShare = ShareButton();

    const handleMenuVisibility = (event) => {
        event.stopPropagation()
        setIsOptionsMenuVisible(prevState => !prevState)
    }

    const handleMembersShown = (event) => {
        event.stopPropagation()
        setIsMembersShown(prevState => !prevState)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target) && buttonMenuRef.current && !buttonMenuRef.current.contains(event.target)) {
                setIsOptionsMenuVisible(false);
            }
            if (membersListRef.current && !membersListRef.current.contains(event.target) && buttonMembersListRef.current && !buttonMembersListRef.current.contains(event.target)) {
                setIsMembersShown(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOnMenu = (event) => {
            if((optionsMenuRef.current && optionsMenuRef.current.contains(event.target)) || (membersListRef.current && membersListRef.current.contains(event.target))) {
                setIsOptionsMenuVisible(false)
                setIsMembersShown(false)
            }
        }
        document.addEventListener("click", handleClickOnMenu);
    
        return () => {
            document.removeEventListener("click", handleClickOnMenu);
        };
    },[])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40)
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    },[])

  return (
    <div className="head">
        <div className="app-margin ">
            <div className="headerLista">
                <div className="headerArrow">
                    <span className="material-symbols-outlined icon-large" onClick={() => {!lista.isArchived ? navigate("/") : navigate("/archived")}}>arrow_back</span>
                </div>
                <div className="headerText" style={{flex: "1"}}>
                    <div className="fila-between">
                        <h3 className="headerTitle">{lista.listaName || ''}</h3>
                        <div className="fila-start" style={{position: "relative"}}>
                            <span className="material-symbols-outlined icon-large pointer" onClick={handleShare}>share</span>
                            <span className="material-symbols-outlined icon-large pointer" onClick={handleMenuVisibility} ref={buttonMenuRef}>more_vert</span>
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
                                    handleDuplicate={handleDuplicate}

                                />
                            }
                        </div>
                    </div>
                    <div className="fila-start" style={{display: !isScrolled ? "flex" : "none"}}>
                        <div className="fila-start-group pointer" style={{position: "relative"}} onClick={handleMembersShown} ref={buttonMembersListRef}>
                            <span className="material-symbols-outlined icon-medium">group</span>
                            <h5>{`${lista.userMember.length} pers.`}</h5>
                            {isMembersShown &&
                                <MembersList
                                    ref={membersListRef}
                                    lista={lista}
                                    usuario={usuario}
                                />
                            }
                        </div>
                        <div className="fila-start-group">
                            <span className="material-symbols-outlined icon-medium">{lista.planIcon}</span>
                            <h5>{lista.plan}</h5>
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