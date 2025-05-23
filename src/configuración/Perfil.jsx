import { useNavigate } from "react-router-dom";

import firebaseApp from "../firebase-config.js";
import { getAuth, signOut} from "firebase/auth";
import ItemSettings from "../components/ItemSettings.jsx";
import Head from "../components/Head.jsx";
// import { useState } from "react";
const auth = getAuth(firebaseApp);

const Perfil = ({ usuario }) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut(auth);
        navigate("/");
    };

    return (
        <div className="perfil app">
            <Head
                path={""}            
                sectionName={"Mi perfil"}
            />
            <div className="contentPerfil app-margin">
                <div className="introPerfil">
                    <div className="foto" style={{ margin: "15px 0px 7px 0px" }}>
                        <span className="material-symbols-outlined icon-xxxlarge">account_circle</span>
                    </div>
                    <h1 style={{ fontWeight: "600" }}>{usuario.nombre}</h1>
                    <h5>{usuario.email}</h5>
                </div>
                {/* <Link> */}
                    <div className="iconed-container fila-between" style={{ marginTop: "10px" }}>
                        <div className="infoPersonalData">
                            <h6>Nombre</h6>
                            <h4>{usuario.displayName}</h4>
                        </div>
                        <div className="arrowPersonalData">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </div>
                    </div>
                {/* </Link> */}
                <hr className="hr_configuration"/>
                <div className="linksPerfil">
                    <ItemSettings 
                        iconName={"password"}
                        itemSettingsName={"Cambiar contraseña"}
                        onClick={() => navigate("/password")}
                    />
                    <ItemSettings 
                        iconName={"logout"}
                        itemSettingsName={"Cerrar sesión"}
                        onClick={() => {handleSignOut(); navigate("/register")}}
                    />
                    <ItemSettings 
                        iconName={"delete_forever"}
                        itemSettingsName={"Eliminar usuario"}
                        onClick={() => navigate("/deleteuser")}
                    />
                </div>
            </div>
        </div>
    );
};

export default Perfil;
