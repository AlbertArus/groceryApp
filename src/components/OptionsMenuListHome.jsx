import { forwardRef } from "react"
import ItemMenu from "./ItemMenu"
import { ShareButton } from "./ShareButton"

const OptionsMenuListHome = forwardRef(({handleDuplicate, handleArchive, deleteLista, lista, style}, ref) => {
  const url= `${window.location.origin}/list/${lista.id}`
  const listaShared= lista
  const handleShare = ShareButton(url, listaShared)

  return (
    <div className="optionsMenu" ref={ref} style={style}>
      <ItemMenu
        style={{display: lista.isArchived ? "none" : "flex"}}
        iconName={"share"}
        itemMenuName={"Compartir lista"}
        onClick={handleShare}
      />
      <ItemMenu 
        style={{display: lista.isArchived ? "none" : "flex"}}
        iconName={"content_copy"}
        itemMenuName={"Duplicar lista"}
        onClick={handleDuplicate}
      />
      <ItemMenu 
        iconName={lista.isArchived ? "unarchive" : "archive"}
        itemMenuName={lista.isArchived ? "Desarchivar lista" : "Archivar lista"}
        onClick={handleArchive}
      />
      <ItemMenu 
        iconName={"delete"}
        itemMenuName={"Eliminar lista"}
        onClick={() => deleteLista(lista.id)}
      />
    </div>
  )
})

export default OptionsMenuListHome