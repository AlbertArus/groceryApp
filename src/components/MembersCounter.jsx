import { forwardRef } from "react"
import { useUsuario } from "../UsuarioContext"
import ItemMenu from "./ItemMenu"

const MembersCounter = forwardRef(({item, style}, ref) => {
    const { usuario } = useUsuario();

    return (
        <div className="optionsMenu" style={style} ref={ref}>
            {item.counterUp.map(uid => 
                <ItemMenu
                    key={uid}
                    iconName={"account_circle"}
                    itemMenuName={`${usuario.nombre} ${usuario.apellido}`}
                />
            )}
            {item.counterDown.map(uid => 
                <ItemMenu
                    key={uid}
                    iconName={"account_circle"}
                    itemMenuName={`${usuario.nombre} ${usuario.apellido}`}
                />
            )}
        </div>
    )
})

export default MembersCounter