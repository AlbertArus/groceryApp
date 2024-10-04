import { useNavigate } from "react-router-dom";

import firebaseApp from "../firebase-config.js";
import { getAuth, signOut } from "firebase/auth";
import ItemSettings from "../components/ItemSettings.jsx";
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
    <div className="perfil">
        <div className="head">
            <div className="perfilHeader fila-start app-margin">
            <div className="headerArrow">
                <span className="material-symbols-outlined icon-large" onClick={() => navigate("/")}>arrow_back</span>
            </div>
            <div className="perfilTitle">Mi perfil</div>
            </div>
        </div>
        <div className="contentPerfil app-margin">
            <div className="introPerfil">
                <div className="foto" style={{ margin: "15px 0px 7px 0px" }}>
                    <span className="material-symbols-outlined icon-xlarge">account_circle</span>
                </div>
                <h2 style={{ fontWeight: "600" }}>{usuario}</h2>
                <h5>{correoUsuario}</h5>
            </div>
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
                    // onClick={handleSignOut}
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
