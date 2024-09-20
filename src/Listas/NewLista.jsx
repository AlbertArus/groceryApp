import { useState } from "react"
import FormLista from "../components/FormLista"
// import { Route, Routes, useNavigate } from "react-router-dom"
const NewLista = ({ addLista }) => {

    const [isFormVisible, setIsFormVisible] = useState(false)
    // const navigate = useNavigate()

    const showForm = () => {
        setIsFormVisible(true)
        // navigate("/newlist")
    }

    return (
        <>
            <div className="NewLista">
                <button style={{background:"none", border: "none", padding: "0"}}>
                    <span className="material-symbols-outlined addingLista" style={{borderRadiusHover: "none"}} onClick={showForm}>add</span>
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