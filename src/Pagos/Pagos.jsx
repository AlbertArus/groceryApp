import { Link, useNavigate, useSearchParams } from "react-router-dom"
import EmptyState from "../ui-components/EmptyState"
import { useUsuario } from "../UsuarioContext"
import { useEffect, useState } from "react"

const Pagos = ({lista, itemsLength, UsuarioCompleto, updateLista}) => {
  const {usuario} = useUsuario()
  const navigate = useNavigate()
  const [nombrePayer, setNombrePayer] = useState([]);
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (lista && !lista.payments) {
      updateLista(lista.id, "payments", [])
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lista]);

  useEffect(() => {
    if (lista && lista.payments) {
        const listaPaymentPayer = async () => {
          const nombrePayer = await Promise.all(
            lista.payments.map(payment => 
              UsuarioCompleto(payment.payer)
          ));
          setNombrePayer(nombrePayer);
        };
        listaPaymentPayer();
    }
  }, [UsuarioCompleto, lista]);

  // console.log(lista.payments)

  const totalGastoLista = lista?.payments?.reduce((total, payment) => {
    return total + Number(payment.amount)
  },0)

  const totalGastoListaUser = () => {
    const gastosUser = lista.payments.filter(payment => payment.payer === usuario.uid)
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
          onClick={() => navigate(`/list/${lista.id}/newpayment?view=${searchParams.get("view")}`)}
          buttonCopy={"Añadir pago"}
        />
      )}
      {lista?.payments && lista.payments.length !== 0 && (
        <>
          <div style={{display: "flex", justifyContent: "space-around", marginBottom: "15px"}}>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <h6>Gasto total</h6>
              <h4>{totalGastoLista} €</h4>
            </div>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <h6>He pagado</h6>
              <h4>{totalGastoListaUser(usuario.uid)} €</h4>
            </div>
          </div>
          <div >
            {lista.payments.map((payment, index) => {
              return (
                <div key={payment.id}>
                  
                  <Link to={`/list/${lista.id}/${payment.id}?view=${searchParams.get("view")}`} style={{ textDecoration: 'none', color: 'inherit'}}>
                    <div className="vistaGastos fila-between">
                      <div className="columna-start">
                        <h4>{payment.paymentName}</h4>
                        <h6>Pagado por <strong style={{fontWeight: "500"}}>{nombrePayer[index]}</strong></h6>
                      </div>
                      <h4>{payment.amount} €</h4>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
          <h5 className="buttonMain" style={{position: "fixed", bottom: "30px", left: "15px", right: "15px", margin: "0", zIndex: "100"}} onClick={() => navigate(`/list/${lista.id}/newpayment?view=${searchParams.get("view")}`)}>Añadir pago</h5>
        </>
      )}
    </div>
  )
}

export default Pagos
