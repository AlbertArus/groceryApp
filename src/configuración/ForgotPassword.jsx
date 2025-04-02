import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import firebaseApp from "../firebase-config.js";
import ModalStatus from "../ui-components/ModalStatus.jsx";
import Head from "../components/Head.jsx";
import { useNavigate } from "react-router-dom";
import Button from "../ui-components/Button.jsx";

const auth = getAuth(firebaseApp);

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [popUpVisible, setPopUpVisible] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate()

    const handleResetPassword = (e) => {
        e.preventDefault();

        sendPasswordResetEmail(auth, email)
            .then(() => {
                setSuccess(true);
                setPopUpVisible(true);
            })
            .catch(() => {
                setSuccess(false);
                setPopUpVisible(true);
            });
    };

    return (
        <div className="app">
            <Head
                path={"/register"}            
                sectionName={""}                
            />
            <div className="app-margin login">
                <h2 style={{margin: "25px 0px", fontWeight: "600"}}>Recuperar contraseña</h2>
                <form onSubmit={handleResetPassword}>
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="ejemplo@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </form>

                {success && popUpVisible && (
                    <ModalStatus
                        backgroundColor={"rgb(164, 207, 164)"}
                        closeOnClick={() => setPopUpVisible(false)}
                        title={"¡Correo enviado!"}
                        icon={"check_circle"}
                        iconColor={"rgb(45, 165, 45)"}
                    >
                        <div className="texto">Revisa tu bandeja de entrada y sigue las instrucciones.</div>
                        <button onClick={() => navigate("/register?view=login")} className="buttonMain" style={{width: "100%"}}>Volver al registro</button>
                    </ModalStatus>
                )}
                {!success && popUpVisible && (
                    <ModalStatus
                        backgroundColor={"rgb(248, 167, 167)"}
                        closeOnClick={() => setPopUpVisible(false)}
                        title={"Error al enviar el correo"}
                        icon={"error"}
                        iconColor={"red"}
                    />
                )}
            </div>
            <div className="button-main-fixed">
                <Button
                    buttonCopy={"Enviar enlace de recuperación"}
                    onClick={handleResetPassword}
                />
            </div>            
        </div>
    );
};

export default ForgotPassword;