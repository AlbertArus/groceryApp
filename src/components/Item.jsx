
const Item = ({ ItemName, price, isChecked, onClick }) => {

  return (
    <div className="itemLine">
        <span className="material-symbols-outlined icon-large">drag_indicator</span>
        <div className="ItemCheckbox" onClick={onClick} style={{backgroundColor: isChecked ? "green" : "transparent"}}></div>
        <div className="ItemText">
          <h4 className="ItemName" style={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? '#9E9E9E' : 'black' }}>{ItemName}</h4>
          <h4 className="ItemPrice" style={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? '#9E9E9E' : 'black' }}>{price} €</h4>
        </div>
        <span className="material-symbols-outlined hidden">delete</span>
    </div>
  )
}

export default Item