import { ShareButton } from "./ShareButton"

const SharePopUp = ({setSharePopupVisible}) => {
    const handleShare = ShareButton()

  return (
    <div>   
        <div className="overlay" onClick={() => setSharePopupVisible(false)}></div>
        <div className="SharePopUP app-margin">
            <div className="fila-between" style={{ margin: "15px 0px" }}>
            <h4 style={{ fontWeight: "600" }}>¡Nueva lista creada!</h4>
            <span className="material-symbols-outlined icon-medium" onClick={() => setSharePopupVisible(false)}>close</span>
            </div>
            <h5>Comparte esta lista con los tuyos y empieza a colaborar. ¡Comprar en grupo nunca ha sido más fácil!</h5>
            <button type="submit" onClick={() => {handleShare(); setSharePopupVisible(false)}}>Compartir lista</button>
        </div>
    </div>
  )
}

export default SharePopUp
