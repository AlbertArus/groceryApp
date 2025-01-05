import firebaseApp, { db } from "../firebase-config.js";
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import Head from "../components/Head.jsx";
import { useState } from "react";
import ButtonArea from "../ui-components/ButtonArea.jsx";
import { v4 as uuidv4 } from 'uuid'
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import Modal from "../ui-components/Modal.jsx";
import ModalStatus from "../ui-components/ModalStatus.jsx";
const auth = getAuth(firebaseApp);

const DeleteUser = ({ usuario, UsuarioCompleto, updateLista, listas, setListas }) => {
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)
    const [userDeleted, setUserDeleted] = useState(false)
    const [popUpVisible, setPopUpVisible] = useState(false)
    const [password, setPassword] = useState("")
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [error, setError] = useState({password: false})
    const user = auth.currentUser

    const replaceMember = async (uid) => {
        if(!uid) {
            console.error("no hay usuario");
            return;
        }
        await Promise.all(
            listas.map(async (lista) => {
                // Lista

                    // Member en userMember
                    const userMemberIndex = lista.userMember.findIndex(member => member === usuario.uid)
                    const updateUserMember = [...lista.userMember]
                    updateUserMember[userMemberIndex] = uid

                    // Creator en lista
                    const updateUserCreator = lista.userCreator === usuario.uid ? uid : lista.userCreator
        
                // Category e Item
                const updatedCategories = lista.categories.map(category => {
                    const updateCategoryCreator = category.categoryCreator === usuario.uid ? uid : category.categoryCreator
                    const updatedItems = category.items.map(item => {
                        const itemUserMemberIndex = item.itemUserMember.findIndex(member => member === usuario.uid);
                        
                        // Creator en Item
                        const updateItemCreator = item.itemCreator === usuario.uid ? uid : item.itemCreator;
                        //Payer en Item
                        const updateItemPayer = item.payer === usuario.uid ? uid : item.payer;
                        // Member en Item
                        if (itemUserMemberIndex !== -1) {
                            const updateItemUserMember = [...item.itemUserMember];
                            updateItemUserMember[itemUserMemberIndex] = uid;
                            return { ...item, itemUserMember: updateItemUserMember, itemCreator: updateItemCreator, payer: updateItemPayer };
                        }

                        return item;
                    });
        
                    return { ...category, categoryCreator: updateCategoryCreator, items: updatedItems };
                });
                        
                // Payments
                const updatePayments = lista.payments.map(payment => {
                    // Payer pagos
                    const updatePaymentPayer = payment.payer === usuario.uid ? uid : payment.payer

                    // Payer pagos
                    const updatePaymentCreator = payment.paymentCreator === usuario.uid ? uid : payment.paymentCreator
                    
                    // Members en pagos
                    const updatePaymentMembers = payment.members.map(member => {
                        if(member.uid === usuario.uid) {
                            return {...member, uid: uid}
                        }
                        return member
                    })
                    return { ...payment, paymentCreator: updatePaymentCreator, payer: updatePaymentPayer, members: updatePaymentMembers}
                })
                setListas(prevListas => prevListas.map(lista => (
                    { ...lista, userCreator: updateUserCreator, userMember: updateUserMember, categories: updatedCategories, payments: updatePayments }
                )));
        
                // Actualizo en Firebase
                try {
                    await updateLista(lista.id, "userCreator", updateUserCreator );
                    await updateLista(lista.id, "userMember", updateUserMember );
                    await updateLista(lista.id, "categories", updatedCategories );
                    await updateLista(lista.id, "payments", updatePayments );
                } catch (error) {
                    console.error("Error al actualizar la lista:", error);
                }
            })
        )
    }

    const createReplacementUser = async() => {
        console.log(usuario.uid)
        try {
            const displayName = await UsuarioCompleto(usuario.uid)
            const uid = uuidv4()
            const newMember = doc(db, "usuarios", uid);
            const data = {
                uid,
                displayName,
                createdAt: new Date().toISOString(),
            }
            console.log(uid)
            await setDoc(newMember, data);
            console.log("usuario creado")
            await replaceMember(uid)
            console.log("replacement terminado")
        } catch (error) {
            console.error(error)
        }
    }

    const deleteUserDoc = async () => {
        const docRef = doc(db, "usuarios", usuario.uid)
        try {
            await deleteDoc(docRef)
            console.log("doc eliminado correctamente")
        } catch(error) {
            console.error("No se ha podido eliminar el doc de usuario.uid")
            throw error
        }
    }

    const handleDeleteUser = async (user) => {
        setError({
            password: password.trim() === ""
        })

        if(password.trim()) {
            try {
                await createReplacementUser()
                deleteUserDoc()
                const credential = EmailAuthProvider.credential(user.email, password); // Credenciales para reautenticar al usuario
                await reauthenticateWithCredential(user, credential)
                await deleteUser(user);
                setUserDeleted(true);
                setPopUpVisible(true);
                console.log("Usuario eliminado");
            } catch(error) {
                setPopUpVisible(true);
                console.error("Error eliminando usuario:", error);
            };
        } else {
            console.error("la contraseña está vacía")
            return
        }
    };

    const handlePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState)
    }

  return (
    <ButtonArea
        buttonCopy={"Eliminar cuenta"}
        onClick={() => setDeleteConfirmation(true)}
        style={{backgroundColor: "rgb(248, 167, 167)"}}
    >
        <div className="app">
            <Head 
                path={"profile"}
            />
            <div className="app-margin">
                <h2 style={{margin: "25px 0px", fontWeight: "600"}}>Eliminar usuario</h2>
                <h4 style={{marginBottom: "12px"}}>Recuerda que esta acción es irreversible. Perderás el acceso a tu cuenta, tus listas y tus datos.</h4>
                <h4>Las listas que hayas creado y compartido con otros usuarios que las tengan activas, no se eliminarán por lo que ellos pueden seguir consultándolas y usándolas.</h4>
            </div>
            {/* <button type="submit" style={{backgroundColor: "rgb(248, 167, 167)", position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", width: "calc(100% - 30px)"}} onClick={() => setDeleteConfirmation(true)}>Eliminar cuenta</button> */}
            {deleteConfirmation &&
                <Modal
                    title={"Confirma tu contraseña"}
                    closeOnClick={() => setDeleteConfirmation(false)}
                >
                    <h5>Introduce tu contraseña para confirmar que deseas eliminar tu cuenta de forma permanente</h5>
                    <div className="iconed-container FormLista fila-between" style={{marginTop: "10px"}}>
                        <input type={!isPasswordVisible ? "password" : "text"} placeholder="*******" aria-placeholder= "password" id="newContraseña" style={{width: "100%", height: "30px", border: "none"}} value={password} onChange={(e) => {setPassword(e.target.value); setError({password: false})}}/>
                        <span className="material-symbols-outlined icon-medium iconSuperpuesto" style={{paddingRight:"5px"}} onClick={handlePasswordVisibility}>{isPasswordVisible ? "visibility_off" : "visibility"}</span>
                    </div>
                    <h5 style={{display: error.password ? "block" : "none", color:"red"}}>Confirma tu contraseña actual</h5>
                    <button className="buttonMain" style={{width: "100%", marginBottom: "10px", backgroundColor: "rgb(248, 167, 167)"}} onClick={() => handleDeleteUser(user)}>Eliminar cuenta</button>
                </Modal>
            }
            {userDeleted && popUpVisible && // Ahora mismo no se ve porque como App.js no reconoce usuario, te echa de la App
                <ModalStatus
                    backgroundColor={"rgb(164, 207, 164)"}
                    closeOnClick={() => setPopUpVisible(false)}
                    title={"Tu cuenta se ha eliminado correctamente. Sentimos decirte adiós y confiamos verte muy pronto"}
                    icon={"check_circle"}
                    iconColor={"rgb(45, 165, 45)"}
                >
                </ModalStatus>
            }
            {!userDeleted && popUpVisible &&
                <ModalStatus
                    backgroundColor={"rgb(248, 167, 167)"}
                    closeOnClick={() => setPopUpVisible(false)}
                    title={"Algo ha fallado... Inténtalo más tarde"}
                    icon={"error"}
                    iconColor={"red"}
                >
                </ModalStatus>
            }
        </div>
    </ButtonArea>
  )
}

export default DeleteUser
