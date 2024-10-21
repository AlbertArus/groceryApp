import { useEffect, useState } from "react"

const ToggleItems = ({lista, usuario, setFilteredListaForItems}) => {
    const [isToggleSelected, setIsToggleSelected] = useState("Todos")

    const handleClick = (toggle) => {
        setIsToggleSelected(toggle)
    }

    useEffect(() => {
        let filteredListaForItems
        if(isToggleSelected === "Mis items") {
            filteredListaForItems = lista.categories.flatMap(category => 
                category.items.filter(item => item.itemUserMember.includes(usuario.uid))
            )
        } else {
            filteredListaForItems = lista.categories.flatMap(category => category.items)
        }
        setFilteredListaForItems(filteredListaForItems)

    },[isToggleSelected, usuario.uid, lista, setFilteredListaForItems])

    return (
        <div className="ToggleItems">
            <div className="app-margin toggleDisplay">
                <div onClick={() => handleClick("Todos")} className={isToggleSelected === "Todos" ? "toggleOptions toggleLateral" : "toggleOptions"}>Todos</div>
                <div onClick={() => handleClick("Mis items")} className={isToggleSelected === "Mis items" ? "toggleOptions toggleLateral" : "toggleOptions"}>Mis items</div>
            </div>
        </div>
    )
}

export default ToggleItems
