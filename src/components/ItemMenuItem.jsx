
const ItemMenuItem = ({ iconName, itemMenuName, onClick, style, handleDeleteItemUserMember }) => {
    return (
      <div className="itemMenu fila-start pointer" onClick={onClick} style={style}>
        <span className="material-symbols-outlined icon-medium" style={{marginRight: "8px"}}>{iconName}</span>
        <h5>{itemMenuName}</h5>
        <span className="material-symbols-outlined icon-medium" style={{marginRight: "8px"}} onClick={handleDeleteItemUserMember}>delete</span>
      </div>
    )
  }
  
  export default ItemMenuItem