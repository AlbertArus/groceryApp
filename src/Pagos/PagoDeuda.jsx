import { useState } from "react";
import ModalSheet from "../ui-components/ModalSheet";
import TabItemMenu from "../components/TabItemMenu";

const PagoDeuda = () => {
  const [open, setOpen] = useState(false)

  const handleDebtPaid = () => {

  }

  return (
    <div className="app-margin">
      <div className="vistaDatos" style={{padding: "0px", margin: "15px 0px"}}>
        <div className="fila-between" style={{padding: "6px"}}>
          <h5 className="fila-start"><strong style={{fontWeight: "600", paddingRight: "4px"}}>Juan</strong>debe a <strong style={{fontWeight: "600", paddingLeft: "4px"}}>Maria</strong></h5>
          <div>
            Precio €
          </div>
        </div>
        <div className="barraPago">
        <h6 onClick={() => {setOpen(true)}} style={{color: "grey"}}>Gestionar pago</h6>
          <ModalSheet
            open={open}
            setOpen={setOpen}
          >
            <TabItemMenu
              itemMenuName={"Confirmar transferencia"}
              img={"img"}
              onClick={handleDebtPaid}
            />
          </ModalSheet>
        </div>
      </div>
      <div className="vistaDatos" style={{padding: "0px", margin: "15px 0px"}}>
        <div className="fila-between" style={{padding: "6px"}}>
          <div className="columna-start">
            <h5><strong style={{fontWeight: "600"}}>Juan Valle-inclán</strong></h5>
            <h6>debe a</h6>
            <h5><strong style={{fontWeight: "600"}}>Marian Rojas</strong></h5>
          </div>
          <div>
            Precio €
          </div>
        </div>
        <div className="barraPago">
          <h6 onClick={() => {setOpen(true)}} style={{color: "grey"}}>Gestionar pago</h6>
          <ModalSheet
            open={open}
            setOpen={setOpen}
          >
            <TabItemMenu
              itemMenuName={"Confirmar transferencia"}
              img={"img"}
              onClick={handleDebtPaid}
            />
          </ModalSheet>
        </div>
      </div>
    </div>
  )
}

export default PagoDeuda
