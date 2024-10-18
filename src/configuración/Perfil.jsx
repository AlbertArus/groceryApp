import { useNavigate } from "react-router-dom";

import firebaseApp from "../firebase-config.js";
import { getAuth, signOut } from "firebase/auth";
import ItemSettings from "../components/ItemSettings.jsx";
import Head from "../components/Head.jsx";
const auth = getAuth(firebaseApp);

const Perfil = ({ usuario, correoUsuario, usuarioCompleto }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth);
    navigate("/");
  };

  const handleDeleteUser = () => {
    
  }

  return (
    <div className="perfil app">
        <Head
            sectionName={"Mi perfil"}
        />
        <div className="contentPerfil app-margin">
            <div className="introPerfil">
                <div className="foto" style={{ margin: "15px 0px 7px 0px" }}>
                    <span className="material-symbols-outlined icon-xlarge">account_circle</span>
                </div>
                <h2 style={{ fontWeight: "600" }}>{usuario}</h2>
                <h5>{correoUsuario}</h5>
            </div>
            {/* <form>
                <label htmlFor="nombre">Nombre completo</label>
                <input type="text" placeholder="Harvey Specter" id="nombre" onChange={(e) => setListaName(e.target.value)} value={listaName} required />
            </form> */}
            <div className="personalData fila-between" style={{ marginTop: "10px" }}>
                <div className="infoPersonalData">
                    <h6>Nombre</h6>
                    <h4>{usuarioCompleto}</h4>
                </div>
                <div className="arrowPersonalData">
                    <span className="material-symbols-outlined">chevron_right</span>
                </div>
            </div>
            <hr />
            <div className="linksPerfil">
                <ItemSettings 
                    iconName={"password"}
                    itemSettingsName={"Cambiar contraseña"}
                    onClick={() => navigate("/password")}
                />
                <ItemSettings 
                    iconName={"logout"}
                    itemSettingsName={"Cerrar sesión"}
                    onClick={handleSignOut}
                />
                <ItemSettings 
                    iconName={"delete_forever"}
                    itemSettingsName={"Eliminar usuario (Pending)"}
                    onClick={handleDeleteUser}
                />
            </div>
        </div>
    </div>
  );
};

export default Perfil;
