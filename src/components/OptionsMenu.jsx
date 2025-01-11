import { forwardRef } from "react"
import ItemMenu from "./ItemMenu"
import { useNavigate } from "react-router-dom"
import { useUsuario } from '../UsuarioContext';

const OptionsMenu = forwardRef(({ deleteLista, itemslength, lista, handleArchive, handleShowVotes, handleShowPrices, handleCheckAll, handleUnCheckAll, updateLista, style }, ref) => {
  const navigate = useNavigate()
  const { usuario } = useUsuario();

  return (
    <div className="optionsMenu" ref={ref} style={style}>
      <ItemMenu
        iconName={`${lista.userConfig?.[usuario.uid]?.showVotes ? "visibility_off" : "visibility"}`}
        itemMenuName={`${lista.userConfig?.[usuario.uid]?.showVotes ? "Ocultar votaciones" : "Mostrar votaciones"}`}
        onClick={() => handleShowVotes(lista)}
        style={{display: itemslength < 2 ? "none" : "flex"}}
        />
      <ItemMenu
        iconName={"euro_symbol"}
        itemMenuName={`${lista.userConfig?.[usuario.uid]?.showPrices ? "Ocultar precios" : "Mostrar precios"}`}
        onClick={() => handleShowPrices(lista)}
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
        iconName={"edit"}
        itemMenuName={"Editar lista"}
        onClick={() => navigate(`/newlist?lista=${lista.id}`)}
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