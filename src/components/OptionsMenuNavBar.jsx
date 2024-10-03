import ItemMenu from "./ItemMenu"
import { forwardRef } from "react"
import { useNavigate } from "react-router-dom"

const OptionsMenuNavBar = forwardRef((props, ref) => { 
  const navigate = useNavigate()

  return (
    <div className="optionsMenu" ref={ref}>
        <ItemMenu
            iconName={"settings"}
            itemMenuName={"Configuración"}
            onClick={() => navigate("/settings")}
        />
        <ItemMenu 
            iconName={"campaign"}
            itemMenuName={"Enviar sugerencias"}
            // onClick={handleVotesVisible}
        />
        <ItemMenu
            iconName={"manage_accounts"}
            itemMenuName={"Mi perfil"}
            onClick={() => navigate("/profile")}
        />
    </div>
  )
})

export default OptionsMenuNavBar