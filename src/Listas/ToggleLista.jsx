import React, { useEffect, useState } from 'react'

const ToggleLista = ({listas, setFilteredListas, usuario}) => {
    const [isToggleActive, setIsToggleActive] = useState("todas")

    const handleClick = (toggle) => {
        setIsToggleActive(toggle);
    };
    
    useEffect(() => {
        let filteredListas;
        if (isToggleActive === "mislistas") {
            filteredListas = listas.filter(lista => lista.userCreator === usuario.uid)
        } else if (isToggleActive === "compartidas") {
            filteredListas = listas.filter(lista => lista.userCreator !== usuario.uid && lista.userMember.includes(usuario.uid))
        } else {
            filteredListas = listas
        }
        setFilteredListas(filteredListas)
    }, [isToggleActive, listas, usuario.uid, setFilteredListas])

    return (
        <div className='app-margin center'>
            <div className='ToggleLista fila-between' style={{flex:"none"}}>
                <h5 onClick={() => handleClick("todas")} className={isToggleActive === "todas" ? 'toggleActive' : "toggle"}>Todas</h5>
                {/* <div className="verticalLine"></div> */}
                <h5 onClick={() => handleClick("mislistas")} className={isToggleActive === "mislistas" ? 'toggleActive' : "toggle"}>Mis listas</h5>
                {/* <div className="verticalLine"></div> */}
                <h5 onClick={() => handleClick("compartidas")} className={isToggleActive === "compartidas" ? 'toggleActive' : "toggle"}>Compartidas</h5>
            </div>
        </div>
    )
}

export default ToggleLista
