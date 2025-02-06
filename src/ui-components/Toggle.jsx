import { useEffect, useState } from "react"
import { useUsuario } from "../UsuarioContext"
import { useSearchParams } from "react-router-dom"
import Camera from "./Camera"

const Toggle = ({form, option1, option2, option3, origin, listas, lista, setFilteredListas, setFilteredListaForItems, isToggleActive, setIsToggleActive, isToggleSelected, setIsToggleSelected, setSearchParams, isScrolled, setIsScrolled }) => {
    const {usuario} = useUsuario()
    const [searchParams] = useSearchParams()
    const [cameraOpen, setCameraOpen] = useState(false);

    const handleClickActive = (toggle) => {
        setIsToggleActive(toggle)
        setSearchParams((prevParams) => {
            const updatedParams = new URLSearchParams(prevParams)
            updatedParams.set("view", updatedParams.get("view") || "lista")
            updatedParams.set("area", toggle === "Pagos" ? "pagos" : toggle === "Mis items" ? "misitems" : "todos")
            return updatedParams
        })
    }
    
    const handleClickSelected = (toggle) => {
        setIsToggleSelected(toggle)
        setSearchParams((prevParams) => {
            const updatedParams = new URLSearchParams(prevParams)
            updatedParams.set("view", toggle === "Pagos" ? "payments" : "lista")
            return updatedParams
        })
    }
    useEffect(() => {
        if(form === "tabs" && searchParams.get("view")==="lista") {
            let filteredListaForItems
            if(isToggleActive === `${option2}` || isToggleActive === `${option3}`) {
                filteredListaForItems = lista.categories.flatMap(category => 
                    category.items.filter(item => item.itemUserMember.includes(usuario?.uid))
                )
            } else {
                filteredListaForItems = lista.categories.flatMap(category => category.items)
            }
            setFilteredListaForItems(filteredListaForItems)
        }

    },[isToggleActive, usuario.uid, lista, setFilteredListaForItems, option2, option3, form, searchParams])

    return (
        <>
        {form === "bars" && (
            <div className="toggle" style={{top: isScrolled ? "55px" : "40px"}}>
                <div className="app-margin toggleBars">
                    <h4 onClick={() => handleClickSelected(option1)} className={isToggleSelected === `${option1}` ? "toggleOptions toggleBar" : "toggleOptions"}>{option1}</h4>
                    <h4 onClick={() => handleClickSelected(option2)} className={isToggleSelected === `${option2}` ? "toggleOptions toggleBar" : "toggleOptions"}>{option2}</h4>
                    <h4 onClick={() => handleClickSelected(option3)} className={isToggleSelected === `${option3}` ? "toggleOptions toggleBar" : "toggleOptions"} style={{display: option3 ? "block" : "none"}}>{option3}</h4>
                </div>
            </div>
        )}
        {form === "tabs" && (
            <>
            {searchParams.get("view") !== "payments" ? (
            <div className="fila-between" style={{justifyContent: "space-around", flex: "none"}}>
                <div className="search-container fila-start" style={{ padding: "5px 5px 0px 5px", marginLeft: "10px" }}>
                    <span className="material-symbols-outlined">search</span>
                </div>
                <div className="toggleListaSpace" style={{top: isScrolled ? "88px" : "73px"}}>
                    <div className='app-margin center'>
                        <div className='ToggleLista fila-start' style={{flex:"none"}}>
                            <h5 onClick={() => handleClickActive(option1)} className={isToggleActive === `${option1}` ? 'toggleActive center' : "toggleL"}>{option1}</h5>
                            <h5 onClick={() => handleClickActive(option2)} className={isToggleActive === `${option2}` ? 'toggleActive' : "toggleL"}>{option2}</h5>
                            <h5 onClick={() => handleClickActive(option3)} className={isToggleActive === `${option3}` ? 'toggleActive' : "toggleL"} style={{display: option3 ? "block" : "none"}}>{option3}</h5>
                        </div>
                    </div>
                </div>
                <Camera
                    lista={lista}
                />
            </div>
            ) : (
                <div className="toggleListaSpace" style={{top: isScrolled ? "88px" : "73px"}}>
                    <div className='app-margin center'>
                        <div className='ToggleLista fila-start' style={{flex:"none"}}>
                            <h5 onClick={() => handleClickActive(option1)} className={isToggleActive === `${option1}` ? 'toggleActive center' : "toggleL"}>{option1}</h5>
                            <h5 onClick={() => handleClickActive(option2)} className={isToggleActive === `${option2}` ? 'toggleActive' : "toggleL"}>{option2}</h5>
                            <h5 onClick={() => handleClickActive(option3)} className={isToggleActive === `${option3}` ? 'toggleActive' : "toggleL"} style={{display: option3 ? "block" : "none"}}>{option3}</h5>
                        </div>
                    </div>
                </div>
            )}
            </>
        )}
    </>
    )
}

export default Toggle
