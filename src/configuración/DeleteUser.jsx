import { useNavigate } from "react-router-dom";

import firebaseApp from "../firebase-config.js";
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import Head from "../components/Head.jsx";
import { useEffect, useState } from "react";
const auth = getAuth(firebaseApp);

const DeleteUser = () => {
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)
    const [userDeleted, setUserDeleted] = useState(false)
    const [popUpVisible, setPopUpVisible] = useState(false)
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    const user = auth.currentUser


    const handleDeleteUser = (user) => {
        // Primero necesitamos las credenciales para reautenticar al usuario
        const credential = EmailAuthProvider.credential(user.email, password); // Aquí deberías pedir la contraseña al usuario

        reauthenticateWithCredential(user, credential)
        .then(() => {
            // Después de reautenticar, puedes intentar eliminar el usuario
            return deleteUser(user);
        })
        .then(() => {
            setUserDeleted(true);
            console.log("Usuario eliminado");
        })
        .catch((error) => {
            setPopUpVisible(true);
            console.error("Error eliminando usuario:", error);
        });
    };

    useEffect(() => {
        if (userDeleted) {
            const timer = setTimeout(() => {
                navigate("/profile"); // Redirige a la página de perfil después de 5 segundos
            }, 5000); // 5000 ms = 5 segundos

            return () => clearTimeout(timer); // Limpia el timeout si el componente se desmonta
        }
    }, [userDeleted, navigate]);

  return (
    <div className="app">
        <Head 
            path={"profile"}
        />
        <div className="app-margin">
            <h3 style={{margin: "25px 0px", fontWeight: "600"}}>Eliminar usuario</h3>
            <h5 style={{marginBottom: "12px"}}>Recuerda que esta acción es irreversible. Perderás el acceso a tu cuenta, tus listas y tus datos.</h5>
            <h5>Las listas que hayas creado y compartido con otros usuarios que las tengan activas, no se eliminarán por lo que ellos pueden seguir consultándolas y usándolas</h5>
        </div>
        <button type="submit" style={{backgroundColor: "rgb(248, 167, 167)", position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", width: "calc(100% - 30px)"}} onClick={() => setDeleteConfirmation(true)}>Eliminar cuenta</button>
        {deleteConfirmation && 
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>   
                <div className="overlay"></div>
                <div className="popUp app-margin" style={{backgroundColor: "white"}}>
                    <div className="fila-between" style={{ margin: "15px 0px"}}>
                        <h4 style={{ fontWeight: "600" }}>Confirma tu contraseña</h4>
                        <span className="material-symbols-outlined icon-medium" onClick={() => setDeleteConfirmation(false)}>close</span>
                    </div>
                    <h5>Introduce tu contraseña para confirmar que deseas eliminar tu cuenta de forma permanente</h5>
                    <div className="iconed-container fila-between">
                        <input type="password" placeholder="*******" aria-placeholder= "password" id="newContraseña" style={{width: "100%", height: "30px"}} value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type="submit" style={{backgroundColor: "rgb(248, 167, 167)"}} onClick={() => handleDeleteUser(user)}>Eliminar cuenta</button>
                </div>
            </div>        
        }
        {userDeleted && (
            <div>Tu cuenta se ha eliminado correctamente. Sentimos decirte adiós y confiamos verte muy pronto</div>
        )}
        {!userDeleted && popUpVisible && (
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>   
                <div className="overlay"></div>
                <div className="popUp app-margin" style={{backgroundColor: "rgb(248, 167, 167)"}}>
                    <div style={{ margin: "15px 0px", textAlign: "center"}}>
                        <span className="material-symbols-outlined icon-medium" style={{position: "absolute", right: "20px", cursor: "pointer"}} onClick={() => setPopUpVisible(false)}>close</span>
                        <span className="material-symbols-outlined icon-xxxlarge" style={{color: "red", margin: "15px 0px"}}>error</span>
                        <h5 style={{ fontWeight: "600", whiteSpace: "wrap"}}>Algo ha fallado... Inténtalo más tarde</h5>
                    </div>
                </div>
            </div>   
        )}
      
    </div>
  )
}

export default DeleteUser
