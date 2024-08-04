const SubHeader = ({ items, price, itemsAdquirido, upNumber, downNumber}) => {
    return (
        <div className="subHeaderLista">
            <div className="headerLista-firstLine">
                <h3>Items: {items}</h3>
                <h4>Total</h4>
            </div>
            <div className="subHeaderLista-secondLine">
                <h4>Adquirido: {itemsAdquirido}</h4>
                <h3>{price} €</h3>
            </div>
            <div className="headerLista-secondLine">
                <div className="headerLista-secondLine-group">
                    <span class="material-symbols-outlined">thumb_up</span>
                    <h4>{upNumber}</h4>
                </div>
                <div className="headerLista-secondLine-group">
                    <span class="material-symbols-outlined">thumb_down</span>
                    <h4>{downNumber}</h4>
                </div>
                <button className="votarButton">Votar</button>
            </div>
        </div>
      )
}

export default SubHeader