
const Modal = ({ children, title, subtitle, overlayOnClick, closeOnClick, styleSpan }) => {
  return (
    <div className="modal-container" onClick={overlayOnClick}>   
        <div className="popUp" style={{backgroundColor: "white"}}>
            <div className="columna-start" style={{margin: "10px 0px"}}>
                <div className="fila-between">
                    <h4 style={{ fontWeight: "600" }}>{title}</h4>
                    <span className="material-symbols-outlined icon-medium" onClick={closeOnClick} style={styleSpan}>close</span>
                </div>
                <h5 style={{marginTop: "5px" }}>{subtitle}</h5>
            </div>
            {children}
        </div>
    </div>
  )
}

export default Modal
