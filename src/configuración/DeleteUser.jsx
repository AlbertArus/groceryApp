import firebaseApp, { db } from "../firebase-config.js";
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import Head from "../components/Head.jsx";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import Modal from "../ui-components/Modal.jsx";
import ModalStatus from "../ui-components/ModalStatus.jsx";
import CreateReplacementUser from '../functions/CreateReplacementUser.jsx'
import Button from "../ui-components/Button.jsx";
const auth = getAuth(firebaseApp);

const DeleteUser = ({ usuario, UsuarioCompleto, updateLista, listas, setListas }) => {
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)
    const [userDeleted, setUserDeleted] = useState(false)
    const [popUpVisible, setPopUpVisible] = useState(false)
    const [password, setPassword] = useState("")
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [error, setError] = useState({password: false})
    const [inactive, setInactive] = useState(false)
    const user = auth.currentUser

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
        setInactive(true)
        setError({
            password: password.trim() === ""
        })
    
        if(password.trim()) {
            try {
                await CreateReplacementUser({usuario, UsuarioCompleto, updateLista, listas, setListas})
                deleteUserDoc()
                const credential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, credential)
                await deleteUser(user);
                setUserDeleted(true);
                setPopUpVisible(true);
                console.log("Usuario eliminado");
            } catch(error) {
                setInactive(false)
                console.error("Error eliminando usuario:", error);
    
                let errorMessage = "";
                switch(error.code) {
                    case "auth/invalid-login-credentials":
                        errorMessage = "La contraseña no es correcta";
                        break;
                    case "auth/weak-password":
                        errorMessage = "La contraseña es demasiado débil";
                        break;
                    default:
                        errorMessage = "Error al eliminar usuario. Por favor, inténtalo de nuevo";
                }
    
                setError((prevError) => ({
                    ...prevError,
                    passwordInvalid: error.code === "auth/invalid-login-credentials",
                }));
            }
        } else {
            setInactive(false)
            console.error("la contraseña está vacía")
            setError((prevError) => ({
                ...prevError,
                password: true
            }));
        }
    }
    
    const handlePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState)
    }

    return (
        <div className="app form">
            <Head 
                path={"profile"}
            />
            <div className="app-margin">
                <h2 style={{margin: "25px 0px", fontWeight: "600"}}>Eliminar usuario</h2>
                <h4 style={{marginBottom: "12px"}}>Recuerda que esta acción es irreversible. Perderás el acceso a tu cuenta, tus listas y tus datos.</h4>
                <h4>Las listas que hayas creado y compartido con otros usuarios que las tengan activas, no se eliminarán por lo que ellos pueden seguir consultándolas y usándolas.</h4>
            </div>
            {deleteConfirmation &&
                <Modal
                    title={"Confirma tu contraseña"}
                    closeOnClick={() => {setDeleteConfirmation(false); setPassword(""); setError({password: false})}}
                    overlayOnClick={() => {setDeleteConfirmation(false); setPassword(""); setError({password: false})}}
                >
                    <h5>Introduce tu contraseña para confirmar que deseas eliminar tu cuenta de forma permanente</h5>
                    <div className="iconed-container fila-between" style={{marginTop: "10px"}}>
                        <input type={!isPasswordVisible ? "password" : "text"} placeholder="*******" aria-placeholder= "password" id="newContraseña" style={{width: "100%", height: "30px", border: "none"}} value={password} onChange={(e) => {setPassword(e.target.value); setError({password: false})}}/>
                        <span className="material-symbols-outlined icon-medium iconSuperpuesto" style={{paddingRight:"5px"}} onClick={handlePasswordVisibility}>{isPasswordVisible ? "visibility_off" : "visibility"}</span>
                    </div>
                    <h5 style={{display: error.password ? "block" : "none", color:"red"}}>Confirma tu contraseña actual</h5>
                    <h5 style={{display: error.passwordInvalid ? "block" : "none", color:"red"}}>La contraseña no es correcta</h5>
                    <Button
                        buttonCopy={"Eliminar cuenta"}
                        onClick={() => handleDeleteUser(user)}
                        style={{backgroundColor: inactive ? "" : "rgb(248, 167, 167)", margin: "12px 0px 0px", fontSize: "12px", color: "black"}}
                        inactive={inactive}
                    />
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
                <div className="button-main-fixed">
                    <Button
                        buttonCopy={"Eliminar cuenta"}
                        onClick={() => setDeleteConfirmation(true)}
                        style={{backgroundColor: inactive ? "" : "rgb(248, 167, 167)"}}
                        inactive={inactive}
                    />
                </div>
        </div>
    )
}

export default DeleteUser
