import { forwardRef } from "react"
import ItemMenu from "./ItemMenu"

const OptionsMenuListHome = forwardRef(({handleDuplicate, handleArchive, deleteLista}, ref) => { 

  return (
    <div className="optionsMenu" ref={ref}>
      <ItemMenu 
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