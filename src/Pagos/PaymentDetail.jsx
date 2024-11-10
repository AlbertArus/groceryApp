import Head from "../components/Head"
import { useParams, useSearchParams } from "react-router-dom"
// import { useUsuario } from "../UsuarioContext";
import { useEffect, useState } from "react";
import TabItemMenu from "../components/TabItemMenu";

const PaymentDetail = ({listas, UsuarioCompleto}) => {
  const {id, paymentId} = useParams()
  const [searchParams] = useSearchParams()
  // const {usuario} = useUsuario()
  const selectedList = listas.find(lista => lista.id === id)
  const payment = selectedList.payments.find(payment => payment.id === paymentId)
  const [nombrePaymentMember, setNombrePaymentMember] = useState([]);

  useEffect(() => {
    if (payment && payment.members) {
        const paymentMembers = async () => {
            const paymentMembersName = await Promise.all(
                payment.members.map(uid => UsuarioCompleto(uid))
            );
            setNombrePaymentMember(paymentMembersName);
        };
        paymentMembers();
    }
  }, [UsuarioCompleto, payment]);

  console.log(payment)

  return (
    <div className="app">
      <Head 
        path={`list/${id}?view=${searchParams.get("view")}`}
        sectionName={""}
      />
      <div className="app-margin">
      <h3 style={{display: "flex", justifyContent: "center"}}>{payment.paymentName}</h3>
        {nombrePaymentMember.length > 0 && (
          <div style={{width: "100%"}}>
            <div style={{margin: "20px 0px 0px 0px"}}>Pagado por</div>
              <TabItemMenu
                key={id}
                iconName="account_circle"
                itemMenuName={payment.payer}
                priceMember={payment.amount}
              />
            <div style={{margin: "20px 0px 0px 0px"}}>Participantes</div>
            {payment.members.map((uid, index) => (
              <TabItemMenu 
                key={uid}
                iconName="account_circle"
                itemMenuName={nombrePaymentMember[index]}
                priceMember={payment.amount}
              />
            ))}
          </div>
        )}      
      </div>
    </div>
                  // return (
                  // <div key={uid} className="participantsList fila-between">
                  //     <div className="fila-start">    
                  //       <div className="participantsName" style={{marginLeft: "10px"}}>{nombreUserMember[index]}</div>
                  //     </div>
                  //     {/* <h4 className="priceMember">{(members.includes(uid) ? PriceMemberEven() : 0).toFixed(2)}</h4> */}
                  // </div>
  )
}

export default PaymentDetail
