import { useState, useRef, useEffect } from "react"

const Header = ({title, persons, planIcon, plan}) => {
    const HeaderScrollRef = useRef(null)
    const [border, setBorder] = useState("")

    useEffect (() => {
        const handleHeaderScroll = () => {
            if(window.scrollY > 400) {
                setBorder("position: sticky")
            } else {
                setBorder("none")
            }
        }

        document.addEventListener("scroll", handleHeaderScroll)
        return () => {
            document.removeEventListener("scroll", handleHeaderScroll)
        }
    }, []);

    useEffect (() => {
        if(HeaderScrollRef.current) {
            HeaderScrollRef.current.style.position = "sticky"
        }
    }, [border]);

  return (
    <div className="headerLista" ref={HeaderScrollRef}>
        <div className="headerLista-firstLine">
            <h2>{title}</h2>
            <div className="headerLista-firstLine-icons">
                <span class="material-symbols-outlined icon-large">share</span>
                <span class="material-symbols-outlined icon-xlarge">more_vert</span>
            </div>
        </div>
        <div className="headerLista-secondLine">
            <div className="headerLista-secondLine-group">
                <span class="material-symbols-outlined">group</span>
                <h4>{persons} pers.</h4>
            </div>
            <div className="headerLista-secondLine-group">
                <span class="material-symbols-outlined">{planIcon}</span>
                <h4>{plan}</h4>
            </div>
        </div>
    </div>
  )
}

export default Header