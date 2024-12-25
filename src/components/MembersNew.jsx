
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
            <label>Añadir miembros</label>
            {membersToAdd.map((member, index) =>
                <input type="text" className="FormLista" placeholder="Juan Alameda" style={{marginBottom: "5px", backgroundColor: "transparent", borderBottom: "1px solid grey", borderRadius: "0px"}} key={index} value={member} onChange={(e) => handleOnChange(e, index)} onKeyDown={handleSubmit}/>
            )}
        </form>
    )
}

export default NewMembers
