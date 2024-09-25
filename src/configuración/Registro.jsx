import { useState } from "react"
import firebaseApp from "../firebase-config.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
const auth = getAuth(firebaseApp)

const Registro = () => {
    const [isRegistered, setIsRegistered] = useState(false)

    const handleIsRegistered = () => {
        setIsRegistered(prevState => !prevState)
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        // const nombre = e.target.nombre.value
        // const apellido = e.target.apellido.value
        const correo = e.target.correo.value
        const contraseña = e.target.contraseña.value

        if(!isRegistered) {
            await createUserWithEmailAndPassword(auth, correo, contraseña)
        } else {
            await signInWithEmailAndPassword (auth, correo, contraseña)
        }
    }

  return (
    <div className="login">
        <h3 className="loginTitle" style={{marginBottom: "15px"}}>{isRegistered ? "Inicia sesión en tu cuenta" : "Regístrate en GroceryApp"}</h3>
        <form className="loginForm" onSubmit={handleSubmit}>
            <label htmlFor="nombre" style={{display: isRegistered ? "none" : "block"}}>Nombre</label>
            <input type="text" placeholder="Sergio" id="nombre" style={{textTransform: "capitalize", display: isRegistered ? "none" : "block"}}/>
            <label htmlFor="apellido" style={{display: isRegistered ? "none" : "block"}}>Apellido</label>
            <input type="text" placeholder="Quintana" id="apellido" style={{textTransform: "capitalize", display: isRegistered ? "none" : "block"}}/>
            <label htmlFor="correo">Correo electrónico</label>
            <input type="text" placeholder="profesor@gmail.com" id="correo"/>
            <label htmlFor="contraseña">Contraseña</label>
            <div className="password-container">
                <input type="password" placeholder="*******" id="contraseña" />
                <span id="togglePassword" className="material-symbols-outlined icon-medium">visibility_off</span>
            </div>
            <button type="submit">{isRegistered ? "Iniciar sesión" : "Registrarme"}</button>
        </form>
        <div className="redirect" onClick={handleIsRegistered}>{isRegistered ? "No tienes cuenta? Regístrate" : "Ya tienes cuenta? Inicia sesión"}</div>
    </div>
  )
}

export default Registro
