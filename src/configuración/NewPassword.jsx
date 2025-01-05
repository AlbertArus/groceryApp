import { useNavigate } from "react-router-dom"
import { getAuth, updatePassword } from "firebase/auth";
import { useState } from "react";
import firebaseApp from "../firebase-config.js"
import Head from "../components/Head";
import ButtonArea from "../ui-components/ButtonArea.jsx";
import ModalStatus from "../ui-components/ModalStatus.jsx";
const auth = getAuth(firebaseApp)

const NewPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    // const [error, setError] = useState(false);
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(true);
    const [popUpVisible, setPopUpVisible] = useState(false)
    const navigate = useNavigate()

    const handlePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState)
    }

    const handleChangePassword = (e) => {
        e.preventDefault()

        const isValid = validatePasswords()

        if(!isValid) {
            return
        }

        const user = auth.currentUser
    
        if (user) {
            updatePassword(user, newPassword)
            .then(() => {
                setSuccess(true)
                setPopUpVisible(true)
                setTimeout(() => {
                    navigate("/profile")
                },2000)
            })
            .catch((error) => {
                setPopUpVisible(true)
            })
        }
    }

    const validatePasswords = () => {
        const minLength = 6;
        let valid = true
    
        if (newPassword.trim() === "") {
            setErrors((prevErrors) => ({ ...prevErrors, newPassword: true }));
            valid = false;
        } else if (newPassword.length < minLength) {
            setErrors((prevErrors) => ({ ...prevErrors, newPasswordContraseñaInvalid: true }));
            valid = false;
        }
    
        if (confirmPassword.trim() === "") {
            setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: true }));
            valid = false;
        } else if (confirmPassword.length < minLength) {
            setErrors((prevErrors) => ({ ...prevErrors, confirmPasswordContraseñaInvalid: true }));
            valid = false;
        }
    
        if (newPassword !== confirmPassword) {
            setErrors((prevErrors) => ({...prevErrors, unalignPasswords: true}));
            valid = false;
        }
    
        return valid;
    };
    
  return (
    <ButtonArea 
        buttonCopy={"Cambiar contraseña"}
        onClick={handleChangePassword}        
    >
        <div className="app">
            <Head 
                path={"profile"}        
            />
            <div className="app-margin login">
            <h2 style={{marginBottom: "25px"}}>Modifica tu contraseña</h2>
                <form className="loginForm" onSubmit={handleChangePassword}>
                    <label htmlFor="newContraseña">Nueva contraseña</label>
                    <div className="iconed-container fila-between" style={{backgroundColor: "transparent", border: "1px solid #9E9E9E", margin: "5px 0px"}}>
                        <input type={!isPasswordVisible ? "password" : "text"} style={{border: "none", margin: "0px"}} placeholder="*******" aria-placeholder= "password" id="newContraseña" value={newPassword} onChange={(e) => {setNewPassword(e.target.value); setErrors((prevErrors) => ({...prevErrors, newPassword: false, newPasswordContraseñaInvalid: false}))}}/>
                        <span className="material-symbols-outlined icon-medium iconSuperpuesto" style={{paddingRight:"5px"}} onClick={handlePasswordVisibility}>{isPasswordVisible ? "visibility_off" : "visibility"}</span>
                    </div>
                    <h5 style={{display: errors.newPassword ? "block" : "none", color:"red"}}>Introduce una contraseña</h5>
                    <h5 style={{display: errors.newPasswordContraseñaInvalid ? "block" : "none", color:"red"}}>Tu contraseña debe tener almenos 6 caracteres</h5>
                    <label htmlFor="confirmContraseña">Confirmar contraseña</label>
                    <div className="iconed-container fila-between" style={{backgroundColor: "transparent", border: "1px solid #9E9E9E", margin: "5px 0px"}}>
                        <input type={!isPasswordVisible ? "password" : "text"} style={{border: "none", margin: "0px"}} placeholder="*******" aria-placeholder= "password" id="confirmContraseña" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value); setErrors((prevErrors) => ({...prevErrors, confirmPassword: false, confirmPasswordContraseñaInvalid: false}))}}/>
                        <span className="material-symbols-outlined icon-medium iconSuperpuesto" style={{paddingRight:"5px"}} onClick={handlePasswordVisibility}>{isPasswordVisible ? "visibility_off" : "visibility"}</span>
                    </div>
                    <h5 style={{display: errors.confirmPassword ? "block" : "none", color:"red"}}>Introduce una contraseña</h5>
                    <h5 style={{display: errors.confirmPasswordContraseñaInvalid ? "block" : "none", color:"red"}}>Tu contraseña debe tener almenos 6 caracteres</h5>
                    <h5 style={{display: errors.unalignPasswords ? "block" : "none", color:"red"}}>Las contraseñas no coinciden</h5>
                </form>
                </div>
                {success && popUpVisible &&
                    <ModalStatus
                        backgroundColor={"rgb(164, 207, 164)"}
                        closeOnClick={() => setPopUpVisible(false)}
                        title={"¡Contraseña actualizada con éxito!"}
                        icon={"check_circle"}
                        iconColor={"rgb(45, 165, 45)"}
                    >
                    </ModalStatus>
                }
                {!success && popUpVisible &&
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

export default NewPassword
