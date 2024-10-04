import { useNavigate } from "react-router-dom";
import ItemSettings from "../components/ItemSettings";

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
                <h2 style={{ fontWeight: "600", margin: "15px 0px 40px 0px"}}>Ajustes</h2>
            </div>
            <div className="linksPerfil">
                <h4>Personalización</h4>
                <ItemSettings 
                    iconName={"language"}
                    itemSettingsName={"Idioma (pending)"}
                    // onClick={handleDeleteUser}
                />
                <ItemSettings 
                    iconName={"dark_mode"}
                    itemSettingsName={"Modo oscuro (pending)"}
                    // onClick={handleDeleteUser}
                />
                <ItemSettings 
                    iconName={"notifications"}
                    itemSettingsName={"Notificaciones (pending)"}
                    // onClick={handleDeleteUser}
                />
                <hr />
                <h4>Ayuda y Soporte</h4>            
                <ItemSettings 
                    iconName={"help"}
                    itemSettingsName={"Preguntas frecuentes (pending)"}
                    // onClick={handleDeleteUser}
                />
                <ItemSettings 
                    iconName={"support_agent"}
                    itemSettingsName={"Reportar incidencia (pending)"}
                    // onClick={handleDeleteUser}
                />
                <ItemSettings 
                    iconName={"campaign"}
                    itemSettingsName={"Enviar sugerencias (pending)"}
                    // onClick={handleDeleteUser}
                />
                <hr />
                <h4>Legal</h4>                
                <ItemSettings 
                    iconName={"description"}
                    itemSettingsName={"Términos del servicio (pending)"}
                    // onClick={handleDeleteUser}
                />
                <ItemSettings 
                    iconName={"lock"}
                    itemSettingsName={"Política de privacidad (pending)"}
                    // onClick={handleDeleteUser}
                />                                                             
            </div>
        </div>
    </div>
  );
};

export default Settings;
