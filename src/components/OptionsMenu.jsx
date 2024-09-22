import { forwardRef } from "react"
import ItemMenu from "./ItemMenu"

const OptionsMenu = forwardRef(({ votesShown, handleVotesVisible, deleteLista, handleArchive, handleDuplicate, itemslength }, ref) => {
  console.log(itemslength)

  return (
    <div className="optionsMenu" ref={ref}>
      <ItemMenu
        iconName={`${votesShown ? "visibility_off" : "visibility"}`}
        itemMenuName={`${votesShown ? "Ocultar votaciones" : "Mostrar votaciones"}`}
        onClick={handleVotesVisible}
        style={{display: itemslength < 2 ? "none" : "flex"}}
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
        style={{display: itemslength < 2 ? "none" : "flex"}}
        />
      <ItemMenu
        iconName={"check_box_outline_blank"}
        itemMenuName={"Desmarcar todo"}
        onClick={handleVotesVisible}
        style={{display: itemslength < 2 ? "none" : "flex"}}
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