const TabItemMenu = ({ iconName, itemMenuName, onClick, style, handleDeleteItemUserMember }) => {

    return (
        <div className="tabItemMenu fila-start pointer" onClick={onClick} style={style}>
            <div className="fila-between">
                <div className="fila-start">
                    <span className="material-symbols-outlined icon-large" style={{ marginRight: "15px" }}>
                        {iconName}
                    </span>
                    <h4>{itemMenuName}</h4>
                </div>
                {handleDeleteItemUserMember &&
                    <span className="material-symbols-outlined icon-medium" onClick={handleDeleteItemUserMember}>
                        close
                    </span>
                }
            </div>
        </div>
    )
}

export default TabItemMenu
