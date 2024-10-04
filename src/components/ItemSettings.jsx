import React from 'react'

const ItemSettings = ({iconName, itemSettingsName, onClick, style}) => {
  return (
    <div className="itemSettings fila-start" onClick={onClick} style={style}>
        <span className="material-symbols-outlined icon-medium" style={{marginRight: "7px"}}>{iconName}</span>
        <h4>{itemSettingsName}</h4>
  </div>
  )
}

export default ItemSettings
