import { Link, useNavigate } from "react-router-dom"
import EmptyState from "../ui-components/EmptyState"
import { useUsuario } from "../UsuarioContext"

const Pagos = ({lista, itemsLength}) => {
  const {usuario} = useUsuario()
  const navigate = useNavigate()

  const totalGastoLista = lista.payments.reduce((total, payment) => {
    return total + Number(payment.amount)
  },0)

  const totalGastoListaUser = () => {
    const gastosUser = lista.payments.filter(payment => payment.paymentCreator === usuario.uid)
    return gastosUser.reduce((total, payment) => {
      return total + Number(payment.amount)
    },0)
  }

  return (
    <div className="app-margin">
      <div className="welcome" style={{ marginBottom: "12px" }}>
        {/* <h2 style={{fontWeight: "500"}}>{`Resuemn de ${lista.listaName}`}</h2> */}
        {/* <h5>{itemsLength === 1 ? "Tienes 1 item" : `Tienes ${itemsLength} items`}</h5> */}
      </div>
      {lista?.payments?.length === 0 && (
        <EmptyState 
          img={"_7b52f185-ed1a-44fe-909c-753d4c588278-removebg-preview"}
          alt={"Set of grocery bags full of items"}
          description={"Añade tus pagos y ajusta cuentas fácilmente"}
          onClick={() => navigate(`/list/${lista.id}/newpayment`)}
          buttonCopy={"Añadir pago"}
        />
      )}
      <div style={{display: "flex", justifyContent: "space-around", marginBottom: "15px"}}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <h6>Gasto total</h6>
          <h4>{totalGastoLista} €</h4>
        </div>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <h6>Pagado por mi</h6>
          <h4>{totalGastoListaUser(usuario.uid)} €</h4>
        </div>
      </div>
      <div >
        {lista.payments.map((payment) => {
          return (
            <div key={payment.id}>
              <Link to={`/list/${lista.id}/payments/${payment.id}`} style={{ textDecoration: 'none', color: 'inherit'}}>
                <div className="vistaGastos fila-between">
                  <div className="columna-start">
                    <h4>{payment.paymentName}</h4>
                    <h6>Pagado por <strong style={{fontWeight: "500"}}>{payment.payer}</strong></h6>
                  </div>
                  <h4>{payment.amount} €</h4>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
      {lista.payments.length !== 0 && (
        <h5 className="buttonMain" style={{position: "fixed", bottom: "30px", left: "15px", right: "15px", margin: "0", zIndex: "100"}} onClick={() => (navigate(`/list/${lista.id}/newpayment`))}>Añadir pago</h5>
      )}
    </div>
  )
}

export default Pagos
