import OptionsMenu from "../components/OptionsMenu"

const NavBar = () => {

    return (
        <div className="NavBar header">
            <span class="material-symbols-outlined">settings</span>
            <span class="material-symbols-outlined">notifications</span>
            <span class="material-symbols-outlined">search</span>
            <span class="material-symbols-outlined">more_vert</span>
            <OptionsMenu 
                iconName={"campaign"}
                itemMenuName={"Enviar sugerencias"}
                // onClick={handleVotesVisible}
            />
            <OptionsMenu
                iconName={"manage_accounts"}
                itemMenuName={"Mi perfil"}
                // onClick={handleVotesVisible}
            />
        </div>
    )
}

export default NavBar