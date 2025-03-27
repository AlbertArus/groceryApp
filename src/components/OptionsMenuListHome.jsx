import { forwardRef } from "react"
import ItemMenu from "./ItemMenu"
import { ShareButton } from "./ShareButton"

const OptionsMenuListHome = forwardRef(({handleDuplicate, handleArchive, deleteLista, lista, style, usuario}, ref) => {
  const url= `${window.location.origin}/list/${lista.id}`
  const listaShared= lista
  const handleShare = ShareButton(url, listaShared)

  return (
    <div className="optionsMenu" ref={ref} style={style}>
        {!lista?.userConfig[usuario.uid]?.isArchived && (
            <>
                <ItemMenu
                iconName={"share"}
                itemMenuName={"Compartir lista"}
                onClick={handleShare}
                />
                <ItemMenu 
                iconName={"content_copy"}
                itemMenuName={"Duplicar lista"}
                onClick={handleDuplicate}
                />
            </>
        )}
      <ItemMenu 
        iconName={lista?.userConfig[usuario.uid]?.isArchived ? "unarchive" : "archive"}
        itemMenuName={lista?.userConfig[usuario.uid]?.isArchived ? "Desarchivar lista" : "Archivar lista"}
        onClick={() => handleArchive(lista)}
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