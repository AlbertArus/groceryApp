import { Link, useNavigate, useSearchParams } from "react-router-dom"
import EmptyState from "../ui-components/EmptyState"
import { useUsuario } from "../UsuarioContext"
import { useEffect, useState } from "react"
import ButtonArea from "../ui-components/ButtonArea"
import { PriceFormatter } from "../components/PriceFormatter"
import { formattedDateCapitalized } from "../functions/FormatDate"

const Pagos = ({lista, itemsLength, UsuarioCompleto, updateLista, totalGastoLista, price}) => {
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

  const totalGastoListaUser = () => {
    const gastosUser = lista.payments?.filter(payment => payment.payer === usuario.uid)
    return gastosUser.reduce((total, payment) => {
      return total + payment.amount
    },0)
  }

  const paymentsDateObject = lista.payments.reduce((acc, payment) => {
    const date = new Date(payment.selectedDate);
    const normalizedDate = new Date(date.setHours(0, 0, 0, 0)).getTime(); // Convert timestamp to Date and normalize to midnight. AGain for control, not strictly necessary as date is already timestamp at midnight by saving as midnight in App.js
    
    if (!acc[normalizedDate]) {
      acc[normalizedDate] = [];
    }
    acc[normalizedDate].push(payment);
  
    return acc;
  }, {});

  const pagosPorFechaArray = Object.entries(paymentsDateObject)
  .map(([fecha, payments]) => ({fecha, payments}))  
  .sort((a, b) => { return Number(b.fecha) - Number(a.fecha)});

  console.log(pagosPorFechaArray)

  return (
    <>
        <div className="app-margin" style={{display: "flex", justifyContent: "space-around", margin: "15px 0px"}}>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <h6>Gastos en lista</h6>
                <h4><PriceFormatter amount={lista.listPrice} /></h4>
            </div>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <h6>Total pagado</h6>
                <h4><PriceFormatter amount={totalGastoLista} /> </h4>
            </div>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <h6>He pagado</h6>
                <h4><PriceFormatter amount={totalGastoListaUser(usuario.uid)} /> </h4>
            </div>
        </div>
        <ButtonArea 
            buttonCopy={"Añadir pago"}
            onClick={() => navigate(`/list/${lista.id}/newpayment?view=${searchParams.get("view")}`)}
        >
            {lista?.payments?.length === 0 && (
                <EmptyState 
                    img={"_7b52f185-ed1a-44fe-909c-753d4c588278-removebg-preview"}
                    alt={"Set of grocery bags full of items"}
                    description={"Añade tus pagos y ajusta cuentas fácilmente"}
                    style={{display: "none"}}
                />
            )}
            {lista?.payments && lista.payments.length !== 0 && (
                <div className="app-margin">
                    {pagosPorFechaArray.map(({fecha, payments}, index) => {
                        return (
                            <>
                            <h5 key={fecha[index]} style={{marginBottom: "5px"}}>{formattedDateCapitalized(new Date(parseInt(fecha)))}</h5>
                            {payments.map((payment) => {
                                return (
                                    <div key={payment.id}>
                                    <Link to={`/list/${lista.id}/${payment.id}?view=${searchParams.get("view")}`} style={{ textDecoration: 'none', color: 'inherit'}}>
                                        <div className="vistaDatos fila-between">
                                        <div className="columna-start">
                                            <h4 style={{marginBottom: "4px"}}>{payment.paymentName}</h4>
                                            <h6 style={{color: "grey"}}>Pagado por <strong style={{color: "black", fontWeight: "500"}}>{nombrePayer[index]}</strong></h6>
                                        </div>
                                        <h4><PriceFormatter amount={payment.amount} /> </h4>
                                        </div>
                                    </Link>
                                    </div>
                                )
                            })}
                            </>
                        )
                    })}
                </div>  
            )}
        </ButtonArea>
    </>
  )
}

export default Pagos
