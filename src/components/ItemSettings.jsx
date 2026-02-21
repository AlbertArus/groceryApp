import React from 'react'

const ItemSettings = ({iconName, itemSettingsName, onClick, style}) => {
  return (
    <div className="itemSettings fila-start" onClick={onClick}>
      <span className="material-symbols-outlined icon-large" style={{marginRight: "20px", ...style}}>{iconName}</span>
      <h4 style={style}>{itemSettingsName}</h4>
  </div>
  )
}

export default ItemSettings
