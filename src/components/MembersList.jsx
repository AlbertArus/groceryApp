import { forwardRef, useEffect, useState } from "react"
import ItemMenu from "./ItemMenu"
const MembersList = forwardRef(({lista, UsuarioCompleto}, ref) => {
    const [nombreUserMember, setNombreUserMember] = useState([]);

    useEffect(() => {
        const listaUserMembers = async () => {
            const userMembersName = await Promise.all(
            lista.userMember.map(uid => UsuarioCompleto(uid))
            );
            setNombreUserMember(userMembersName)
        }
        listaUserMembers()
    }, [UsuarioCompleto, lista])
   
    return (
        <div className="optionsMenu" style={{left: "0", width: "150px"}} ref={ref}>
            {lista.userMember.map((uid, index) => 
                <ItemMenu
                    key={uid}
                    iconName={"account_circle"}
                    itemMenuName={nombreUserMember[index]}
                />
            )}
        </div>
    )
})

export default MembersList