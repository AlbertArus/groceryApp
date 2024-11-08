import { useEffect } from "react"

const ToggleItems = ({lista, usuario, setFilteredListaForItems, isToggleSelected, setIsToggleSelected}) => {

    const handleClick = (toggle) => {
        setIsToggleSelected(toggle)
    }

    useEffect(() => {
        let filteredListaForItems
        if(isToggleSelected === "Mis items" || isToggleSelected === "Mis gastos") {
            filteredListaForItems = lista.categories.flatMap(category => 
                category.items.filter(item => item.itemUserMember.includes(usuario.uid))
            )
        } else {
            filteredListaForItems = lista.categories.flatMap(category => category.items)
        }
        setFilteredListaForItems(filteredListaForItems)

    },[isToggleSelected, usuario.uid, lista, setFilteredListaForItems])

    return (
        <div className="toggle">
            <div className="app-margin toggleDisplay">
                <div onClick={() => handleClick("Todos")} className={isToggleSelected === "Todos" ? "toggleOptions toggleBar" : "toggleOptions"}>Todos</div>
                <div onClick={() => handleClick("Mis items")} className={isToggleSelected === "Mis items" ? "toggleOptions toggleBar" : "toggleOptions"}>Mis items</div>
                {/* <div onClick={() => handleClick("Mis gastos")} className={isToggleSelected === "Mis gastos" ? "toggleOptions toggleLateral" : "toggleOptions"} style={{display: sinPrecios ? "none" : "block"}}>Mis gastos</div> */}
            </div>
        </div>
    )
}

export default ToggleItems
