import { useState } from "react"
import { useNavigate } from "react-router-dom"
import firebaseApp, { db} from "../firebase-config.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
const auth = getAuth(firebaseApp)

const Registro = ({setUsuario}) => {
    const [isRegistered, setIsRegistered] = useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [errors, setErrors] = useState({nombre: false, apellido: false, correo: false, correoInvalid: false, contraseña: false, contraseñaInvalid: false})

    const navigate = useNavigate()

    const handleIsRegistered = () => {
        setIsRegistered(prevState => !prevState)
    }

    const minLength = 6
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        const nombre = e.target.nombre.value
        const apellido = e.target.apellido.value
        const correo = e.target.correo.value
        const contraseña = e.target.contraseña.value

        const correoInvalid = !regex.test(correo.trim());
        
        setErrors({
            nombre: (nombre.trim() === ""),
            apellido: (apellido.trim() === ""),
            correo: (correo.trim() === ""),
            correoInvalid: correoInvalid,
            contraseña: (contraseña.trim() === ""),
            contraseñaInvalid: (contraseña.trim().length <= minLength)
        })
        
        if(nombre.trim() && apellido.trim() && correo.trim() && contraseña.trim()) {
            try {
                let userCredential;
                if(isRegistered) {
                    userCredential = await signInWithEmailAndPassword (auth, correo, contraseña)
                } else {
                    userCredential = await createUserWithEmailAndPassword(auth, correo, contraseña)
                    await updateProfile(userCredential.user, {
                        displayName: `${nombre} ${apellido}`
                    });
    
                    await setDoc(doc(db, "usuarios", userCredential.user.uid), {
                        uid: userCredential.user.uid,
                        nombre: nombre,
                        apellido: apellido,
                        email: correo,
                        createdAt: new Date(),
                      });
                }
    
                setUsuario(userCredential.user);
                navigate("/")
            } catch(error) {
                console.error(isRegistered ? "Error al iniciar sesión:" : "Error al registrar el usuario:", error);
            }
        }
    }

    const handlePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState)
    }

  return (
    <div className="app">
        <div className="login app-margin">
            <h3 className="loginTitle" style={{marginBottom: "15px"}}>{isRegistered ? "Inicia sesión en tu cuenta" : "Regístrate en GroceryApp"}</h3>
            <form className="loginForm" onSubmit={handleSubmit}>
                <label htmlFor="nombre" style={{display: isRegistered ? "none" : "block"}}>Nombre</label>
                <input type="text" autoComplete="given-name" placeholder="Sergio" id="nombre" onChange={(e) => setErrors((prevErrors) => ({...prevErrors, nombre: false}))} style={{textTransform: "capitalize", display: isRegistered ? "none" : "block"}}/>
                <h5 style={{display: !isRegistered && errors.nombre ? "block" : "none", color:"red"}}>Añade tu nombre</h5>
                <label htmlFor="apellido" style={{display: isRegistered ? "none" : "block"}}>Apellido</label>
                <input type="text" autoComplete="family-name" placeholder="Quintana" id="apellido" onChange={(e) => setErrors((prevErrors) => ({...prevErrors, apellido: false}))} style={{textTransform: "capitalize", display: isRegistered ? "none" : "block"}}/>
                <h5 style={{display: !isRegistered && errors.apellido ? "block" : "none", color:"red"}}>Añade tu apellido</h5>
                <label htmlFor="correo">Correo electrónico</label>
                <input type="email" autoComplete="email" placeholder="profesor@gmail.com" inputMode="email" id="correo" onChange={(e) => setErrors((prevErrors) => ({...prevErrors, correo: false}))} style={{textTransform: "lowercase"}} autoCapitalize="off"/>
                <h5 style={{display: errors.correo ? "block" : "none", color:"red"}}>Añade un correo electrónico</h5>
                <h5 style={{display: errors.correoInvalid ? "block" : "none", color:"red"}}>Tu dirección de correo electrónico no es correcta</h5>
                <label htmlFor="contraseña">Contraseña</label>
                <div className="iconed-container fila-between ">
                    <input type={!isPasswordVisible ? "password" : "text"} placeholder="*******" aria-placeholder= "password" id="contraseña" onChange={(e) => setErrors((prevErrors) => ({...prevErrors, contraseña: false, contraseñaInvalid: false}))}/>
                    <span className="material-symbols-outlined icon-medium iconSuperpuesto" style={{paddingRight:"5px"}} onClick={handlePasswordVisibility}>{isPasswordVisible ? "visibility_off" : "visibility"}</span>
                </div>
                <h5 style={{display: errors.contraseña ? "block" : "none", color:"red"}}>Introduce una contraseña</h5>
                <h5 style={{display: errors.contraseñaInvalid ? "block" : "none", color:"red"}}>Tu contraseña debe tener almenos 6 caracteres</h5>
                <button type="submit">{isRegistered ? "Iniciar sesión" : "Registrarme"}</button>
            </form>
            <div className="redirect" onClick={handleIsRegistered}>{isRegistered ? "No tienes cuenta? Regístrate" : "Ya tienes cuenta? Inicia sesión"}</div>
        </div>

    </div>
  )
}

export default Registro
