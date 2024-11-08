import { useNavigate } from "react-router-dom"
import EmptyState from "../ui-components/EmptyState"
import { useState } from "react"

const Pagos = ({lista, itemsLength}) => {
  const [isEmptyStatePagos, setIsEmptyStatePagos] = useState(false)
  const navigate = useNavigate()


  return (
    <div className="app-margin">
      <div className="welcome" style={{ marginBottom: "12px" }}>
        <h2 style={{fontWeight: "500"}}>{`Gastos en tu lista   ${lista.listaName}`}</h2>
        <h5>{itemsLength === 1 ? "Tienes 1 item" : `Tienes ${itemsLength} items`}</h5>
      </div>
      {isEmptyStatePagos && (
        <EmptyState 
          img={"_7b52f185-ed1a-44fe-909c-753d4c588278-removebg-preview"}
          alt={"Set of grocery bags full of items"}
          description={"Añade tus pagos y ajusta cuentas fácilmente"}
          onClick={() => navigate("/payment")}
          buttonCopy={"Añadir pago"}
        />
      )}
      <div className="vistaGastos">

      </div>
      <h5 className="buttonMain" style={{position: "sticky", bottom: "30px"}} onClick={() => (navigate("/payment"))}>Eliminar cuenta</h5>
      </div>
  )
}

export default Pagos
