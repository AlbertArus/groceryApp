
const ItemProfile = ({titleName, itemProfileName, iconName, onClick, style}) => {
  return (
    <div className="itemSettings fila-between" onClick={onClick}>
        <div>
            <h6>{titleName}</h6>
            <h4 style={style}>{itemProfileName}</h4>
        </div>
        <div className="arrowPersonalData" onClick={onClick}>
            <span className="material-symbols-outlined icon-small">{iconName}</span>
        </div>
    </div>
  )
}

export default ItemProfile