import { useNavigate } from "react-router-dom"

const ButtonFAB = ({path, icon, label}) => {
    const navigate = useNavigate()

    return (
        <div className="ButtonFAB" onClick={() => navigate(`/${path}`)}>
            <button className="fila-start button_emptyState buttonMain" style={{ margin: "0", padding: "10px", boxShadow: "0px 0px 5px rgba(0,0,0,0.3)"}}>
                <h4>{label}</h4>
                <span className="material-symbols-outlined" style={{borderRadiusHover: "none"}} >{icon}</span>
            </button>
        </div>
    )
}

export default ButtonFAB
