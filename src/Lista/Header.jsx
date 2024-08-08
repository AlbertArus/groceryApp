// import { useState, } from "react"

const Header = ({title, persons, planIcon, plan}) => {
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
    <div className="headerLista" style={{ position: "sticky", zIndex:"1000", top: "0" }}>
        <div className="headerArrow">
            <span class="material-symbols-outlined icon-large">arrow_back</span>
        </div>
        <div className="headerText">
            <div className="headerLista-firstLine">
                <h2 className="headerTitle">{title}</h2>
                <div className="headerLista-firstLine-icons">
                    <span class="material-symbols-outlined icon-large">share</span>
                    <span class="material-symbols-outlined icon-large">more_vert</span>
                </div>
            </div>
            <div className="headerLista-secondLine">
                <div className="headerLista-secondLine-group">
                    <span class="material-symbols-outlined icon-medium">group</span>
                    <h5>{persons} pers.</h5>
                </div>
                <div className="headerLista-secondLine-group">
                    <span class="material-symbols-outlined icon-medium">{planIcon}</span>
                    <h5>{plan}</h5>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Header