// import { useEffect } from "react"
// import { useState } from "react"
// import { useUsuario } from "../UsuarioContext"

const Toggle = ({form, option1, option2, option3, origin, listas, lista, setFilteredListas, setFilteredListaForItems, isToggleActive, setIsToggleActive, isToggleSelected, setIsToggleSelected, setSearchParams}) => {
    // const usuario = useUsuario

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
    
    // useEffect(() => {
    //     if(form === "tabs") {
    //         let filteredListaForItems
    //         if(isToggleActive === `${option2}` || isToggleActive === `${option3}`) {
    //             filteredListaForItems = lista.categories.flatMap(category => 
    //                 category.items.filter(item => item.itemUserMember.includes(usuario?.uid))
    //             )
    //         } else {
    //             filteredListaForItems = lista.categories.flatMap(category => category.items)
    //         }dos
    //         setFilteredListaForItems(filteredListaForItems)
    //     }

    // },[isToggleActive, usuario.uid, lista, setFilteredListaForItems, option2, option3, form])

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

        // useEffect(() => {
        //     if (origin=== "pagos")
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
                <div className="app-margin toggleBars">
                    <h4 onClick={() => handleClickSelected(option1)} className={isToggleSelected === `${option1}` ? "toggleOptions toggleBar" : "toggleOptions"}>{option1}</h4>
                    <h4 onClick={() => handleClickSelected(option2)} className={isToggleSelected === `${option2}` ? "toggleOptions toggleBar" : "toggleOptions"}>{option2}</h4>
                    <h4 onClick={() => handleClickSelected(option3)} className={isToggleSelected === `${option3}` ? "toggleOptions toggleBar" : "toggleOptions"} style={{display: option3 ? "block" : "none"}}>{option3}</h4>
                </div>
            </div>
        )}
        {form === "tabs" && (
            <div className='app-margin center'>
                <div className='ToggleLista fila-start' style={{flex:"none"}}>
                    <h5 onClick={() => handleClickActive(option1)} className={isToggleActive === `${option1}` ? 'toggleActive center' : "toggleL"}>{option1}</h5>
                    <h5 onClick={() => handleClickActive(option2)} className={isToggleActive === `${option2}` ? 'toggleActive' : "toggleL"}>{option2}</h5>
                    <h5 onClick={() => handleClickActive(option3)} className={isToggleActive === `${option3}` ? 'toggleActive' : "toggleL"} style={{display: option3 ? "block" : "none"}}>{option3}</h5>
                </div>
            </div>
        )}
    </>
    )
}

export default Toggle
