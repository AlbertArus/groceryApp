import { useNavigate } from "react-router-dom";

import firebaseApp from "../firebase-config.js";
import { getAuth, signOut } from "firebase/auth";
import ItemSettings from "../components/ItemSettings.jsx";
import Head from "../components/Head.jsx";
import ItemProfile from "../components/ItemProfile.jsx";
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
                {/* <div onClick={() => navigate("/editprofile")}>
                    <div className="iconed-container fila-between" style={{ marginTop: "10px" }}>
                        <div className="infoPersonalData">
                            <h6>Nombre</h6>
                            <h4>{usuario.displayName}</h4>
                        </div>
                        <div className="arrowPersonalData">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </div>
                    </div>
                </div> */}
                <div>
                    <ItemProfile
                        titleName={"Nombre"}
                        itemProfileName={usuario.displayName}
                        iconName={"edit"}
                    />
                    <ItemProfile
                        titleName={"Email"}
                        itemProfileName={usuario.email}
                    />
                    <ItemProfile
                        titleName={"Contraseña"}
                        itemProfileName={"********"}
                        iconName={"edit"}
                        onClick={() => navigate("/password")}
                    />
                    <ItemProfile
                        titleName={"Teléfono"}
                        itemProfileName={usuario.phoneNumber || "No disponible"}
                        iconName={"edit"}
                    />
                    <ItemProfile
                        titleName={"Fecha de nacimiento"}
                        itemProfileName={usuario.birthDate || "No disponible"}
                        iconName={"edit"}
                    />
                    <ItemProfile
                        titleName={"Género"}
                        itemProfileName={usuario.gender || "No disponible"}
                        iconName={"edit"}
                    />
                    <ItemProfile
                        titleName={"Comunicaciones"}
                        itemProfileName={usuario.comunicaciones === false ? "No" : "Sí"}
                        iconName={"edit"}
                    />
                    <ItemProfile
                        titleName={"Fecha de registro"}
                        itemProfileName={usuario.metadata.creationTime || "No disponible"}
                    />
                </div>
                <hr className="hr_configuration" />
                <div className="linksPerfil">
                    {/* <ItemSettings
                        iconName={"password"}
                        itemSettingsName={"Cambiar contraseña"}
                        onClick={() => navigate("/password")}
                    /> */}
                    <ItemSettings
                        iconName={"logout"}
                        itemSettingsName={"Cerrar sesión"}
                        onClick={() => { handleSignOut(); navigate("/register") }}
                    />
                    <ItemSettings
                        iconName={"delete_forever"}
                        itemSettingsName={"Eliminar usuario"}
                        onClick={() => navigate("/deleteuser")}
                        style={{ color: "#ff0000" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Perfil;
