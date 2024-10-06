import { forwardRef } from "react"
import ItemMenu from "./ItemMenu"
const MembersList = forwardRef(({lista, usuario}, ref) => {
   
    return (
        <div className="optionsMenu" style={{left: "0", width: "150px"}} ref={ref}>
            {lista.userMember.map((member) => 
                <ItemMenu
                    key={member.uid}
                    iconName={"account_circle"}
                    itemMenuName={`${member.nombre} ${member.apellido}`}
                />
            )}
        </div>
    )
})

export default MembersList