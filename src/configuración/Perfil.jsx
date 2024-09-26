import { useNavigate } from "react-router-dom";

import firebaseApp from "../firebase-config.js";
import { getAuth, signOut } from "firebase/auth";
const auth = getAuth(firebaseApp);

const Perfil = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth);
    navigate("/");
  };

  return (
    <div className="perfil">
        <div className="head">
            <div className="perfilHeader fila-start app-margin">
            <div className="headerArrow">
                <span
                className="material-symbols-outlined icon-large"
                onClick={() => navigate("/")}
                >
                arrow_back
                </span>
            </div>
            <div className="perfilTitle">Mi perfil</div>
            </div>
        </div>
        <div className="contentPerfil app-margin">
            <div className="introPerfil">
                {/* <h6>Perfil</h6> */}
                <div className="foto" style={{ margin: "15px 0px 7px 0px" }}>
                    <span className="material-symbols-outlined icon-xlarge">account_circle</span>
                </div>
                <h5 style={{ fontWeight: "700" }}>Nombre</h5>
                <h5>Correo</h5>
            </div>
            <div className="personalData fila-between" style={{ marginTop: "10px" }}>
                <div className="infoPersonalData">
                    <h6>Nombre</h6>
                    <h5>Albert Arús</h5>
                </div>
                <div className="arrowPersonalData">
                    <span className="material-symbols-outlined">chevron_right</span>
                </div>
            </div>
            <hr />
            <div className="linksPerfil">
                <div className="Terms fila-start">
                    <span className="material-symbols-outlined icon-medium">description</span>
                    <div className="TermsText">Términos del servicio</div>
                </div>
                <div className="signOut fila-start" style={{ marginTop: "8px" }}>
                    <span className="material-symbols-outlined icon-medium" style={{ marginLeft: "2px" }}>logout</span>
                    <div className="signOutText" onClick={handleSignOut}>Cerrar sesión</div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Perfil;
