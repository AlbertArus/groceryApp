import { useEffect, useRef, useState } from "react";
import DeleteUserFromList from "../functions/DeleteUserFromList"

const NewMembers = ({ membersToAdd, setMembersToAdd, currentMembers, lista, setListas, updateLista, UsuarioCompleto }) => {
    const inputRefs = useRef([]);
    const [nombreUserMember, setNombreUserMember] = useState([]);

    useEffect(() => {
        if (currentMembers) {
            const listaUserMembers = async () => {
                const userMembersName = await Promise.all(
                    currentMembers.map(uid => UsuarioCompleto(uid))
                );
                setNombreUserMember(userMembersName);
            };
            listaUserMembers();
        }
    }, [UsuarioCompleto, currentMembers]);

    useEffect(() => {
        if (inputRefs.current.length > 0) {
            const lastIndex = inputRefs.current.length - 1;
            if (inputRefs.current[lastIndex]) {
                // Scroll the element into view with smooth behavior
                inputRefs.current[lastIndex].scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center' // This centers the element in the viewport
                });
            }
        }
    }, [membersToAdd.length]);

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

    const handleDelete = async (e, index, member) => {
        if(member && currentMembers.length > 1) {
            await DeleteUserFromList({member, lista, updateLista, setListas})
        } else {
            const membersToAddTemp = [...membersToAdd]
            if(membersToAdd.length > 1) {
                membersToAddTemp.splice(index, 1)
                setMembersToAdd(membersToAddTemp)
            } else {
                membersToAddTemp[index] = ""
                setMembersToAdd(membersToAddTemp)
            }
        }
    }
    
    return (
        <form className="form">
            <label>Añade a los miembros del plan</label>
                {currentMembers.length > 0 && currentMembers.map((member, index) =>
                    <div key={index} className="iconed-container-underlineInput fila-between" style={{marginBottom: "5px"}}>
                        <input type="text" placeholder="Juan Alameda" value={nombreUserMember[index]} ref={(input) => (inputRefs.current[index] = input)} onChange={(e) => handleOnChange(e, index)} onKeyDown={handleSubmit}/>
                        <span className="material-symbols-outlined icon-medium iconSuperpuesto" onClick={(e) => handleDelete (e, index, member)}>close</span>
                    </div>
                )}
                {membersToAdd.map((member, index) =>
                    <div key={index} className="iconed-container-underlineInput fila-between" style={{marginBottom: "5px"}}>
                        <input type="text" placeholder="Juan Alameda" value={member} ref={(input) => (inputRefs.current[index] = input)} onChange={(e) => handleOnChange(e, index)} onKeyDown={handleSubmit}/>
                        <span className="material-symbols-outlined icon-medium iconSuperpuesto" onClick={(e) => handleDelete (e, index)}>close</span>
                    </div>
                )}
        </form>
    )
}

export default NewMembers
