import Head from "../components/Head"
import { useParams, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react";
import TabItemMenu from "../components/TabItemMenu";
import OptionsMenuPagos from "../components/OptionsMenuPagos"
import { formattedDateCapitalized } from "../functions/FormatDate";
import Modal from "../ui-components/Modal";

const PaymentDetail = ({listas, UsuarioCompleto, updateLista}) => {
    const {id, paymentId} = useParams()
    const [searchParams] = useSearchParams()
    const lista = listas.find(lista => lista.id === id)
    const payment = lista.payments.find(payment => payment.id === paymentId)
    const [nombrePayer, setNombrePayer] = useState([]);
    const [nombrePaymentMember, setNombrePaymentMember] = useState([]);
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

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
        const elementsPaid = payment.elementsPaid
        if(elementsPaid.length > 0) {
            const selectItemsPaid = elementsPaid.map(paid => paid.item);
            const getItemsPaid = lista.categories.map(category => ({
                ...category,
                items: category.items.map(item =>
                    selectItemsPaid.includes(item.id) 
                        ? { ...item, isPaid: false, payer: "" } 
                        : item
                )
            }))
            updateLista(lista.id, "categories", getItemsPaid)
        }
    }

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
                <div className="columna-start" style={{justifyContent: "center", alignItems: "center"}}>
                    <h2 >{payment.paymentName}</h2>
                    <h5>{formattedDateCapitalized(new Date(payment.selectedDate))}</h5>
                </div>
                {payment.imageURL && (
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <div className="payment-image-container">
                            <img className="paymentImg" src={payment.imageURL} alt="Imagen del pago" onClick={() => setModalOpen(true)}/>
                        </div>
                    </div>
                )}
                {modalOpen && (
                    <Modal 
                        closeOnClick={() => setModalOpen(false)}
                        overlayOnClick={() => setModalOpen(false)}
                    >
                        <img className="paymentImgFullWidth" src={payment.imageURL} alt="Imagen del pago" onClick={() => setModalOpen(true)}/>
                    </Modal>
                )}
                {nombrePayer.length > 0 && (
                    <div style={{width: "100%"}}>
                        <h3 style={{margin: "20px 0px 0px 0px"}}>Pagado por</h3>
                        <TabItemMenu
                            key={id}
                            iconName="account_circle"
                            itemMenuName={nombrePayer}
                            priceMember={payment.amount}
                        />
                        <h3 style={{margin: "20px 0px 0px 0px"}}>Participantes</h3>
                        {payment.members.map((member, index) => (
                            <TabItemMenu
                                key={member.uid}
                                iconName="account_circle"
                                itemMenuName={nombrePaymentMember[index]}
                                priceMember={member.amount}
                            />
                        ))}
                    </div>
                )}      
            </div>
        </div>
    )
}

export default PaymentDetail
