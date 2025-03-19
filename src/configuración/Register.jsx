import { useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import firebaseApp, { db} from "../firebase-config.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { Checkbox } from "@mui/material"
import ButtonArea from "../ui-components/ButtonArea.jsx"
// import Toggle from "../ui-components/Toggle.jsx"
const auth = getAuth(firebaseApp)

const Register = ({setUsuario}) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const isRegistered = searchParams.get("view") === "login"
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [termsChecked, setTermsChecked] = useState(false)
    const [communicationsChecked, setCommunicationsChecked] = useState(false)
    const [errors, setErrors] = useState({nombre: false, correo: false, correoInvalid: false, contraseña: false, contraseñaInvalid: false, terms: false})
    const navigate = useNavigate()
    const nombreRef = useRef();
    const apellidoRef = useRef();
    const correoRef = useRef();
    const contraseñaRef = useRef();
    const [isToggleSelected, setIsToggleSelected] = useState(() => {
        return searchParams.get("view") === "login" ? "login" : "register"
    })

    const minLength = 6
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    
    const handleSubmit = async(e) => {
        e.preventDefault()
        
        const nombre = nombreRef.current.value;
        const apellido = apellidoRef.current.value;
        const correo = correoRef.current.value;
        const contraseña = contraseñaRef.current.value;
        const correoInvalid = !regex.test(correo.trim());        
        setErrors({
            nombre: (nombre.trim() === ""),
            correo: (correo.trim() === ""),
            correoInvalid: correoInvalid,
            contraseña: (contraseña.trim() === ""),
            contraseñaInvalid: (contraseña.trim().length < minLength),
            termsUnchecked: !termsChecked
        })

        const capitalizedNombre = nombre.charAt(0).toUpperCase()+nombre.slice(1).toLowerCase();
        const capitalizedApeliido = apellido.charAt(0).toUpperCase()+apellido.slice(1); // No añado toLowerCase por si es compuesto etc y necesita otra
        
        try {
            let userCredential;
            if(isRegistered) {
                if(correo.trim() && contraseña.trim()) {
                    userCredential = await signInWithEmailAndPassword(auth, correo, contraseña);
                }
            } else {
                if(nombre.trim() && correo.trim() && contraseña.trim() && termsChecked) {
                    userCredential = await createUserWithEmailAndPassword(auth, correo, contraseña);
                    await updateProfile(userCredential.user, {
                        displayName: `${nombre} ${apellido}`
                    });
    
                    await setDoc(doc(db, "usuarios", userCredential.user.uid), {
                        uid: userCredential.user.uid,
                        nombre: capitalizedNombre,
                        apellido: capitalizedApeliido,
                        displayName: `${capitalizedNombre} ${capitalizedApeliido}`,
                        email: correo,
                        comunicaciones: communicationsChecked,
                        createdAt: new Date().toISOString(),
                    });
                }
            }
            navigate("/");
        } catch(error) {
            console.error(isRegistered ? "Error al iniciar sesión:" : "Error al registrar el usuario:", error);
        }
    }

    const handlePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState)
    }

    const handleTermsCheck = () => {
        setTermsChecked(prevState => !prevState)
    }

    const handleCommunicationsCheck = (e) => {
        setCommunicationsChecked(prevState => !prevState)
    }

    const handleClickSelected = (toggle) => {
        setIsToggleSelected(toggle)
        setSearchParams({view: toggle})
    }

  return (
    <ButtonArea 
        onClick={handleSubmit}
        buttonCopy={isRegistered ? "Iniciar sesión" : "Registrarme"}
    >
        <div className="app" style={{height: "calc(100vh - 70px"}}>
            <div className="titleRegister" style={{margin: "40px 0px 5px 0px"}}>
                <img className="picRegister" src="/Fotos GroceryApp/favicon/android-chrome-192x192.png" alt="iconWeb" />
            </div>        
            <div className="login app-margin">
                <h2 style={{marginBottom: "25px", textAlign: "center"}}>GroceryApp</h2>
                <div className="toggle" style={{backgroundColor: "white", marginBottom: "25px"}}>
                    <div className="app-margin toggleBars">
                        <h4 onClick={() => handleClickSelected("register")} className={isToggleSelected === `register` ? "toggleOptions toggleBar" : "toggleOptions"}>Regístrate</h4>
                        <h4 onClick={() => handleClickSelected("login")} className={isToggleSelected === `login` ? "toggleOptions toggleBar" : "toggleOptions"}>Inicia sesión</h4>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombre" style={{display: isRegistered ? "none" : "block"}}>Nombre *</label>
                    <input type="text" autoComplete="given-name" placeholder="Sergio" id="nombre" ref={nombreRef} onChange={(e) => setErrors((prevErrors) => ({...prevErrors, nombre: false}))} style={{textTransform: "capitalize", display: isRegistered ? "none" : "block"}}/>
                    <h5 style={{display: !isRegistered && errors.nombre ? "block" : "none", color:"red"}}>Añade tu nombre</h5>
                    <label htmlFor="apellido" style={{display: isRegistered ? "none" : "block"}}>Apellido</label>
                    <input type="text" autoComplete="family-name" placeholder="Marquina" id="apellido" ref={apellidoRef} onChange={(e) => setErrors((prevErrors) => ({...prevErrors, apellido: false}))} style={{textTransform: "capitalize", display: isRegistered ? "none" : "block"}}/>
                    <label htmlFor="correo">Correo electrónico *</label>
                    <input type="email" autoComplete="email" placeholder="profesor@gmail.com" inputMode="email" id="correo" ref={correoRef} onChange={(e) => setErrors((prevErrors) => ({...prevErrors, correo: false}))} style={{textTransform: "lowercase"}} autoCapitalize="off"/>
                    <h5 style={{display: errors.correo ? "block" : "none", color:"red"}}>Añade un correo electrónico</h5>
                    <h5 style={{display: errors.correoInvalid ? "block" : "none", color:"red"}}>Tu dirección de correo electrónico no es correcta</h5>
                    <label htmlFor="contraseña">Contraseña *</label>
                    <div className="iconed-container fila-between" style={{backgroundColor: "transparent", border: "1px solid #9E9E9E", margin: "5px 0px"}}>
                        <input type={!isPasswordVisible ? "password" : "text"} style={{border: "none", margin: "0px"}} placeholder="*******" aria-placeholder= "password" id="contraseña" ref={contraseñaRef} onChange={(e) => setErrors((prevErrors) => ({...prevErrors, contraseña: false, contraseñaInvalid: false}))}/>
                        <span className="material-symbols-outlined icon-medium iconSuperpuesto" style={{paddingRight:"5px"}} onClick={handlePasswordVisibility}>{isPasswordVisible ? "visibility_off" : "visibility"}</span>
                    </div>
                    <h5 style={{display: errors.contraseña ? "block" : "none", color:"red"}}>Introduce una contraseña</h5>
                    <h5 style={{display: errors.contraseñaInvalid ? "block" : "none", color:"red"}}>Tu contraseña debe tener almenos 6 caracteres</h5>
                    <h6 style={{borderBottom: "1px solid rgb(173, 172, 172)", width: "fit-content", marginTop: "15px", display: !isRegistered ? "none" : "block"}} onClick={() => navigate("/forgot-password")}>He olvidado mi contraseña</h6>
                    <div className="fila-start" style={{marginTop: "7px", display: isRegistered ? "none" : "flex"}}>
                        <Checkbox 
                            checked={termsChecked}
                            onChange={() => {handleTermsCheck(); setErrors((prevErrors) => ({...prevErrors, termsUnchecked: false}))}}
                            sx={{
                            '&.Mui-checked': {
                                color: "green",
                            },
                            '&:not(.Mui-checked)': {
                                color: "#9E9E9E",
                            },
                            padding: "0px",
                            marginLeft: "-3px"
                        }}
                        />
                        <div style={{fontSize: "12px", marginLeft: "8px"}}>Acepto los <a href="https://albertarus.notion.site/T-rminos-y-condiciones-1205242bbfc7801daea9ffccbeab78f9?pvs=4">Términos</a> y <a href="https://albertarus.notion.site/Pol-tica-de-privacidad-1205242bbfc780498f42edf2652afae8">Política de privacidad</a></div>
                    </div>
                    <h5 style={{display: !isRegistered && errors.termsUnchecked ? "block" : "none", color:"red"}}>Debes aceptar los Términos y Polítca para registrarte</h5>
                    <div className="fila-start" style={{marginTop: "7px", display: isRegistered ? "none" : "flex"}} id="terms">
                        <Checkbox 
                            checked={communicationsChecked}
                            onClick={() => handleCommunicationsCheck()}
                            sx={{
                            '&.Mui-checked': {
                                color: "green",
                            },
                            '&:not(.Mui-checked)': {
                                color: "#9E9E9E",
                            },
                            padding: "0px",
                            marginLeft: "-3px"
                        }}
                        />
                        <div style={{fontSize: "12px", marginLeft: "8px"}}>Acepto recibir comunicaciones comerciales</div>
                    </div>
                </form>
            </div>
        </div>
    </ButtonArea>
  )
}

export default Register
