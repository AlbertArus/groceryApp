import { useEffect } from "react"

const ToggleItems = ({lista, usuario, setFilteredListaForItems, isToggleSelected, setIsToggleSelected}) => {
    // const [sinPrecios, setSinPrecios] = useState(false)

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

    // useEffect(() => {
    //     const itemsLista = lista.categories.every(category => 
    //         category.items.every(item =>
    //             item.price === ""
    //         )
    //     )
    //     if(lista.showPrices || itemsLista) {
    //         setSinPrecios(true)
    //     } else {
    //         setSinPrecios(false)
    //     }
    // },[lista.categories, lista.showPrices])

    return (
        <div className="ToggleItems">
            <div className="app-margin toggleDisplay">
                <div onClick={() => handleClick("Todos")} className={isToggleSelected === "Todos" ? "toggleOptions toggleLateral" : "toggleOptions"}>Todos</div>
                <div onClick={() => handleClick("Mis items")} className={isToggleSelected === "Mis items" ? "toggleOptions toggleLateral" : "toggleOptions"}>Mis items</div>
                {/* <div onClick={() => handleClick("Mis gastos")} className={isToggleSelected === "Mis gastos" ? "toggleOptions toggleLateral" : "toggleOptions"} style={{display: sinPrecios ? "none" : "block"}}>Mis gastos</div> */}
            </div>
        </div>
    )
}

export default ToggleItems
