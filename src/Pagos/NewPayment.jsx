import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid'
import { useUsuario } from "../UsuarioContext";
import Head from "../components/Head";
import { Checkbox } from "@mui/material";
import GastosLista from "./GastosLista";

const NewPayment = ({ listas, updateLista, UsuarioCompleto}) => {
    const {usuario} = useUsuario()
    const {id} = useParams()
    const [searchParams] = useSearchParams()
    const selectedList = listas.find(lista => lista.id === id)
    const [paymentName, setPaymentName] = useState("");
    const [errors, setErrors] = useState({paymentName: false, amount: false, members: false})
    const [amount, setAmount] = useState("");
    const [members, setMembers] = useState([])
    const [payer, setPayer] = useState("");
    const [nombreUserMember, setNombreUserMember] = useState([]);
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
    }, [UsuarioCompleto, selectedList, usuario])

    useEffect(() => {
        if (amount && members.length > 0) {
            const amountPerMember = parseFloat(amount) / members.length;
            const updatedMembers = members.map(member => ({
                ...member,
                amount: amountPerMember
            }));
            setMembers(updatedMembers);
        }
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount]);
        
    const AddPayment = (paymentName, amount, payer) => {
        const newPayment = { id: uuidv4(), listaId: id, paymentCreator: usuario.uid, createdAt: new Date(), payer, paymentName, amount, members }
        const updatedPayments = [...selectedList.payments, newPayment]
        updateLista(selectedList.id, "payments", updatedPayments)
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        setErrors({
            paymentName: (paymentName.trim() === ""),
            amount: (amount.trim() === ""),
        })

        if (paymentName.trim() && amount.trim()) {
            AddPayment(paymentName, amount, payer)
            navigate(`/list/${id}?view=payments`)
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

    const PriceMemberEven = () => {
        return members.length > 0 ? amount / members.length : 0
    }
  
    return (
        <div className="FormLista app">
            <Head
                path={`list/${id}?view=${searchParams.get("view")}`}
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
                    <select id="payer" onChange={(e) => setPayer(e.target.value)} value={payer || usuario.uid}>
                    {selectedList.userMember.map((uid, index) => {
                        return (
                            <option key={uid} value={uid}>{nombreUserMember[index]}</option>
                        )
                    })}
                    </select>
                    </>
                )}
                <div style={{width: "100%"}}>
                    <div style={{margin: "20px 0px 5px 0px"}}>Qué has pagado</div>
                    <md-chip-set>
                        <md-filter-chip label="De esta lista"></md-filter-chip>
                        <md-filter-chip label="Otro gasto"></md-filter-chip>
                    </md-chip-set>
                    <GastosLista 
                        selectedList={selectedList}
                        amount={amount}
                        setAmount={setAmount}
                    />
                </div>
                {nombreUserMember.length > 0 && (
                <div style={{width: "100%"}}>
                    <div style={{margin: "20px 0px 0px 0px"}}>Participantes en este gasto </div>
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
                                <div className="participantsName" style={{marginLeft: "10px"}}>{nombreUserMember[index]}</div>
                            </div>
                            <h4 className="priceMember" style={{color: amount.trim() === "" ? "grey" : "black"}}>{(members.find(member => member.uid === uid) ? PriceMemberEven() : 0).toFixed(2)} €</h4>
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

export default NewPayment;
