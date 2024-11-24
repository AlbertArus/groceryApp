import { useEffect, useRef, useState } from "react";
import ModalSheet from "../ui-components/ModalSheet";
import TabItemMenu from "../components/TabItemMenu";
import { useUsuario } from "../UsuarioContext";
import EmptyState from "../ui-components/EmptyState"
import { useNavigate, useSearchParams } from "react-router-dom";

const PagoDeuda = ({ lista, UsuarioCompleto, AddPayment, setMembers }) => {
    const { usuario } = useUsuario();
    const [open, setOpen] = useState(false);
    const [nombreUserMember, setNombreUserMember] = useState([]);
    const [userAmountList, setUserAmountList] = useState([]);
    const [positiveMembers, setPositiveMembers] = useState([]);
    const [negativeMembers, setNegativeMembers] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false)
    const collapserRef = useRef(null)
    const navigate = useNavigate()
    const searchParams = useSearchParams()

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
                return payment.payer === uid ? total + (payment.amount || 0) : total;
            }, 0);

            const usuarioItemsPaid = lista.categories.reduce((totalCategory, category) => {
                if (!category.items) return totalCategory;
                return totalCategory + category.items.reduce((totalItems, item) => {
                    if (item.isPaid && item.itemUserMember.includes(uid)) {
                        const priceShare = Number(item.price) / (item.itemUserMember.length || 1);
                        return totalItems + priceShare;
                    }
                    return totalItems;
                }, 0);
            }, 0);

            return { uid, amount: usuarioPayer - usuarioItemsPaid };
        });
    };

    useEffect(() => {
        if (lista) {
            const amounts = amountUserMember();
            setUserAmountList(amounts);
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
            let pos = [...positiveMembers];
            let neg = [...negativeMembers];

            while (pos.length && neg.length) {
                const positive = pos[0];
                const negative = neg[0];
                const transferAmount = Math.min(positive.amount, Math.abs(negative.amount));

                transfersList.push({
                    from: negative.uid,
                    to: positive.uid,
                    amount: transferAmount
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

    // const handleDebtPaid = (transfer) => {
    //     const fromUser = transfer.from
    //     const toUser = transfer.to
    //     const amount = transfer.amount
    //     const paymentName = "Reembolso"
    //     setMembers(toUser)
    
    //     AddPayment(paymentName, amount, fromUser)
    // }

    const collapseList = () => {
        setIsCollapsed(prevState => !prevState)
        collapserRef.current.style.transform = !isCollapsed ? "rotate(-90deg)" : "rotate(0deg)";
    }

    return (
        <div className="">
            {transfers.map((transfer, index) => {
                const fromUser = nombreUserMember[lista.userMember.indexOf(transfer.from)];
                const toUser = nombreUserMember[lista.userMember.indexOf(transfer.to)];
                return (
                    <div className="app-margin">
                        <div key={index} className="vistaDatos" style={{ padding: "0px", margin: "15px 0px" }}>
                            <div className="fila-between" style={{ padding: "6px" }}>
                                <div className="columna-start">
                                    <h4><strong style={{ fontWeight: "500" }}>{fromUser}</strong></h4>
                                    <h5>debe a</h5>
                                    <h4><strong style={{ fontWeight: "500" }}>{toUser}</strong></h4>
                                </div>
                                <h4 className="priceMember">
                                    {transfer.amount.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
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
                                    // onClick={handleDebtPaid}
                                    />
                                </ModalSheet>
                            </div>                    
                        </div>
                    </div>
                );
            })}
            {lista.userMember.length !== 1 && transfers.length > 0 && (
            <div className="app-margin">
                <div className="fila-start" style={{margin: "25px 0px 15px 0px"}}>
                    <h4 style={{fontWeight: "500"}}>Importes pendientes por usuario</h4>
                    <span className="material-symbols-outlined icon-medium pointer" ref={collapserRef} onClick={() => collapseList()}>keyboard_arrow_down</span>
                </div>
                {!isCollapsed &&
                    <>
                        {userAmountList.map((user, index) => {
                            return (
                                <div key={user.uid} className="newpaymentLists fila-between">
                                    <div className="fila-start">
                                        <h4>{nombreUserMember[index]}</h4>
                                    </div>
                                    <h4 className="priceMember" style={{color: user.amount >= 0 ? "green" : "red"}}>{user.amount.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</h4>
                                </div>
                            )
                        })}
                    </>
                }
            </div>
            )}
            {transfers.length === 0 && (
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
