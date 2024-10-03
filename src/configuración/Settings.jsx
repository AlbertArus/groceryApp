import { useNavigate } from "react-router-dom";

const Settings = () => {
    const navigate = useNavigate()

  return (
    <div className="perfil">
        <div className="head">
            <div className="perfilHeader fila-start app-margin">
            <div className="headerArrow">
                <span className="material-symbols-outlined icon-large" onClick={() => navigate("/")}>arrow_back</span>
            </div>
            <div className="perfilTitle">Ajustes</div>
            </div>
        </div>
        <div className="contentPerfil app-margin">
            <div className="introPerfil">
                <h2 style={{ fontWeight: "600" }}>Ajustes</h2>
            </div>
            <div className="linksPerfil">
                <div className="fila-start">
                    <span className="material-symbols-outlined icon-medium"style={{ marginRight: "7px" }}>description</span>
                    <h4 className="TermsText">Modo oscuro (pending)</h4>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Settings;
