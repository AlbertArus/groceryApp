import { forwardRef, useEffect, useState } from "react"
import ItemMenu from "./ItemMenu"

const MembersItem = forwardRef(({item, UsuarioCompleto}, ref) => {
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
                <ItemMenu
                    key={uid}
                    iconName={"account_circle"}
                    itemMenuName={nombreItemUserMember[index]} // Uso index para validar que el nombre corresponde al uid vía posición en el array
                />
            )}
        </div>
    )
})

export default MembersItem