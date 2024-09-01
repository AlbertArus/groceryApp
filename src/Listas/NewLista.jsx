import { useState, useRef, useEffect } from "react"
import FormLista from "../components/FormLista"
const NewLista = ({addLista}) => {

    const [isFormVisible, setIsFormVisible] = useState (false)
    const FormListaRef = useRef(null)

    const showForm = () => {
        setIsFormVisible(true)
    }

    return (
        <>
            <div className="NewLista">
                <button className="addingLista">
                    <span className="material-symbols-outlined addIcon" onClick={showForm}>add</span>
                </button>
            </div>
            {isFormVisible && (
                <FormLista
                    ref={FormListaRef}
                    addLista={addLista}
                    isFormVisible={isFormVisible}
                    setIsFormVisible={setIsFormVisible}
                />
            )}
        </>
    )
}

export default NewLista