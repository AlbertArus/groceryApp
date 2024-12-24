
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
            <div>Añadir miembros</div>
            {membersToAdd.map((member, index) =>
                <input type="text" key={index} value={member} onChange={(e) => handleOnChange(e, index)} onKeyDown={handleSubmit}/>
            )}
        </form>
    )
}

export default NewMembers
