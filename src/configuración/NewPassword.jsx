import { useNavigate } from "react-router-dom"
import { getAuth, updatePassword } from "firebase/auth";
import { useState } from "react";
import firebaseApp from "../firebase-config.js"
import Head from "../components/Head";
const auth = getAuth(firebaseApp)

const NewPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    // const [error, setError] = useState(false);
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false);
    const [popUpVisible, setPopUpVisible] = useState(true)
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
    <div className="app">
        <Head />
        <div className="app-margin login">
        <h3 style={{marginBottom: "15px"}}>Modifica tu contraseña</h3>
            <form className="loginForm" onSubmit={handleChangePassword}>
                <label htmlFor="newContraseña">Nueva contraseña</label>
                <div className="iconed-container fila-between">
                    <input type={!isPasswordVisible ? "password" : "text"} placeholder="*******" aria-placeholder= "password" id="newContraseña" value={newPassword} onChange={(e) => {setNewPassword(e.target.value); setErrors((prevErrors) => ({...prevErrors, newPassword: false, newPasswordContraseñaInvalid: false}))}}/>
                    <span className="material-symbols-outlined icon-medium iconSuperpuesto" style={{paddingRight:"5px"}} onClick={handlePasswordVisibility}>{isPasswordVisible ? "visibility_off" : "visibility"}</span>
                </div>
                <h5 style={{display: errors.newPassword ? "block" : "none", color:"red"}}>Introduce una contraseña</h5>
                <h5 style={{display: errors.newPasswordContraseñaInvalid ? "block" : "none", color:"red"}}>Tu contraseña debe tener almenos 6 caracteres</h5>
                <label htmlFor="confirmContraseña">Confirmar contraseña</label>
                <div className="iconed-container fila-between">
                    <input type={!isPasswordVisible ? "password" : "text"} placeholder="*******" aria-placeholder= "password" id="confirmContraseña" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value); setErrors((prevErrors) => ({...prevErrors, confirmPassword: false, confirmPasswordContraseñaInvalid: false}))}}/>
                    <span className="material-symbols-outlined icon-medium iconSuperpuesto" style={{paddingRight:"5px"}} onClick={handlePasswordVisibility}>{isPasswordVisible ? "visibility_off" : "visibility"}</span>
                </div>
                <h5 style={{display: errors.confirmPassword ? "block" : "none", color:"red"}}>Introduce una contraseña</h5>
                <h5 style={{display: errors.confirmPasswordContraseñaInvalid ? "block" : "none", color:"red"}}>Tu contraseña debe tener almenos 6 caracteres</h5>
                <h5 style={{display: errors.unalignPasswords ? "block" : "none", color:"red"}}>Las contraseñas no coinciden</h5>
                <button type="submit">Cambiar contraseña</button>
            </form>
            </div>
            {success && popUpVisible && (
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>   
                    <div className="overlay"></div>
                    <div className="popUP app-margin" style={{backgroundColor: "rgb(142, 190, 142)"}}>
                        <div style={{ margin: "15px 0px", textAlign: "center"}}>
                        <span className="material-symbols-outlined icon-medium" style={{position: "absolute", right: "20px", cursor: "pointer"}} onClick={() => setPopUpVisible(false)}>close</span>
                        <span className="material-symbols-outlined icon-xxxlarge" style={{color: "rgb(78, 192, 78)"}}>check_circle</span>
                        <h4 style={{ fontWeight: "600", whiteSpace: "wrap" }}>¡Contraseña actualizada con éxito!</h4>
                        </div>
                    </div>
                </div>            
            )}
            {!success && popUpVisible && (
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

export default NewPassword
