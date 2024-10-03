import { useState } from "react"
import FormLista from "../components/FormLista"
// import { useNavigate } from "react-router-dom"
const NewLista = ({ addLista, textNewLista, style }) => {

    const [isFormVisible, setIsFormVisible] = useState(false)
    // const navigate = useNavigate()

    const showForm = () => {
        setIsFormVisible(true)
        // navigate("/newlist")
    }

    return (
        <>
            <div className="NewLista" style={style}>
                <button className="fila-start" style={{background:"none", border: "none", padding: "0"}}>
                    <span className="material-symbols-outlined addingLista" style={{borderRadiusHover: "none"}} onClick={showForm}>add</span>
                    <div className="textNewLista" style={{marginLeft:"6px"}}>{textNewLista}</div>
                </button>
            </div>
            {isFormVisible && (
                <FormLista
                    addLista={addLista}
                    setIsFormVisible={setIsFormVisible}
                />
            )}
        </>
    )
}

export default NewLista