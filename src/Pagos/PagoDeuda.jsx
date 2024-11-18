import { useEffect, useState } from "react";
import ModalSheet from "../ui-components/ModalSheet";
import TabItemMenu from "../components/TabItemMenu";
import { useUsuario } from "../UsuarioContext";

const PagoDeuda = ({lista, UsuarioCompleto}) => {
    const {usuario} = useUsuario()
    const [open, setOpen] = useState(false)
    const [nombreUserMember, setNombreUserMember] = useState([])

    useEffect(() => {
        if (lista && lista.userMember && usuario?.uid) {
            const listaUserMembers = async () => {
                const userMembersName = await Promise.all(
                    lista.userMember.map(uid => UsuarioCompleto(uid))
                )
                setNombreUserMember(userMembersName)
            }
            listaUserMembers()
        }
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UsuarioCompleto, lista, usuario])

    const amountUserMember = (uid) => {
        const usuarioPayer = lista.payments.reduce((total, payment) => {
            if(payment.payer === uid) {
                return total + (payment.amount || 0) 
            }
            return total
        },0)

        const usuarioItemsPaid = lista.categories.reduce((totalCategory, category) => {
            if (!category.items) return totalCategory;

            return totalCategory + category.items.reduce((totalItems, item) => {
                if (item.isPaid && item.itemUserMember.includes(uid)) {
                    const priceShare = Number(item.price) / item.itemUserMember.length
                    return totalItems + priceShare
                }
                return totalItems
            }, 0)
        }, 0)

        return usuarioPayer - usuarioItemsPaid
    }
    
    const handleDebtPaid = () => {
        // Flujo de crear un pago con concepto reembolso, importe el pago que se dice, payer el que lo debe y fecha de pago
    }

    return (
        <div className="app-margin">
            <div className="vistaDatos" style={{padding: "0px", margin: "15px 0px"}}>
                <div className="fila-between" style={{padding: "6px"}}>
                <h4 className="fila-start"><strong style={{fontWeight: "600", paddingRight: "4px"}}>Juan</strong>debe a <strong style={{fontWeight: "600", paddingLeft: "4px"}}>Maria</strong></h4>
                <h4>
                    Precio €
                </h4>
                </div>
                <div className="barraPago">
                <h5 onClick={() => {setOpen(true)}} style={{color: "grey"}}>Gestionar pago</h5>
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
                <h4>
                    Precio €
                </h4>
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
            {lista.userMember.map((uid, index) => {
                const amount = amountUserMember(uid); // Asegúrate de que uid es correcto
                // console.log("Total para", uid, ":", amount)
                return (
                    <div key={uid} className="newpaymentLists fila-between">
                        <div className="fila-start">
                            <h4>{nombreUserMember[index]}</h4>
                        </div>
                        <h4 className="priceMember" style={{color: amount >= 0 ? "green" : "red"}}>{amount.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</h4>
                    </div>
                )
            })}
        </div>
    )
}

export default PagoDeuda
