import { forwardRef, useEffect, useState } from "react"
import ItemMenu from "./ItemMenu"

const MembersCounter = forwardRef(({item, style, UsuarioCompleto}, ref) => {
    const [nombreCounterUp, setNombreCounterUp] = useState([]);
    const [nombreCounterDown, setNombreCounterDown] = useState([]);


    useEffect(() => {
        const fetchItemCounterUp = async () => {
            const names = await Promise.all( // Uso promesa para hacerlo paralelo por cada uid y solo sigue cuando acaban todas
                item.counterUp.map(uid => UsuarioCompleto(uid))
            );
            setNombreCounterUp(names)
        };

        if (item.counterUp.length > 0) {
            fetchItemCounterUp()
        }
    }, [item.counterUp, UsuarioCompleto]);

    useEffect(() => {
        const fetchItemCounterDown = async () => {
            const names = await Promise.all( // Uso promesa para hacerlo paralelo por cada uid y solo sigue cuando acaban todas
                item.counterDown.map(uid => UsuarioCompleto(uid))
            );
            setNombreCounterDown(names)
        };

        if (item.counterDown.length > 0) {
            fetchItemCounterDown()
        }
    }, [item.counterDown, UsuarioCompleto]);


    return (
        <div className="optionsMenu" style={style} ref={ref}>
            {item.counterUp.map((uid, index) => (
              <ItemMenu
                key={uid}
                iconName="account_circle"
                itemMenuName={nombreCounterUp[index]}
              />
            ))}
            {item.counterDown.map((uid, index) => (
              <ItemMenu
                key={uid}
                iconName="account_circle"
                itemMenuName={nombreCounterDown[index]}
              />
            ))}
        </div>
    )
})

export default MembersCounter