import { useEffect, useRef } from "react"

const SubHeader = ({ items, categories, itemsAdquirido, price, upNumber, downNumber}) => {

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
        <div className="subHeaderLista" ref={SubHeaderRef}>
            <div className="headerLista-firstLine">
                <h3>Items: {items}</h3>
                <h4>Total</h4>
            </div>
            <div className="subHeaderLista-secondLine">
                <h5>Adquirido: {itemsAdquirido}</h5>
                <h3>{price} €</h3>
            </div>
            <div className="headerLista-secondLine">
                <div className="headerLista-secondLine-group">
                    <span className="material-symbols-outlined icon-medium">thumb_up</span>
                    <h4>{upNumber}</h4>
                </div>
                <div className="headerLista-secondLine-group">
                    <span className="material-symbols-outlined icon-medium">thumb_down</span>
                    <h4>{downNumber}</h4>
                </div>
                <button className="votarButton">Votar</button>
            </div>
        </div>
      )
}

export default SubHeader