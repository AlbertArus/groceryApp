import Modal from "../ui-components/Modal";
import { ShareButton } from "./ShareButton"

const SharePopUp = ({ setSharePopupVisible }) => {
  const handleShare = ShareButton(window.location.href, null)

  return (
    <>
        <Modal
            title={"¡Nueva lista creada!"}
            closeOnClick={() => setSharePopupVisible(false)}
            overlayOnClick={() => setSharePopupVisible(false)}
        >
            <h5>Comparte esta lista con los tuyos y empieza a colaborar. ¡Comprar en grupo nunca ha sido más fácil!</h5>
            <button className="buttonMain" style={{width: "100%", marginBottom: "10px"}} onClick={() => {handleShare(); setSharePopupVisible(false)}}>Compartir lista</button>
        </Modal>
    </>
  )
}

export default SharePopUp
