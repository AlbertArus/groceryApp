import ItemMenu from "./ItemMenu"

const OptionsMenuHome = () => { 

  return (
    <div className="optionsMenu">
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
}

export default OptionsMenuHome