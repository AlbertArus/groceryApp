import { useEffect, useRef, useState } from "react";
import ModalSheet from "../ui-components/ModalSheet";
import TabItemMenu from "../components/TabItemMenu";
import { useUsuario } from "../UsuarioContext";
import EmptyState from "../ui-components/EmptyState"
import { useNavigate, useSearchParams } from "react-router-dom";
import { PriceFormatter } from "../components/PriceFormatter";

const PagoDeuda = ({ lista, UsuarioCompleto, AddPayment, selectedDate }) => {
    const { usuario } = useUsuario();
    const [open, setOpen] = useState(false);
    const [pendingAmounts, setPendingAmounts] = useState([]);
    const [nombreUserMember, setNombreUserMember] = useState([]);
    const [userAmountList, setUserAmountList] = useState([]);
    const [positiveMembers, setPositiveMembers] = useState([]);
    const [negativeMembers, setNegativeMembers] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false)
    const collapserRef = useRef(null)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (lista && lista.userMember && usuario?.uid) {
            const listaUserMembers = async () => {
                const userMembersName = await Promise.all(
                    lista.userMember.map(uid => UsuarioCompleto(uid))
                );
                setNombreUserMember(userMembersName);
            };
            listaUserMembers();
        }
    }, [UsuarioCompleto, lista, usuario]);

    const amountUserMember = () => {
        return lista.userMember.map(uid => {
            const usuarioPayer = lista.payments.reduce((total, payment) => {
                return payment.payer === uid ? total + (payment.amount || 0) : total

            }, 0);

            const usuarioToPay = lista.payments.reduce((total, payment) => {
                const amountForThisPayment = payment.members.reduce((memberPay, member) => {
                  return member.uid === uid ? memberPay + (member.amount || 0) : memberPay;
                }, 0);
                return total + amountForThisPayment;
              }, 0);

            return { uid, amount: usuarioPayer - usuarioToPay }
        })
    }

    useEffect(() => {
        if (lista) {
            const amounts = amountUserMember();
            setUserAmountList(amounts);
            setPendingAmounts(amounts); // Copia inicial de los saldos
            const positives = amounts.filter(user => user.amount > 0);
            const negatives = amounts.filter(user => user.amount < 0);
            setPositiveMembers(positives);
            setNegativeMembers(negatives);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lista]);
    

    useEffect(() => {
        const calculateTransfers = () => {
            const transfersList = [];
            let pos = positiveMembers.map((p) => ({ ...p })); // Copiar para evitar mutaciones
            let neg = negativeMembers.map((n) => ({ ...n })); // Copiar para evitar mutaciones
    
            while (pos.length && neg.length) {
                const positive = pos[0];
                const negative = neg[0];
                const transferAmount = Math.min(positive.amount, Math.abs(negative.amount));
    
                transfersList.push({
                    from: negative.uid,
                    to: positive.uid,
                    amount: transferAmount,
                });
    
                // Actualiza los saldos
                positive.amount -= transferAmount;
                negative.amount += transferAmount;
    
                // Elimina usuarios con saldo cero
                if (positive.amount === 0) pos.shift();
                if (negative.amount === 0) neg.shift();
            }
    
            setTransfers(transfersList);
        };
    
        if (positiveMembers.length && negativeMembers.length) {
            calculateTransfers();
        }
    }, [positiveMembers, negativeMembers]);

    const handleDebtPaid = () => {
        const transfer = transfers[currentIndex];
        console.log(transfer)
        console.log(transfer.amount)
        console.log(transfer.from)
        const paymentName = "Reembolso";
        const members = [{ uid: transfer.to, amount: transfer.amount }]

        // Actualizar `pendingAmounts`
        setPendingAmounts((prev) =>
            prev.map((user) => {
                if (user.uid === transfer.from) {
                    return { ...user, amount: user.amount + transfer.amount };
                }
                if (user.uid === transfer.to) {
                    return { ...user, amount: user.amount - transfer.amount };
                }
                return user;
            })
        );
    
        // Actualizar `transfers`, eliminando transferencias completadas
        setTransfers((prevTransfers) =>
            prevTransfers.filter(transferList => transferList !== transfer)
        );
        // Registrar el pago
        AddPayment(lista, lista.id, paymentName, transfer.amount, transfer.from, members, selectedDate);
        setOpen(false);
    }

    const collapseList = () => {
        setIsCollapsed(prevState => !prevState)
        collapserRef.current.style.transform = !isCollapsed ? "rotate(-90deg)" : "rotate(0deg)";
    }

    return (
        <div style={{height: "100vh"}}>
            {transfers?.length > 0 ? (
                <>
                {transfers.map((transfer, index) => {
                    const fromUser = nombreUserMember[lista.userMember.indexOf(transfer.from)];
                    const toUser = nombreUserMember[lista.userMember.indexOf(transfer.to)];
                    return (
                        <div key={`${transfer.from}-${transfer.to}`} className="app-margin">
                            <div className="vistaDatos" style={{ padding: "0px", margin: "15px 0px" }}>
                                <div className="fila-between" style={{ padding: "6px" }}>
                                    <div className="columna-start">
                                        <h4><strong style={{ fontWeight: "500" }}>{fromUser}</strong></h4>
                                        <h5>debe a</h5>
                                        <h4><strong style={{ fontWeight: "500" }}>{toUser}</strong></h4>
                                    </div>
                                    <h4 className="priceMember">
                                        <PriceFormatter amount={transfer.amount} />
                                    </h4>
                                </div>
                                <div key={transfer} className="barraPago">
                                    <h6 onClick={() => {setCurrentIndex(index); setOpen(true)}} style={{color: "grey"}}>Gestionar pago</h6>
    
                                </div>                    
                            </div>
                        </div>
                    );
                })}
                <ModalSheet // Lo pongo fuera de la barra de pago, porque como es general por cada transfer, si está dentro de barra de pago se activa siempre (uno por pago)
                    open={open}
                    setOpen={setOpen}
                >
                    <TabItemMenu
                    itemMenuName={"Confirmar transferencia"}
                    img={"/Fotos GroceryApp/transferencia-de-dinero.png"}
                    onClick={() => handleDebtPaid(selectedDate)}
                    />
                </ModalSheet>
                {lista.userMember.length !== 1 && transfers.length > 0 && (
                    <div className="" style={{margin: "0px 15px 18px 15px"}}>
                        <div className="fila-start" style={{margin: "0px 0px 10px 0px"}}>
                            <h4 style={{fontWeight: "500"}}>Importes pendientes por usuario</h4>
                            <span className="material-symbols-outlined icon-medium pointer" ref={collapserRef} onClick={() => collapseList()}>keyboard_arrow_down</span>
                        </div>
                        {!isCollapsed &&
                            <>
                                {pendingAmounts.map((user, index) => {
                                    return (
                                        <div key={user.uid} className="newpaymentLists fila-between">
                                            <div className="fila-start">
                                                <h4>{nombreUserMember[index]}</h4>
                                            </div>
                                            <h4 className="priceMember" style={{color: user.amount > 0 ? "green" : user.amount === 0 ? "black" : "red"}}><PriceFormatter amount={user.amount} /> </h4>
                                        </div>
                                    )
                                })}
                            </>
                        }
                    </div>
                )}
                </>
            ) : (
                <EmptyState
                    img={"_7b52f185-ed1a-44fe-909c-753d4c588278-removebg-preview"}
                    alt={"Set of grocery bags full of items"}
                    description={"No hay balance a compensar. Registra tus pagos y equilibra balances entre el grupo"}
                    onClick={() => navigate(`/list/${lista.id}/newpayment?view=${searchParams.get("view")}`)}
                    buttonCopy={"Añadir pago"}
                />
            )}
        </div>
    );
};

export default PagoDeuda;
