const TabItemMenu = ({ iconName, itemMenuName, onClick, style, handleDeleteItemUserMember, priceMember, img }) => {

    return (
        <div className="tabItemMenu fila-start pointer" onClick={onClick} style={style}>
            <div className="fila-between">
                <div className="fila-start">
                    <span className="material-symbols-outlined icon-large" style={{ marginRight: "15px" }}>
                        {iconName}
                    </span>
                    {img && (
                        <img src={img} alt="Hola" style={{width: "40px", marginRight: "15px"}}/>
                    )}
                    <h4>{itemMenuName}</h4>
                </div>
                {handleDeleteItemUserMember &&
                    <span className="material-symbols-outlined icon-medium" onClick={handleDeleteItemUserMember}>
                        close
                    </span>
                }
                {priceMember && 
                    <h4>{priceMember}</h4>
                }
            </div>
        </div>
    )
}

export default TabItemMenu
