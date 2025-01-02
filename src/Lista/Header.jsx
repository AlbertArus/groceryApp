import { useState, useRef, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import OptionsMenu from "../components/OptionsMenu"
import {ShareButton} from "../components/ShareButton"
import MembersList from "../components/MembersList"

const Header = ({ deleteLista, itemslength, lista, handleCheckAll, handleUnCheckAll, UsuarioCompleto, updateLista, totalGastoLista, isScrolled, setIsScrolled, price, filteredListaForItems }) => {
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
    const [isMembersShown, setIsMembersShown] = useState(false)
    const optionsMenuRef = useRef(null)
    const buttonMenuRef = useRef(null)
    const membersListRef = useRef(null)
    const buttonMembersListRef = useRef(null)
    const navigate = useNavigate()
    const handleShare = ShareButton(window.location.href, lista);
    const [searchParams] = useSearchParams()

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
            const scrolled = window.scrollY > 90 
            setIsScrolled(scrolled)
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isScrolled])

  return (
    <div className="head" style={{marginBottom: "0px"}}>
        <div className="app-margin">
            <div className="fila-between" style={{width: "100%", padding: "4px 0px", alignItems: "flex-start"}}>
                <span className="material-symbols-outlined icon-large" style={{marginRight: "18px", marginLeft: "-3.5px"}} onClick={() => {!lista.isArchived ? navigate("/") : navigate("/archived")}}>arrow_back</span>
                <div className="columna-start" style={{alignItems: "center"}}>
                    <h2 style={{fontWeight: "500"}}>{lista.listaName || ""}</h2>
                    {searchParams.get("view") === "payments" ? (
                        <div className="datosSubHeader fila-start" style={{display: isScrolled ? "flex" : "none"}}>
                            <h5 style={{marginRight: "8px"}}>Lista: {(lista.listPrice || 0).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</h5>
                            <h5 style={{display: lista.showPrices ? "flex" : "none"}}>Pagado: {totalGastoLista.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</h5>
                        </div>
                    ) : (
                        <div className="datosSubHeader fila-start" style={{display: isScrolled ? "flex" : "none"}}>
                            <h5 style={{marginRight: "8px"}}>Items: {filteredListaForItems ? filteredListaForItems.length : itemslength}</h5>
                            <h5 style={{display: lista.showPrices ? "flex" : "none"}}>Precio: {price}</h5>
                        </div>
                    )}
                </div>
                <div className="fila-start" style={{position: "relative"}}>
                    <div className="fila-start-group pointer" style={{position: "relative"}} onClick={handleMembersShown} ref={buttonMembersListRef}>
                        <span className="material-symbols-outlined icon-medium">group</span>
                        <h4>{lista.userMember.length}</h4>
                        {isMembersShown &&
                            <MembersList
                                ref={membersListRef}
                                lista={lista}
                                UsuarioCompleto={UsuarioCompleto}
                            />
                        }
                    </div>
                    <span className="material-symbols-outlined icon-medium pointer" onClick={handleShare}>share</span>
                    <span className="material-symbols-outlined icon-large pointer" onClick={handleMenuVisibility} ref={buttonMenuRef}>more_vert</span>
                    {isOptionsMenuVisible && 
                        <OptionsMenu
                            style={{right:"0"}} 
                            ref={optionsMenuRef}
                            deleteLista={deleteLista}
                            itemslength={itemslength}
                            lista={lista}
                            handleCheckAll={handleCheckAll}
                            handleUnCheckAll={handleUnCheckAll}
                            updateLista={updateLista}
                        />
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Header