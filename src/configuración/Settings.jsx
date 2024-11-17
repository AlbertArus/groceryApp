import ItemSettings from "../components/ItemSettings";
import Head from "../components/Head";

const Settings = () => {

  return (
    <div className="perfil app">
        <Head
            path={""}            
            sectionName={"Ajustes"}
        />
        <div className="contentPerfil app-margin">
            <div className="introPerfil">
                <h1 style={{ fontWeight: "600", margin: "15px 0px 40px 0px"}}>Ajustes</h1>
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
                    itemSettingsName={"Preguntas frecuentes"}
                    onClick={() => window.open('https://albertarus.notion.site/GroceryApp-FAQs-1205242bbfc780cdb236cb22d76654aa?pvs=4', '_blank')}
                    
                />
                <ItemSettings 
                    iconName={"support_agent"}
                    itemSettingsName={"Reportar incidencia"}
                    onClick={() => window.open('https://tally.so/r/mVMW6g', '_blank')}
                />
                <ItemSettings 
                    iconName={"campaign"}
                    itemSettingsName={"Enviar sugerencias"}
                    onClick={() => window.open('https://tally.so/r/3xP8Ko', '_blank')}
                />
                <hr />
                <h4>Legal</h4>                
                <ItemSettings 
                    iconName={"description"}
                    itemSettingsName={"Términos del servicio"}
                    onClick={() => window.open('https://albertarus.notion.site/T-rminos-y-condiciones-1205242bbfc7801daea9ffccbeab78f9?pvs=4', '_blank')}
                />
                <ItemSettings 
                    iconName={"lock"}
                    itemSettingsName={"Política de privacidad"}
                    onClick={() => window.open('https://albertarus.notion.site/Pol-tica-de-privacidad-1205242bbfc780498f42edf2652afae8?pvs=4', '_blank')}
                />                                                             
            </div>
        </div>
    </div>
  );
};

export default Settings;
