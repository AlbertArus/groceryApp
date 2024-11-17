import Head from "../components/Head"
import { useParams, useSearchParams } from "react-router-dom"
// import { useUsuario } from "../UsuarioContext";
import { useEffect, useState } from "react";
import TabItemMenu from "../components/TabItemMenu";
import OptionsMenuPagos from "../components/OptionsMenuPagos"

const PaymentDetail = ({listas, UsuarioCompleto, updateLista}) => {
  const {id, paymentId} = useParams()
  const [searchParams] = useSearchParams()
  // const {usuario} = useUsuario()
  const lista = listas.find(lista => lista.id === id)
  const payment = lista.payments.find(payment => payment.id === paymentId)
  const [nombrePayer, setNombrePayer] = useState([]);
  const [nombrePaymentMember, setNombrePaymentMember] = useState([]);
  const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)

  console.log(payment)

  useEffect(() => {
    if (payment && payment.members) {
        const paymentMembers = async () => {
            const paymentMembersName = await Promise.all(
                payment.members.map(member => UsuarioCompleto(member.uid))
            );
            setNombrePaymentMember(paymentMembersName);
        };
        paymentMembers();
    }
  }, [UsuarioCompleto, payment])

  useEffect(() => {
    if (payment && payment.payer) {
        const listaPaymentPayer = async () => {
            const nombrePayer = await UsuarioCompleto(payment.payer)
            setNombrePayer(nombrePayer);
        };
        listaPaymentPayer();
    }
  }, [UsuarioCompleto, payment]);

  const handleMenuVisibility = () => {
    setIsOptionsMenuVisible(prevState => !prevState)
  }

  const deletePayment = (id) => {
    const listaPayments = lista.payments.filter(payment => payment.id !== id)
    updateLista (lista.id, "payments", listaPayments)
  }

  // const EditPayment = (paymentName, amount, payer, members) => {

  // }


  return (
    <div className="app">
      <Head 
        path={`list/${id}?view=${searchParams.get("view")}`}
        sectionName={""}
        handleMenuVisibility={handleMenuVisibility}
        state={isOptionsMenuVisible}
        component={OptionsMenuPagos}
        lista={lista}
        payment={payment}
        style={{right: "0"}}
        deletePayment={deletePayment}
      >
      </Head>
      <div className="app-margin">
      <h2 style={{display: "flex", justifyContent: "center"}}>{payment.paymentName}</h2>
        {nombrePayer.length > 0 && (
          <div style={{width: "100%"}}>
            <h3 style={{margin: "20px 0px 0px 0px"}}>Pagado por</h3>
              <TabItemMenu
                key={id}
                iconName="account_circle"
                itemMenuName={nombrePayer}
                priceMember={`${payment.amount} €`}
              />
            <h3 style={{margin: "20px 0px 0px 0px"}}>Participantes</h3>
            {payment.members.map((member, index) => (
              <TabItemMenu 
                key={member.uid}
                iconName="account_circle"
                itemMenuName={nombrePaymentMember[index]}
                priceMember={`${member.amount} €`}
              />
            ))}
          </div>
        )}      
      </div>
    </div>
  )
}

export default PaymentDetail
