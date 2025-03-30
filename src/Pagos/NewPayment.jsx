import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useUsuario } from "../UsuarioContext";
import Head from "../components/Head";
import { Checkbox } from "@mui/material";
import GastosLista from "./GastosLista";
import CustomChip from "../ui-components/CustomChip";
import { PriceFormatter } from "../components/PriceFormatter";
import DatePicker from "../ui-components/DatePicker"
import Camera from "../ui-components/Camera"
import Button from "../ui-components/Button";

const NewPayment = ({ listas, UsuarioCompleto, AddPayment, payer, setPayer, amount, setAmount, paymentName, setPaymentName, editPayment, selectedDate, setSelectedDate }) => {
    const { usuario } = useUsuario();
    const { id, paymentId } = useParams();
    const [searchParams] = useSearchParams();
    const selectedList = listas.find(lista => lista.id === id);
    const [errors, setErrors] = useState({ paymentName: false, amount: false, members: false });
    const [nombreUserMember, setNombreUserMember] = useState([]);
    const [selectedChip, setSelectedChip] = useState("De esta lista");
    const [finalValuePaid, setFinalValuePaid] = useState("");
    const [members, setMembers] = useState([]);
    const [elementsPaid, setElementsPaid] = useState([])
    const navigate = useNavigate();
    const maxLength = 27;
    const paymentEditing = selectedList?.payments?.find(payment => payment.id === paymentId);

    // Initialize payment data when editing
    useEffect(() => {
        const initializePayment = () => {
            if (paymentId && paymentEditing) {
                setPaymentName(paymentEditing.paymentName);
                setAmount(paymentEditing.amount);
                setMembers(paymentEditing.members || []);
                setPayer(paymentEditing.payer);
                setElementsPaid(paymentEditing.elementsPaid || []);
                // Set the correct chip based on whether there are elementsPaid
                setSelectedChip(paymentEditing.elementsPaid?.length > 0 ? "De esta lista" : "Otro gasto");
            } else {
                // Reset form for new payment
                setPaymentName("");
                setAmount("");
                setPayer(usuario?.uid || "");
                setElementsPaid([]);
                setSelectedChip("De esta lista");
                // No añado miembros porque lo necesito en la dependencia para que coja los de paymentId pero si está abajo y no hay paymentId, se actualiza, y luego en el siguiente useEffect con !paymentId vuelve a actualizarse y este volvería a ejecutarse
            }
        };

        initializePayment();
    }, [paymentId, paymentEditing, setPaymentName, setAmount, setPayer, setElementsPaid, usuario]);

    // Load user members
    useEffect(() => {
        if (selectedList?.userMember && usuario?.uid) {
            const loadUserMembers = async () => {
                const userMembersName = await Promise.all(
                    selectedList.userMember.map(uid => UsuarioCompleto(uid))
                );
                setNombreUserMember(userMembersName);

                if(!paymentId) {
                    setMembers(selectedList.userMember.map(uid => ({ uid, amount: calculatePrice(uid) })));
                }

                if (!payer) {
                    setPayer(usuario.uid);
                }
            };
            loadUserMembers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UsuarioCompleto, selectedList, usuario, payer, amount, paymentId]);

    // Update member amounts cuando amount cambia. Es solo para visualización, el importe que se añade en addPayment es el de PriceMemberEven() 
    useEffect(() => {
        if (members.length > 0 && amount) {
            const amountPerMember = parseFloat(amount) / members.length;
            const updatedMembers = members.map(member => ({
                ...member,
                amount: amountPerMember
            }));
            setMembers(updatedMembers);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount, members.length]);

    useEffect(() => {
        if(selectedChip === "Otro gasto") {
            setElementsPaid([])
        }
    },[selectedChip])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            paymentName: paymentName.trim() === "",
            amount: String(amount).trim() === "",
            members: members.length === 0
        };

        setErrors(newErrors);

        if (!newErrors.paymentName && !newErrors.amount && !newErrors.members) {
            try {
                if (!paymentId) {
                    await AddPayment(selectedList, selectedList.id, paymentName, Number(amount), payer, members, selectedDate, elementsPaid);
                } else {
                    await editPayment(selectedList, selectedList.id, paymentId, paymentName, Number(amount), payer, members, selectedDate, elementsPaid);
                }
                navigate(`/list/${id}?view=payments`);
                setAmount("");
                setPaymentName("");
                setElementsPaid([]);
            } catch (error) {
                console.error("Error al añadir el pago");
            }
        }
    }

    const handleNewPaymentName = (event) => {
        const newPaymentName = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
        if (newPaymentName.length <= maxLength) {
            setPaymentName(newPaymentName);
            setErrors(prevErrors => ({ ...prevErrors, paymentName: false }));
        }
    };

    const handleCheckboxChange = (uid) => {
        setMembers(prevMembers => {
            const isMember = prevMembers.find(member => member.uid === uid);
            if (isMember) {
                return prevMembers.filter(member => member.uid !== uid);
            } else {
                return [...prevMembers, { uid, amount: amount ? parseFloat(amount) / (prevMembers.length + 1) : 0 }];
            }
        });
        setErrors(prevErrors => ({ ...prevErrors, members: false }));
    };
    
    const handleChipClick = (chipLabel) => {
        if(chipLabel === "Otro gasto") {
            setAmount("")
        }
        setSelectedChip(chipLabel)
    }

    const calculatePrice = (uid) => {
        const memberExists = members.find(member => member.uid === uid)
        if(!memberExists) {
            return 0;
        }
        
        return selectedChip === "Otro gasto" ? PriceMemberEven() : customPriceMember(uid)
    }
    
    const PriceMemberEven = useCallback(() => {
        return members.length > 0 ? parseFloat(amount) / members.length : 0;
    }, [amount, members.length]);

    // const customPriceMember = () => {

    //     const elementsItems = elementsPaid.map(element => element.item)

    //     const objectElementsItems = selectedList.categories.flatMap(category =>
    //         category.items.filter(item =>
    //             elementsItems.some(itemElement => itemElement === item.id) 
    //         ))
    //     const userMemberItems = selectedList.userMember.map(member => {
    //         const isMemberItem = objectElementsItems.filter(item =>
    //             item.itemUserMember.includes(member)
    //         )
    //         return {member, items: isMemberItem}
    //     })
    //     const userMemberAmount = userMemberItems.map(memberItem => {
    //         const totalAmount = memberItem.items.reduce((total, item) => {
    //             return total + (item.price / item.itemUserMember.length)
    //         },0)
    //         return {...memberItem, totalAmount}
    //     })
    //     return userMemberAmount
    // }

    // const result = customPriceMember()
    // console.log(result)

    const customPriceMember = (uid) => { // Misma función pero no calcula todos los members con array, sino devuelve por uid enviado
        const elementsItems = elementsPaid.map(element => element.item)

        const objectElementsItems = selectedList.categories.flatMap(category =>
            category.items.filter(item =>
                elementsItems.some(itemElement => itemElement === item.id) 
            )
        )

        const isMemberItem = objectElementsItems.filter(item =>
            item.itemUserMember.includes(uid)
        )

        const totalAmount = isMemberItem.reduce((total, item) => {
            return total + (item.price / item.itemUserMember.length)
        },0)

        return totalAmount
    }

    return (
        <div className="FormLista app">
            <Head
                path={`list/${id}?view=${searchParams.get("view")}`}
                sectionName={paymentId ? "Editar pago" : "Nuevo pago"}
            />
            <div className="app-margin" style={{display:"flex", flexDirection:"column"}}>
                <form>
                        <div className="columna-start" style={{width: "100%"}}>
                            <label htmlFor="nombre">Título</label>
                    <div className="fila-between" style={{gap: "10px"}}>
                            <div className="iconed-container fila-between">
                                <input type="text" placeholder="Gasolina ida" id="nombre" onChange={(e) => handleNewPaymentName(e)} value={paymentName}/>
                                <div className="iconSuperpuesto">{paymentName.length}/{maxLength}</div>
                            </div>
                            <Camera />
                        </div>
                    </div>
                    <h5 style={{display: errors.paymentName ? "block" : "none", color:"red"}}>Añade un título a tu pago</h5>
                    <div className="fila-between" style={{width: "100%", gap: "15px"}}>
                        <div className="payer columna-start" style={{flex: "1 1"}}>
                            {nombreUserMember.length > 0 && (
                                <>
                                <label htmlFor="payer">Quien ha pagado</label>
                                <select id="payer" onChange={(e) => setPayer(e.target.value)} value={payer || usuario.uid}>
                                {selectedList.userMember.map((uid, index) => {
                                    return (
                                        <option key={uid} value={uid}>{nombreUserMember[index]}</option>
                                    )
                                })}
                                </select>
                                </>
                            )}
                        </div>
                        <div className="calendar columna-start">
                            <label>Fecha</label>
                            <DatePicker 
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                            />
                            {/* <input type="date" aria-label="date" autoComplete="true"/> */}
                        </div>
                    </div>
                    <div style={{width: "100%", marginTop: "10px"}}>
                        <div className="fila-between">
                            <div>
                                <h4 style={{marginBottom: "5px"}}>Qué has pagado</h4>
                                <CustomChip
                                    label="De esta lista"
                                    isSelected={selectedChip === "De esta lista"}
                                    onClick={() => handleChipClick("De esta lista")}
                                />
                                <CustomChip
                                    label="Otro gasto"
                                    isSelected={selectedChip === "Otro gasto"}
                                    onClick={() => handleChipClick("Otro gasto")}
                                />
                            </div>
                            {selectedChip === "De esta lista" && (
                                <div className="columna-between" style={{alignItems: "flex-end"}}>
                                    <h4>Importe</h4>
                                    <h3 style={{fontWeight: "400"}}><PriceFormatter amount={finalValuePaid} /> </h3>
                                </div>
                            )}
                        </div>
                        <div>
                            {selectedChip === "De esta lista" ? (
                                <GastosLista 
                                    selectedList={selectedList}
                                    amount={amount}
                                    setAmount={setAmount}
                                    elementsPaid={elementsPaid}
                                    setElementsPaid={setElementsPaid}
                                    setFinalValuePaid={setFinalValuePaid}
                                />
                            ) : (
                            <div style={{marginTop: "10px"}}>
                                <label htmlFor="amount" className="otherLabel" style={{marginBottom: "30px"}}> Importe </label>
                                <input type="number" id="amount" placeholder="25,84" onChange={(e) => {setAmount(e.target.value); setErrors(prevErrors => ({...prevErrors, amount: false }))}} value={amount} />
                                <h5 style={{display: errors.amount ? "block" : "none", color:"red"}}>Añade un precio a tu pago</h5>
                            </div>
                            )}
                        </div>
                    </div>
                    {nombreUserMember.length > 0 && (
                        <div style={{width: "100%"}}>
                            <h4 style={{margin: "15px 0px 0px 0px"}}>Participantes en este gasto </h4>
                            <h5 style={{display: errors.members ? "block" : "none", color:"red"}}>Almenos una persona debe asumir este gasto</h5>
                            {selectedList.userMember.map((uid, index) => {
                                return (
                                    <div key={uid} className="newpaymentLists fila-between">
                                        <div className="fila-start">
                                            <Checkbox 
                                            checked={!!members.find(member => member.uid === uid)}
                                            onChange={ selectedChip === "Otro gasto" ? () => {handleCheckboxChange(uid); setErrors(prevErrors => ({...prevErrors, members: false}))} : () => {}}
                                            sx={{
                                            '&.Mui-checked': {
                                                color: selectedChip === "Otro gasto" ? "green" : "grey"
                                            },
                                            '&:not(.Mui-checked)': {
                                                color: "#9E9E9E"
                                            },
                                            '&.Mui-checked + .MuiTouchRipple-root': {
                                                backgroundColor: selectedChip === "Otro gasto" ? members.includes(uid) ? 'green' : 'transparent' : "grey"
                                            },
                                            padding: "0px",
                                            cursor: selectedChip === "Otro gasto" ? "pointer" : "none"
                                            }}
                                            />           
                                            <h4 style={{marginLeft: "10px"}}>{nombreUserMember[index]}</h4>
                                        </div>
                                        <h4 className="priceMember" style={{color: (String(amount).trim() === "") ? "grey" : "black"}}><PriceFormatter amount={(calculatePrice(uid) || 0)} /> </h4>                                  
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </form>
                <div className="button-main-fixed">
                    <Button
                        onClick={handleSubmit}
                        buttonCopy={paymentId ? "Guardar cambios" : "Añadir pago"}
                    />
                </div>
            </div>
        </div>
    );
};

export default NewPayment;
