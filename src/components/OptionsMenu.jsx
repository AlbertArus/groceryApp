import { forwardRef } from "react"
import ItemMenu from "./ItemMenu"

const OptionsMenu = forwardRef(({ handleVotesVisible, deleteLista, handleArchive, itemslength, lista, handleCheckAll, handleUnCheckAll, handleOcultarPrecios, style }, ref) => {

  return (
    <div className="optionsMenu" ref={ref} style={style}>
      <ItemMenu
        iconName={`${lista.showVotes ? "visibility_off" : "visibility"}`}
        itemMenuName={`${lista.showVotes ? "Ocultar votaciones" : "Mostrar votaciones"}`}
        onClick={() => handleVotesVisible(lista.id, lista.showVotes)}
        style={{display: itemslength < 2 ? "none" : "flex"}}
        />
      <ItemMenu
        iconName={"euro_symbol"}
        itemMenuName={`${lista.showPrices ? "Ocultar precios" : "Mostrar precios"}`}
        onClick={() => handleOcultarPrecios(lista.id, lista.showPrices)}
        />
      <ItemMenu
        iconName={"check_box"}
        itemMenuName={"Completar todo"}
        onClick={handleCheckAll}
        style={{display: itemslength < 2 ? "none" : "flex"}}
        />
      <ItemMenu
        iconName={"check_box_outline_blank"}
        itemMenuName={"Desmarcar todo"}
        onClick={handleUnCheckAll}
        style={{display: itemslength < 2 ? "none" : "flex"}}
        />
      <ItemMenu
        iconName={lista.isArchived ? "unarchive" : "archive"}
        itemMenuName={`${lista.isArchived === true ? "Desarchivar lista" : "Archivar lista"}`}
        onClick={() => handleArchive(lista.id, lista.isArchived)}
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