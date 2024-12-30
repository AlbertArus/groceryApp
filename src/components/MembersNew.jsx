
const NewMembers = ({ membersToAdd, setMembersToAdd }) => {

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
        }
    }
    
    return (
        <form>
            <label>Añade a los miembros del plan</label>
            {membersToAdd.map((member, index) =>
                <div className="iconed-container-underlineInput fila-between" style={{marginBottom: "5px"}}>
                    <input type="text" className="FormLista" placeholder="Juan Alameda" key={index} value={member} onChange={(e) => handleOnChange(e, index)} onKeyDown={handleSubmit}/>
                    <span className="material-symbols-outlined icon-medium iconSuperpuesto">close</span>
                </div>
            )}
        </form>
    )
}

export default NewMembers
