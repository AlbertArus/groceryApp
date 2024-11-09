import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid'
import { useUsuario } from "../UsuarioContext";
import Head from "../components/Head";
import { Checkbox } from "@mui/material";

const Payment = ({ listas, handleNewPayment, UsuarioCompleto}) => {
    const {usuario} = useUsuario()
    const {id} = useParams()
    const selectedList = listas.find(lista => lista.id === id)
    const [paymentName, setPaymentName] = useState("");
    const [errors, setErrors] = useState({paymentName: false, amount: false, members: false})
    const [amount, setAmount] = useState("");
    const [members, setMembers] = useState(selectedList.userMember)
    const [payer, setPayer] = useState("");
    const [nombreUserMember, setNombreUserMember] = useState([]);
    const navigate = useNavigate()
    
    useEffect(() => {
        if (selectedList && selectedList.userMember) {
            const listaUserMembers = async () => {
                const userMembersName = await Promise.all(
                    selectedList.userMember.map(uid => UsuarioCompleto(uid))
                );
                setNombreUserMember(userMembersName);
            };
            listaUserMembers();
        }
    }, [UsuarioCompleto, selectedList]);

    useEffect(() => {
        if (nombreUserMember.length > 0) {
            setPayer(nombreUserMember[0]);
        }
    }, [nombreUserMember]);
    
    console.log(selectedList)
    const AddPayment = (paymentName, amount, payer) => {
        const newPayment = { id: uuidv4(), listaId: id, paymentCreator: usuario.uid, payer, paymentName, amount, members }
        const updatedPayments = [...selectedList.payments, newPayment]
        // const updatedList = {...selectedList, payments: updatedPayments}
        handleNewPayment(id, updatedPayments)
    }
    
    // const EditPayment = (paymentName, amount, payer, members) => {

    // }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setErrors({
            paymentName: (paymentName.trim() === ""),
            amount: (amount.trim() === ""),
            // members: members.length === 0
        })

        if (paymentName.trim() && amount.trim()) {
            AddPayment(paymentName, amount, payer)
            navigate(`/list/${id}`)
        }
    }

    const maxLength = 27

    const handleNewPaymentName = (event) => {
        const newPaymentName = event.target.value.charAt(0).toUpperCase()+event.target.value.slice(1)
        if(newPaymentName.length <= maxLength) {
            setPaymentName(newPaymentName)
        setErrors(prevErrors => ({...prevErrors, paymentName: false }))
        }
    }

    // console.log(selectedList.payments)
    // console.log(payer)
    // console.log(members)

    const handleCheckboxChange = (uid) => {
        setMembers(prevMembers => 
            prevMembers.includes(uid) ? prevMembers.filter(memberUid => memberUid !== uid) : [...prevMembers, uid]
        )
    }

    const PriceMemberEven = () => {
        return members.length > 0 ? amount/members.length : 0
    }
  
    return (
        <div className="FormLista app">
            <Head
                path={`list/${id}`}
                sectionName={"Nuevo pago"}
            />
            <div className="app-margin" style={{display:"flex", flexDirection:"column"}}>
            {/* <h3 style={{ fontWeight: "500", margin: "20px 0px" }}>Añade un nuevo pago</h3> */}
            <form style={{display: "flex"}} onSubmit={handleSubmit}>
                <label htmlFor="nombre">Título</label>
                <div className="iconed-container fila-between">
                <input type="text" placeholder="Gasolina ida" id="nombre" onChange={(e) => handleNewPaymentName(e)} value={paymentName}/>
                <div className="iconSuperpuesto" style={{paddingRight:"5px"}}>{paymentName.length}/{maxLength}</div>
                </div>
                <h5 style={{display: errors.paymentName ? "block" : "none", color:"red"}}>Añade un título a tu pago</h5>
                <label htmlFor="amount"> Importe </label>
                <input type="number" id="amount" placeholder="25,84" onChange={(e) => {setAmount(e.target.value); setErrors(prevErrors => ({...prevErrors, amount: false }))}} value={amount} />
                <h5 style={{display: errors.amount ? "block" : "none", color:"red"}}>Añade un precio a tu pago</h5>
                {nombreUserMember.length > 0 && (
                    <>
                    <label htmlFor="payer">Quien ha pagado</label>
                    <select id="payer" onChange={(e) => setPayer(e.target.value)} value={payer}>
                    {selectedList.userMember.map((uid, index) => {
                        return (
                            <option key={uid} value={nombreUserMember[index]}>{nombreUserMember[index]}</option>
                        )
                    })}
                    </select>
                    </>
                )}
                <div>
                    <div style={{margin: "20px 0px 5px 0px"}}>Qué has pagado</div>
                    <div>

                    </div>
                </div>
                {nombreUserMember.length > 0 && (
                <div style={{width: "100%"}}>
                    <div style={{margin: "20px 0px 0px 0px"}}>Participantes en este gasto </div>
                    <h5 style={{display: errors.members ? "block" : "none", color:"red"}}>Almenos una persona debe asumir este gasto</h5>
                    {selectedList.userMember.map((uid, index) => {
                        return (
                        <div key={uid} className="participantsList fila-between">
                            <div className="fila-start">
                                <Checkbox 
                                checked={members.includes(uid)}
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
                                <div className="participantsName" style={{marginLeft: "10px"}}>{nombreUserMember[index]}</div>
                            </div>
                            <h4 className="priceMember" style={{color: amount.trim() === "" ? "grey" : "black"}}>{(members.includes(uid) ? PriceMemberEven() : 0).toFixed(2)}</h4>
                        </div>
                    )})}
                </div>
                )}
                <button className="buttonMain" type="submit">Añadir pago</button>
            </form>
            </div>
        </div>
    );
};

export default Payment;
