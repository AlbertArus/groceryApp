import { useNavigate } from "react-router-dom"
const NewLista = ({ style }) => {

    const navigate = useNavigate()

    return (
        <>
            <div className="NewLista" style={style}>
                <button className="fila-start" style={{background:"none", border: "none", padding: "0"}}>
                    <span className="material-symbols-outlined addingLista" style={{borderRadiusHover: "none"}} onClick={() => navigate("/newlist/")}>add</span>
                </button>
            </div>
        </>
    )
}

export default NewLista