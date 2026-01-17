
const Modal = ({ children, title, subtitle, overlayOnClick, closeOnClick, styleSpan }) => {
 
   const handleOverlayClick = overlayOnClick || (() => {});
   const handleCloseClick = closeOnClick || (() => {});
 
   return (
    <div className="modal-container" onClick={handleOverlayClick}>   
        <div className="popUp" style={{backgroundColor: "white"}} onClick={(e) => e.stopPropagation()}>
            <div className="columna-start" style={{margin: "10px 0px"}}>
                <div className="fila-between">
                    <h4 style={{ fontWeight: "600" }}>{title}</h4>
                    <span className="material-symbols-outlined icon-medium" onClick={handleCloseClick} style={styleSpan}>close</span>
                </div>
                <h5 style={{marginTop: "5px", whiteSpace: "normal" }}>{subtitle}</h5>
            </div>
            {children}
        </div>
    </div>
  )
}

export default Modal
