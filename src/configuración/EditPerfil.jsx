import {useNavigate } from "react-router-dom";
import Head from "../components/Head.jsx";
import ItemProfile from "../components/ItemProfile.jsx";

const EditPerfil = ({usuario}) => {
  const navigate = useNavigate();

  return (
    <div className="app">
        <Head
            path={"profile"}            
            sectionName={"Editar perfil"}
        />
        <div className="app-margin">

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
    </div>
  )
}

export default EditPerfil