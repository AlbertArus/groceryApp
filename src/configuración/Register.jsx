import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import firebaseApp, { db} from "../firebase-config.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { Checkbox } from "@mui/material"
import Button from "../ui-components/Button.jsx"
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
    // const [isToggleSelected, setIsToggleSelected] = useState(() => {
    //     return searchParams.get("view") === "login" ? "login" : "register"
    // })
    const [isToggleSelected, setIsToggleSelected] = useState(isRegistered ? "login" : "register")
    const [inactive, setInactive] = useState(false)

    const minLength = 6
    const regex = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,}$/;

    useEffect(() => {
        const view = searchParams.get("view")
        setIsToggleSelected(view === "login" ? "login" : "register")
        console.log("actualizo toggle")
    }, [searchParams])
    
    const handleSubmit = async(e) => {
        e.preventDefault()
        setInactive(true)
        
        const correo = correoRef.current.value;
        const contraseña = contraseñaRef.current.value;
        
        if(isRegistered) {
            const correoInvalid = !regex.test(correo.trim());
            setErrors({
                correo: (correo.trim() === ""),
                correoInvalid: correoInvalid,
                contraseña: (contraseña.trim() === ""),
                contraseñaInvalid: (contraseña.trim().length < minLength),
                nombre: false,
                termsUnchecked: false
            });
            
            if(correo.trim() && contraseña.trim() && !correoInvalid) {
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, correo, contraseña);
                    if (userCredential) {
                        navigate("/");
                    }
                } catch (error) {
                    setInactive(false)
                    console.error("Error al iniciar sesión:", error);
                    let errorMessage = "";
                    switch(error.code) {
                        case "auth/invalid-email":
                            errorMessage = "El formato del correo electrónico no es válido";
                            break;
                        case "auth/invalid-login-credentials":
                                errorMessage = "No existe una cuenta con este correo electrónico";
                                break;                        
                        case "auth/user-not-found":
                            errorMessage = "No existe una cuenta con este correo electrónico";
                            break;
                        case "auth/wrong-password":
                            errorMessage = "La contraseña es incorrecta";
                            break;
                        case "auth/too-many-requests":
                            errorMessage = "Demasiados intentos fallidos. Intenta más tarde";
                            break;
                        default:
                            errorMessage = "Error al iniciar sesión. Por favor, inténtalo de nuevo";
                    }

                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        correoInvalid: error.code === "auth/invalid-email",
                        contraseñaInvalid: error.code === "auth/wrong-password",
                        correo: error.code === "auth/user-not-found",
                        authError: true,
                        authErrorMessage: errorMessage
                    }));
                }
            } else {
                setInactive(false)
            }
        } else {
            const nombre = nombreRef.current.value;
            const apellido = apellidoRef.current.value;
            const correoInvalid = !regex.test(correo.trim());
            
            setErrors({
                nombre: (nombre.trim() === ""),
                correo: (correo.trim() === ""),
                correoInvalid: correoInvalid,
                contraseña: (contraseña.trim() === ""),
                contraseñaInvalid: (contraseña.trim().length < minLength),
                termsUnchecked: !termsChecked
            });
            
            if(nombre.trim() && correo.trim() && contraseña.trim() && termsChecked && !correoInvalid && contraseña.trim().length >= minLength) {
                try {
                    const capitalizedNombre = nombre.charAt(0).toUpperCase()+nombre.slice(1).toLowerCase();
                    const capitalizedApeliido = apellido.charAt(0).toUpperCase()+apellido.slice(1);
                    
                    const userCredential = await createUserWithEmailAndPassword(auth, correo, contraseña);
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
                    
                    if (userCredential) {
                        navigate("/");
                    }
                } catch (error) {
                    setInactive(false)
                    let errorMessage = "";
                    switch(error.code) {
                        case "auth/email-already-in-use":
                            errorMessage = "El correo electrónico no es válido";
                            break;
                        case "auth/invalid-email":
                            errorMessage = "El formato del correo electrónico no es válido";
                            break;
                        case "auth/weak-password":
                            errorMessage = "La contraseña es demasiado débil";
                            break;
                        default:
                            errorMessage = "Error al crear la cuenta. Por favor, inténtalo de nuevo";
                    }

                    console.error("Error al registrar el usuario:", error);
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        correoInvalid: error.code === "auth/invalid-email",
                        correo: error.code === "auth/email-already-in-use",
                        authError: true,
                        authErrorMessage: errorMessage
                    }));
                }
            } else {
                setInactive(false)
            }
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
        <div className="app">
            <div className="titleRegister">
                <div className="picRegister">
                    <img src="/Fotos GroceryApp/favicon/android-chrome-192x192.png" alt="iconWeb" style={{margin: "25px 0px 5px 0px", width: "80px", height: "80px"}}/>
                </div>
                <h2 style={{marginBottom: "15px", textAlign: "center"}}>GroceryApp</h2>
                <div className="toggle" style={{backgroundColor: "white", marginBottom: "20px"}}>
                    <div className="app-margin toggleBars">
                        <h4 onClick={() => handleClickSelected("register")} className={isToggleSelected === `register` ? "toggleOptions toggleBar" : "toggleOptions"}>Regístrate</h4>
                        <h4 onClick={() => handleClickSelected("login")} className={isToggleSelected === `login` ? "toggleOptions toggleBar" : "toggleOptions"}>Inicia sesión</h4>
                    </div>
                </div>
            </div>        
            <div className="form app-margin">
                <form>
                    <label htmlFor="nombre" style={{display: isRegistered ? "none" : "block"}}>Nombre *</label>
                    <input type="text" autoComplete="given-name" placeholder="Sergio" id="nombre" ref={nombreRef} onChange={(e) => setErrors((prevErrors) => ({...prevErrors, nombre: false}))} style={{textTransform: "capitalize", display: isRegistered ? "none" : "block"}}/>
                    <h5 style={{display: !isRegistered && errors.nombre ? "block" : "none", color:"red"}}>Añade tu nombre</h5>
                    <label htmlFor="apellido" style={{display: isRegistered ? "none" : "block"}}>Apellido</label>
                    <input type="text" autoComplete="family-name" placeholder="Marquina" id="apellido" ref={apellidoRef} onChange={(e) => setErrors((prevErrors) => ({...prevErrors, apellido: false}))} style={{textTransform: "capitalize", display: isRegistered ? "none" : "block"}}/>
                    <label htmlFor="correo">Correo electrónico *</label>
                    <input type="email" autoComplete="email" placeholder="profesor@gmail.com" inputMode="email" id="correo" ref={correoRef} onChange={(e) => setErrors((prevErrors) => ({...prevErrors, correo: false}))} style={{textTransform: "lowercase"}} autoCapitalize="off"/>
                    <h5 style={{display: errors.correo ? "block" : "none", color:"red"}}>Añade un correo electrónico</h5>
                    <h5 style={{display: errors.authError ? "block" : "none", color:"red"}}>{errors.authErrorMessage}</h5>
                    <h5 style={{display: errors.correoInvalid ? "block" : "none", color:"red"}}>El formato del correo electrónico no es válido</h5>
                    <label htmlFor="contraseña">Contraseña *</label>
                    <div className="iconed-container fila-between">
                        <input type={!isPasswordVisible ? "password" : "text"} placeholder="*******" aria-placeholder= "password" id="contraseña" ref={contraseñaRef} onChange={(e) => setErrors((prevErrors) => ({...prevErrors, contraseña: false, contraseñaInvalid: false}))}/>
                        <span className="material-symbols-outlined icon-medium iconSuperpuesto" style={{paddingRight:"5px"}} onClick={handlePasswordVisibility}>{isPasswordVisible ? "visibility_off" : "visibility"}</span>
                    </div>
                    <h5 style={{display: errors.contraseña ? "block" : "none", color:"red"}}>Introduce una contraseña</h5>
                    <h5 style={{display: errors.contraseñaInvalid ? "block" : "none", color:"red"}}>Tu contraseña debe tener almenos 6 caracteres</h5>
                    <h6 style={{borderBottom: "1px solid rgb(173, 172, 172)", width: "fit-content", marginTop: "15px", display: !isRegistered ? "none" : "block"}} onClick={() => navigate("/forgot-password")}>He olvidado mi contraseña</h6>
                    <div className="fila-start" style={{marginTop: "15px", display: isRegistered ? "none" : "flex"}}>
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
            <div className="button-main-fixed">
                <Button
                    onClick={(e) =>handleSubmit(e)}
                    buttonCopy={isRegistered ? "Iniciar sesión" : "Registrarme"}
                    inactive={inactive}
                />
            </div>
        </div>
    )
}

export default Register