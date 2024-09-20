import { forwardRef } from "react"
import ItemMenu from "./ItemMenu"

const OptionsMenuListHome = forwardRef((props, ref) => { 

  return (
    <div className="optionsMenu" ref={ref}>
      <ItemMenu 
        iconName={"content_copy"}
        itemMenuName={"Duplicar lista"}
        // onClick={handleVotesVisible}
      />
      <ItemMenu 
        iconName={"archive"}
        itemMenuName={"Archivar lista"}
        // onClick={handleVotesVisible}
      />
      <ItemMenu 
        iconName={"delete"}
        itemMenuName={"Eliminar lista"}
        // onClick={handleVotesVisible}
      />
    </div>
  )
})

export default OptionsMenuListHome