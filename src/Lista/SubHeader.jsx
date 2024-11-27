import { useEffect, useRef } from "react"

const SubHeader = ({ items, categories, itemsAdquirido, lista, price, filteredListaForItems }) => {

    const SubHeaderRef = useRef(null)
    const hideSubHeader = () => {
        if(SubHeaderRef.current) {
            if(categories.length < 2) {
                SubHeaderRef.current.style.display = "none"
            } else {
                SubHeaderRef.current.style.display = "block"
            }
        }
    }

    useEffect(() => {
        hideSubHeader()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories])

    return (
        <div className="subHeaderLista app-margin" ref={SubHeaderRef}>
            <div className="fila-between">
                <div className="columna-block">
                    <h3>Items: {filteredListaForItems ? filteredListaForItems.length : items}</h3>
                    <h5>Adquirido: {itemsAdquirido}</h5>
                </div>
                <div className="columna-block" style={{display: lista.showPrices ? "block" : "none"}}>
                    <h5 style={{display:"flex", justifyContent:"flex-end"}}>Total</h5>
                    <h3>{price}</h3>
                </div>
            </div>
        </div>
      )
}

export default SubHeader