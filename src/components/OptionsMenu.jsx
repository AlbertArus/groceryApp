import { forwardRef } from "react"
import ItemMenu from "./ItemMenu"

const OptionsMenu = forwardRef(({ votesShown, handleVotesVisible, deleteLista, handleArchive, itemslength, lista, handleCheckAll, handleUnCheckAll, preciosOcultos, handleOcultarPrecios, style }, ref) => {

  return (
    <div className="optionsMenu" ref={ref} style={style}>
      <ItemMenu
        iconName={`${votesShown ? "visibility_off" : "visibility"}`}
        itemMenuName={`${votesShown ? "Ocultar votaciones" : "Mostrar votaciones"}`}
        onClick={handleVotesVisible}
        style={{display: itemslength < 2 ? "none" : "flex"}}
        />
      <ItemMenu
        iconName={"euro_symbol"}
        itemMenuName={`${preciosOcultos ? "Mostrar precios" : "Ocultar precios"}`}
        onClick={handleOcultarPrecios}
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