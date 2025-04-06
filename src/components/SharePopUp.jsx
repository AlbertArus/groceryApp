import Modal from "../ui-components/Modal";
import Button from "../ui-components/Button";
import { ShareButton } from "./ShareButton"
import { useParams } from 'react-router-dom';
import { useState } from "react";

const SharePopUp = ({ setSharePopupVisible, listas }) => {
    const {id} = useParams()
    const listaParam = listas.find(lista => lista.id === id)
    const [inactive, setInactive] = useState(false)
  
  const handleShare = ShareButton(window.location.href, listaParam)

  return (
    <>
        <Modal
            title={"¡Nueva lista creada!"}
            closeOnClick={() => setSharePopupVisible(false)}
            overlayOnClick={() => setSharePopupVisible(false)}
        >
            <h5>Comparte esta lista con los tuyos y empieza a colaborar. ¡Comprar en grupo nunca ha sido más fácil!</h5>
            <Button
                onClick={() => {handleShare(); setSharePopupVisible(false); setInactive(true)}}
                buttonCopy={"Compartir lista"}
                inactive={inactive}
                style={{fontSize: "12px", margin: "12px 0px 0px"}}
            />
        </Modal>
    </>
  )
}

export default SharePopUp
