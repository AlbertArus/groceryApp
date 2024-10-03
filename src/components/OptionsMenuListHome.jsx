import { forwardRef } from "react"
import ItemMenu from "./ItemMenu"
import { ShareButton } from "./ShareButton"

const OptionsMenuListHome = forwardRef(({handleDuplicate, handleArchive, deleteLista, listaArchivada}, ref) => { 
  const handleShare = ShareButton();

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

export default OptionsMenuListHome