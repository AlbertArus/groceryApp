import { forwardRef } from "react"
import ItemMenu from "./ItemMenu"

const OptionsMenu = forwardRef(({ votesShown, handleVotesVisible, deleteLista, handleArchive, handleDuplicate }, ref) => {

  return (
    <div className="optionsMenu" ref={ref}>
      <ItemMenu
        iconName={`${votesShown ? "visibility_off" : "visibility"}`}
        itemMenuName={`${votesShown ? "Ocultar votaciones" : "Mostrar votaciones"}`}
        onClick={handleVotesVisible}
      />
      <ItemMenu
        iconName={"search"}
        itemMenuName={"Buscar en lista"}
        onClick={handleVotesVisible}
      />
      <ItemMenu
        iconName={"check_box"}
        itemMenuName={"Completar todo"}
        onClick={handleDuplicate}
      />
      <ItemMenu
        iconName={"check_box_outline_blank"}
        itemMenuName={"Desmarcar todo"}
        onClick={handleVotesVisible}
      />
      <ItemMenu
        iconName={"archive"}
        itemMenuName={"Archivar lista"}
        onClick={handleArchive}
      />
      <ItemMenu
        iconName={"delete"}
        itemMenuName={"Eliminar lista"}
        onClick={deleteLista}
      />
    </div>
  )
})

export default OptionsMenu