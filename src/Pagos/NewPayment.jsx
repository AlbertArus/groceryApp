import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useUsuario } from "../UsuarioContext";
import Head from "../components/Head";
import { Checkbox } from "@mui/material";
import GastosLista from "./GastosLista";
import ButtonArea from "../ui-components/ButtonArea";
// import CurrencyInput from "../components/CurrencyInput";
// import { FormatCurrency } from "../components/FormatCurrency";
import CustomChip from "../ui-components/CustomChip";

const NewPayment = ({ listas, UsuarioCompleto, AddPayment, payer, setPayer, amount, setAmount, paymentName, setPaymentName, elementsPaid, setElementsPaid}) => {
    const {usuario} = useUsuario()
    const {id} = useParams()
    const [searchParams] = useSearchParams()
    const selectedList = listas.find(lista => lista.id === id)
    const [errors, setErrors] = useState({paymentName: false, amount: false, members: false})
    const [nombreUserMember, setNombreUserMember] = useState([])
    const [selectedChip, setSelectedChip] = useState("De esta lista");
    const [finalValuePaid, setFinalValuePaid] = useState("")
    const [members, setMembers] = useState([])
    const navigate = useNavigate()
    const maxLength = 27
    
    useEffect(() => {
        if (selectedList && selectedList.userMember && usuario?.uid) {
            const listaUserMembers = async () => {
                const userMembersName = await Promise.all(
                    selectedList.userMember.map(uid => UsuarioCompleto(uid))
                )
                setNombreUserMember(userMembersName)

                setMembers(selectedList.userMember.map(uid => ({ uid, amount: PriceMemberEven() })));

                if (!payer) {
                    setPayer(usuario.uid);
                }
            }
            listaUserMembers()
        }
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UsuarioCompleto, selectedList, usuario, payer])

    useEffect(() => {
        const amountPerMember = parseFloat(amount) / members.length;
        const updatedMembers = members?.map(member => ({
            ...member,
            amount: amountPerMember
        }));
        setMembers(updatedMembers);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount, members.length]);
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        setErrors({
            paymentName: (paymentName.trim() === ""),
            amount: (String(amount).trim() === "")
        })

        if (paymentName.trim() && (String(amount).trim())) {
            AddPayment(selectedList, selectedList.id, paymentName, amount, payer, members)
            navigate(`/list/${id}?view=payments`)
            setAmount("")
            setPaymentName("")
            setElementsPaid([])
        }
    }

    const handleNewPaymentName = (event) => {
        const newPaymentName = event.target.value.charAt(0).toUpperCase()+event.target.value.slice(1)
        if(newPaymentName.length <= maxLength) {
            setPaymentName(newPaymentName)
        setErrors(prevErrors => ({...prevErrors, paymentName: false }))
        }
    }

    const handleCheckboxChange = (uid) => {
        setMembers(prevMembers => {
            const isMember = prevMembers.find(member => member.uid === uid)
            if (isMember) {
                return prevMembers.filter(member => member.uid !== uid)
            } else {
                return [...prevMembers, { uid, amount: 0 }]
            }
        })
    }

    const PriceMemberEven = useCallback(() => {
        return members.length > 0 ? parseFloat(amount) / members.length : 0
    }, [amount, members.length])

    const handleChipClick = (chipLabel) => {
        if(chipLabel === "Otro gasto") {
            setAmount("")
        }
        setSelectedChip(chipLabel)
    }

    console.log(amount)
  
    return (
        <ButtonArea 
            onClick={handleSubmit}
            buttonCopy={"Añadir pago"}
        >
            <div className="FormLista app">
                <Head
                    path={`list/${id}?view=${searchParams.get("view")}`}
                    sectionName={"Nuevo pago"}
                />
                <div className="app-margin" style={{display:"flex", flexDirection:"column"}}>
                    <form style={{display: "flex"}} onSubmit={() => handleSubmit}>
                        <label htmlFor="nombre">Título</label>
                        <div className="iconed-container fila-between">
                        <input type="text" placeholder="Gasolina ida" id="nombre" onChange={(e) => handleNewPaymentName(e)} value={paymentName}/>
                        <div className="iconSuperpuesto" style={{paddingRight:"5px"}}>{paymentName.length}/{maxLength}</div>
                        </div>
                        <h5 style={{display: errors.paymentName ? "block" : "none", color:"red"}}>Añade un título a tu pago</h5>
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
                                        <h3 style={{fontWeight: "400"}}>{finalValuePaid}</h3>
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
                                    {/* <CurrencyInput 
                                        value={amount}
                                        // onChange={(e) => {setAmount(e.target.value); setErrors(prevErrors => ({...prevErrors, amount: false }))}}
                                        onChange={(newAmount) => {setAmount(newAmount); setErrors(prevErrors => ({...prevErrors, amount: false }))}}
                                        locale="es-ES"
                                        currency="EUR"
                                        editable={true}
                                    /> */}
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
                                        onChange={() => {handleCheckboxChange(uid); setErrors(prevErrors => ({...prevErrors, members: false}))}}
                                        sx={{
                                        '&.Mui-checked': {
                                            color: "green"
                                        },
                                        '&:not(.Mui-checked)': {
                                            color: "#9E9E9E"
                                        },
                                        '&.Mui-checked + .MuiTouchRipple-root': {
                                            backgroundColor: members.includes(uid) ? 'green' : 'transparent'
                                        },
                                        padding: "0px",
                                        cursor:"pointer"
                                        }}
                                        />           
                                        <h4 style={{marginLeft: "10px"}}>{nombreUserMember[index]}</h4>
                                    </div>
                                    <h4 className="priceMember" style={{color: (String(amount).trim() === "") ? "grey" : "black"}}>{(members.find(member => member.uid === uid) ? PriceMemberEven() : 0).toFixed(2)} €</h4>                                  
                                    {/* <h4 className="priceMember" style={{color: (String(amount).trim() === "") ? "grey" : "black"}}>{(members.find(member => member.uid === uid) ? 
                                        <CurrencyInput
                                            value={PriceMemberEven()}
                                            locale="es-ES"
                                            currency="EUR"
                                            editable={false}
                                        />
                                        : (
                                        <>
                                        {FormatCurrency(0, "es-ES", "EUR")}
                                        </>
                                        ))}
                                    </h4> */}
                                </div>
                            )})}
                        </div>
                        )}
                        {/* <button className="buttonMain" type="submit">Añadir pago</button> */}
                    </form>
                </div>
            </div>
        </ButtonArea>
    );
};

export default NewPayment;
