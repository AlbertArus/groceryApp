
const ItemMenu = ({ iconName, itemMenuName, onClick }) => {
  return (
    <div className="itemMenu fila-start" onClick={onClick}>
        <span className="material-symbols-outlined icon-medium" style={{marginRight: "8px"}}>{iconName}</span>
        <h5>{itemMenuName}</h5>
    </div>
  )
}

export default ItemMenu