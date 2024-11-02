import { forwardRef } from "react"
import ItemMenu from "./ItemMenu"
import { ShareButton } from "./ShareButton"

const OptionsMenuListHome = forwardRef(({handleDuplicate, handleArchive, deleteLista, listaArchivada, lista}, ref) => {
  const url= listaArchivada ? `${window.location.origin}/list/${listaArchivada.id}` : `${window.location.origin}/list/${lista.id}` //Ponemos listaArchivada porque si no desde /archived no funciona el OptionsMenu porque no reconoce el /list/id al estar en /archived"
  const listaShared= listaArchivada ? listaArchivada : lista
  const handleShare = ShareButton(url, listaShared)

  return (
    <div className="optionsMenu" ref={ref}>
      <ItemMenu
        style={{display: listaArchivada ? "none" : "flex"}}
        iconName={"share"}
        itemMenuName={"Compartir lista"}
        onClick={handleShare}
      />
      <ItemMenu 
        style={{display: listaArchivada ? "none" : "flex"}}
        iconName={"content_copy"}
        itemMenuName={"Duplicar lista"}
        onClick={handleDuplicate}
      />
      <ItemMenu 
        iconName={listaArchivada ? "unarchive" : "archive"}
        itemMenuName={listaArchivada ? "Desarchivar lista" : "Archivar lista"}
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