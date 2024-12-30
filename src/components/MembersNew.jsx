import { useRef } from "react";

const NewMembers = ({ membersToAdd, setMembersToAdd }) => {
    const inputRefs = useRef([]);

    const handleOnChange = (e, index) => {
        const name = e.target.value
        const membersToAddTemp = [...membersToAdd]
        membersToAddTemp[index] = name
        setMembersToAdd(membersToAddTemp)
    }
    
    const handleSubmit = (e) => {
        if(e.key=== "Enter") {
            e.preventDefault()
            const membersToAddTemp = [...membersToAdd]
            membersToAddTemp.push("")
            setMembersToAdd(membersToAddTemp)

            setTimeout(() => {
                const lastIndex = membersToAddTemp.length - 1
                inputRefs.current[lastIndex]?.focus()
            }, 100)
        }
    }

    const handleDelete = (e, index) => {
        const membersToAddTemp = [...membersToAdd]
        if(membersToAdd.length > 1) {
            membersToAddTemp.splice(index, 1)
            setMembersToAdd(membersToAddTemp)
        } else {
            membersToAddTemp[index] = ""
            setMembersToAdd(membersToAddTemp)
        }
    }
    
    return (
        <form>
            <label>Añade a los miembros del plan</label>
            {membersToAdd.map((member, index) =>
                <div className="iconed-container-underlineInput fila-between" style={{marginBottom: "5px"}}>
                    <input type="text" className="FormLista" placeholder="Juan Alameda" key={index} value={member} ref={(input) => (inputRefs.current[index] = input)} onChange={(e) => handleOnChange(e, index)} onKeyDown={handleSubmit}/>
                    <span className="material-symbols-outlined icon-medium iconSuperpuesto" onClick={(e) => handleDelete (e, index)}>close</span>
                </div>
            )}
        </form>
    )
}

export default NewMembers
