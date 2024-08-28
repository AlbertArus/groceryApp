import ItemMenu from "./ItemMenu"

const OptionsMenu = ({ votesShown, handleVotesVisible }) => {
  return (
    <div className="optionsMenu">
      <ItemMenu 
        iconName={`${votesShown ? "visibility_off" : "visibility"}`}
        itemMenuName={`${votesShown ? "Ocultar votaciones" : "Mostrar votaciones" }`}
        onClick={handleVotesVisible}
      />
      <ItemMenu 
        iconName={"check_box"}
        itemMenuName={"Completar todo"}
        onClick={handleVotesVisible}
      />
      <ItemMenu 
        iconName={"check_box_outline_blank"}
        itemMenuName={"Desmarcar todo"}
        onClick={handleVotesVisible}
      />
      <ItemMenu 
        iconName={"delete"}
        itemMenuName={"Eliminar lista"}
        onClick={handleVotesVisible}
      />
    </div>
  )
}

export default OptionsMenu