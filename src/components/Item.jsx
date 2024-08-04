const Item = ({ ItemName, price, }) => {

  return (
    <div className="itemLine">
        <span className="material-symbols-outlined icon-large">drag_indicator</span>
        <input type="checkbox" className="radioButton"></input>
        <h4 className="ItemName">{ItemName}</h4>
        <h4>{price} €</h4>
        <span className="material-symbols-outlined hidden">delete</span>
    </div>
  )
}

export default Item