import { useNavigate } from "react-router-dom"
const NewLista = () => {

    const navigate = useNavigate()

    return (
        <>
            <div className="NewLista">
                <button className="fila-start" style={{background:"none", border: "none", padding: "0"}}>
                    <span className="material-symbols-outlined addingLista pointer" style={{borderRadiusHover: "none"}} onClick={() => navigate("/newlist/")}>add</span>
                </button>
            </div>
        </>
    )
}

export default NewLista