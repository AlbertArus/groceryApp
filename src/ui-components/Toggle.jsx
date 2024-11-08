import { useEffect } from "react"
import { useState } from "react"
import { useUsuario } from "../UsuarioContext"

const Toggle = ({form, option1, option2, option3, listas, lista, setFilteredListas, setFilteredListaForItems, isToggleSelected, setIsToggleSelected}) => {
    const usuario = useUsuario
    const [isToggleActive, setIsToggleActive] = useState(option1)

    const handleClickActive = (toggle) => {
        setIsToggleActive(toggle)
    }

    const handleClickSelected = (toggle) => {
        setIsToggleSelected(toggle)
    }

    useEffect(() => {
        if(form === "tabs") {
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

    },[isToggleActive, usuario.uid, lista, setFilteredListaForItems, option2, option3, form])

    // useEffect(() => {
    //     let filteredListas;
    //     if (isToggleActive === "mislistas") {
    //         filteredListas = listas.filter(lista => lista.userCreator === usuario.uid)
    //     } else if (isToggleActive === "compartidas") {
    //         filteredListas = listas.filter(lista => lista.userCreator !== usuario.uid && lista.userMember.includes(usuario.uid))
    //     } else {
    //         filteredListas = listas
    //     }
    //     setFilteredListas(filteredListas)
    // }, [isToggleActive, listas, usuario.uid, setFilteredListas])

    return (
        <>
        {form === "bars" && (
            <div className="toggle">
                <div className="app-margin toggleDisplay">
                    <div onClick={() => handleClickSelected(option1)} className={isToggleSelected === `${option1}` ? "toggleOptions toggleBar" : "toggleOptions"}>{option1}</div>
                    <div onClick={() => handleClickSelected(option2)} className={isToggleSelected === `${option2}` ? "toggleOptions toggleBar" : "toggleOptions"}>{option2}</div>
                    <div onClick={() => handleClickSelected(option3)} className={isToggleSelected === `${option3}` ? "toggleOptions toggleBar" : "toggleOptions"} style={{display: option3 ? "block" : "none"}}>{option3}</div>
                </div>
            </div>
        )}
        {form === "tabs" && (
            <div className='app-margin center'>
                <div className='ToggleLista fila-start' style={{flex:"none"}}>
                    <h5 onClick={() => handleClickActive(option1)} className={isToggleActive === `${option1}` ? 'toggleActive' : "toggleL"}>{option1}</h5>
                    <h5 onClick={() => handleClickActive(option2)} className={isToggleActive === `${option2}` ? 'toggleActive' : "toggleL"}>{option2}</h5>
                    <h5 onClick={() => handleClickActive(option3)} className={isToggleActive === `${option3}` ? 'toggleActive' : "toggleL"} style={{display: option3 ? "block" : "none"}}>{option3}</h5>
                </div>
            </div>
        )}
    </>
    )
}

export default Toggle
