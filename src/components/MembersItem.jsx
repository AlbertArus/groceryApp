import { forwardRef, useEffect, useState } from "react"
import ItemMenuItem from "./ItemMenuItem";

const MembersItem = forwardRef(({item, UsuarioCompleto, handleDeleteItemUserMember}, ref) => {
    const [nombreItemUserMember, setNombreItemUserMember] = useState([]);

    useEffect(() => {
        const fetchItemUserMembers = async () => {
            const names = await Promise.all( // Uso promesa para hacerlo paralelo por cada uid y solo sigue cuando acaban todas
                item.itemUserMember.map(uid => UsuarioCompleto(uid))
            );
            setNombreItemUserMember(names)
        };

        if (item.itemUserMember.length > 0) {
            fetchItemUserMembers()
        }
    }, [item.itemUserMember, UsuarioCompleto]);

    return (
        <div className="optionsMenu" style={{ left: "0", width: "150px" }} ref={ref}>
            {item.itemUserMember.map((uid, index) =>
                <ItemMenuItem
                    key={uid}
                    iconName={"account_circle"}
                    itemMenuName={nombreItemUserMember[index]} // Uso index para validar que el nombre corresponde al uid vía posición en el array
                    handleDeleteItemUserMember={() => handleDeleteItemUserMember(item.id, uid)}
                />
            )}
        </div>
    )
})

export default MembersItem