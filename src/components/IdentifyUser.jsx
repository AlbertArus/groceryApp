import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../firebase-config"

const IdentifyUser = ({ listas, setListas, updateLista, usuario, UsuarioCompleto, showIdentifyList, setShowIdentifyList }) => {
    const { id } = useParams()
    const lista = listas.find(lista => lista.id === id)
    const [nombreUserMember, setNombreUserMember] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);

    useEffect(() => {
        const filterMembers = async () => {
          try {
            const results = await Promise.all(
              lista.userMember.map(async (member) => {
                const docSnap = await getDoc(doc(db, "usuarios", member));
                const userData = docSnap.exists() ? docSnap.data() : null;
    
                return userData.email ? null : member; // Solo retorna miembro si no tiene campo email
              })
            );
    
            setFilteredMembers(results.filter(Boolean)); // Filtrar los valores válidos (no nulos)
          } catch (error) {
          }
        };
    
        filterMembers();
      }, [lista.userMember]);
    
    useEffect(() => {
        if (filteredMembers) {
            const listaUserMembers = async () => {
                const userMembersName = await Promise.all(
                    filteredMembers.map(uid => UsuarioCompleto(uid))
                );
                setNombreUserMember(userMembersName);
            };
            listaUserMembers();
        }
    }, [UsuarioCompleto, filteredMembers]);

    const updateMembers = (uid) => {
        if(uid === usuario.uid) {
            addNewMember() // No envío uid (aunque podría) porque usuario.uid no se recibe de la función sino del prop, así que no me hace falta recibir lo que envía el onClick
        } else {
            replaceMember(uid)
        }
        setShowIdentifyList(false)
    }

    const replaceMember = async (uid) => {
        if(!uid) {
            console.error("no hay usuarios");
            return;
        }

        // Member en userMember
        const userMemberIndex = lista.userMember.findIndex(member => member === uid)
        const updateUserMember = [...lista.userMember]
        updateUserMember[userMemberIndex] = usuario.uid

        // Member en item
        const updatedCategories = lista.categories.map(category => {
            const updatedItems = category.items.map(item => {
                const itemUserMemberIndex = item.itemUserMember.findIndex(member => member === uid);
                
                if (itemUserMemberIndex !== -1) {
                    const updateItemUserMember = [...item.itemUserMember];
                    updateItemUserMember[itemUserMemberIndex] = usuario.uid;
                    return { ...item, itemUserMember: updateItemUserMember };
                }
                return item;
            });

        return { ...category, items: updatedItems };
        });
                
        // Member en payments
        const updatePayments = lista.payments.map(payment => {
            // Payer pagos
            const updatePaymentPayer = payment.payer === uid ? 
                usuario.uid : payment.payer
            
            // Members en pagos
            const updatePaymentMembers = payment.members.map(member => {
                if(member.uid === uid) {
                    return {...member, uid: usuario.uid}
                }
                return member
            })
            return { ...payment, payer: updatePaymentPayer, members: updatePaymentMembers}
        })
        setListas(prevListas => prevListas.map(lista => 
            lista.id === id 
            ? { ...lista, userMember: updateUserMember, categories: updatedCategories, payments: updatePayments }
            : lista
        ));

        // Actualizo en Firebase
        try {
            await updateLista(id, "userMember", updateUserMember );
            await updateLista(id, "categories", updatedCategories );
            await updateLista(id, "payments", updatePayments );
        } catch (error) {
            console.error("Error al actualizar la lista:", error);
        }

        // Elimino el uid temporal porque no me hace falta
        try {
            const userDocRef = doc(db, "usuarios", uid);
            await deleteDoc(userDocRef);
        } catch (error) {
            console.error("Error al eliminar el usuario de Firestore:", error);
        }
    }

    const addNewMember = async () => {
        const updatedUserMember = [...lista.userMember, usuario.uid];
        const docRef = doc(db, "listas", id);
        await updateDoc(docRef, { userMember: updatedUserMember });

        const updatedCategories = lista.categories.map(category => (
            {...category, items: category.items.map(item => (
                {...item, itemUserMember: [...item.itemUserMember, usuario.uid]
            }))
        }));
        
        await updateDoc(docRef, {categories: updatedCategories});

        setListas(prevListas => prevListas.map(lista => 
            lista.id === id 
            ? { ...lista, userMember: updatedUserMember, categories: updatedCategories }
            : lista
        )
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="overlay" onClick={() => "close"}></div>
        <div className="popUp" style={{ backgroundColor: "white" }}>
            <div className="fila-between" style={{ margin: "15px 0px" }}>
                <h3 style={{ fontWeight: "600" }}>Identifícate</h3>
            </div>
            <div>
                {filteredMembers.map((member, index) => {
                    return (
                        <div key={member.uid} className="vistaDatos">
                            <h4 onClick={() => updateMembers(member)}>{nombreUserMember[index]}</h4>
                        </div>
                    )
                })}
                <div className="vistaDatos fila-start">
                    <span className="material-symbols-outlined icon-medium" style={{marginRight: "8px", color: "grey"}}>person_add</span>
                    <h4 style={{ color: "grey" }} onClick={() => updateMembers(usuario.uid)}>Soy un miembro nuevo</h4>
                </div>
            </div>
        </div>
        </div>
    )
}

export default IdentifyUser
