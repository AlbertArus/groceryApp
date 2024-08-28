import { useEffect, useRef } from "react"

const SubHeader = ({ items, categories, itemsAdquirido, price }) => {

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
                <h3>Items: {items}</h3>
                <h4>Total</h4>
            </div>
            <div className="fila-between">
                <h5>Adquirido: {itemsAdquirido}</h5>
                <h3>{price}</h3>
            </div>
        </div>
      )
}

export default SubHeader