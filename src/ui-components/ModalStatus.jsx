
const ModalStatus = ({ children, title, overlayOnClick, closeOnClick, backgroundColor, icon, iconColor }) => {
  return (
    <div className="modal-container" onClick={overlayOnClick}>   
        <div className="popUp" style={{backgroundColor: backgroundColor}}>
            <div style={{ margin: "15px 0px", textAlign: "center"}}>
                <span className="material-symbols-outlined icon-medium" style={{position: "absolute", right: "20px", cursor: "pointer"}} onClick={closeOnClick}>close</span>
                <span className="material-symbols-outlined icon-xxxlarge" style={{color: iconColor, margin: "15px 0px"}}>{icon}</span>
                <h3 style={{ fontWeight: "600", whiteSpace: "wrap"}}>{title}</h3>
            </div>
            {children}
        </div>
    </div>
  )
}

export default ModalStatus
