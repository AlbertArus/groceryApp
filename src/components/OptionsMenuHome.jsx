import ItemMenu from "./ItemMenu"
import { forwardRef } from "react"

const OptionsMenuHome = forwardRef((props, ref) => { 

  return (
    <div className="optionsMenu" ref={ref}>
        <ItemMenu
            iconName={"settings"}
            itemMenuName={"Configuración"}
            // onClick={handleVotesVisible}
        />
        <ItemMenu 
            iconName={"campaign"}
            itemMenuName={"Enviar sugerencias"}
            // onClick={handleVotesVisible}
        />
        <ItemMenu
            iconName={"manage_accounts"}
            itemMenuName={"Mi perfil"}
            // onClick={handleVotesVisible}
        />
    </div>
  )
})

export default OptionsMenuHome