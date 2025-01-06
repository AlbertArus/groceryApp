import { forwardRef } from "react"
import ItemMenu from "./ItemMenu"
import { useNavigate } from "react-router-dom"

const OptionsMenu = forwardRef(({ deleteLista, itemslength, lista, handleArchive, handleCheckAll, handleUnCheckAll, updateLista, style, usuario }, ref) => {
  const navigate = useNavigate()

  return (
    <div className="optionsMenu" ref={ref} style={style}>
      <ItemMenu
        iconName={`${lista.showVotes ? "visibility_off" : "visibility"}`}
        itemMenuName={`${lista.showVotes ? "Ocultar votaciones" : "Mostrar votaciones"}`}
        onClick={() => updateLista(lista.id, "showVotes", !lista.showVotes)}
        style={{display: itemslength < 2 ? "none" : "flex"}}
        />
      <ItemMenu
        iconName={"euro_symbol"}
        itemMenuName={`${lista.showPrices ? "Ocultar precios" : "Mostrar precios"}`}
        onClick={() => updateLista(lista.id, "showPrices", !lista.showPrices)}
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
        iconName={lista.userConfig[usuario.uid].isArchived ? "unarchive" : "archive"}
        itemMenuName={lista.userConfig[usuario.uid].isArchived ? "Desarchivar lista" : "Archivar lista"}
        onClick={() => {handleArchive(lista);  navigate("/")}}
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