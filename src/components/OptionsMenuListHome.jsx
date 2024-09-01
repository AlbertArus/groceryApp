import ItemMenu from "./ItemMenu"

const OptionsMenu = ({ votesShown, handleVotesVisible }) => { 

  return (
    <div className="optionsMenu">
      <ItemMenu 
        iconName={"content_copy"}
        itemMenuName={"Duplicar lista"}
        onClick={handleVotesVisible}
      />
      <ItemMenu 
        iconName={"archive"}
        itemMenuName={"Archivar lista"}
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