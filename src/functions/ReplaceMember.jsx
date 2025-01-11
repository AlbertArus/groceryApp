// import { useUsuario } from '../UsuarioContext.jsx';

const ReplaceMember = async ({ uid, usuario, updateLista, listas, setListas }) => {
    // const {usuario} = useUsuario()
    if(!uid) {
        console.error("no hay usuario");
        return;
    }
    await Promise.all(
        listas.map(async (lista) => {
            // Lista

                // Member en userMember
                const userMemberIndex = lista.userMember.findIndex(member => member === usuario.uid)
                const updateUserMember = [...lista.userMember]
                updateUserMember[userMemberIndex] = uid

                // Creator en lista
                const updateUserCreator = lista.userCreator === usuario.uid ? uid : lista.userCreator

                // Sacar member de userConfig
                const { [usuario.uid]: deleted, ...updateUserConfig } = lista.userConfig;
    
            // Category e Item
            const updatedCategories = lista.categories.map(category => {
                const updateCategoryCreator = category.categoryCreator === usuario.uid ? uid : category.categoryCreator
                const updatedItems = category.items.map(item => {
                    const itemUserMemberIndex = item.itemUserMember.findIndex(member => member === usuario.uid);
                    
                    // Creator en Item
                    const updateItemCreator = item.itemCreator === usuario.uid ? uid : item.itemCreator;
                    //Payer en Item
                    const updateItemPayer = item.payer === usuario.uid ? uid : item.payer;
                    // Member en Item
                    if (itemUserMemberIndex !== -1) {
                        const updateItemUserMember = [...item.itemUserMember];
                        updateItemUserMember[itemUserMemberIndex] = uid;
                        return { ...item, itemUserMember: updateItemUserMember, itemCreator: updateItemCreator, payer: updateItemPayer };
                    }

                    return item;
                });
    
                return { ...category, categoryCreator: updateCategoryCreator, items: updatedItems };
            });
                    
            // Payments
            const updatePayments = lista.payments.map(payment => {
                // Payer pagos
                const updatePaymentPayer = payment.payer === usuario.uid ? uid : payment.payer

                // Payer pagos
                const updatePaymentCreator = payment.paymentCreator === usuario.uid ? uid : payment.paymentCreator
                
                // Members en pagos
                const updatePaymentMembers = payment.members.map(member => {
                    if(member.uid === usuario.uid) {
                        return {...member, uid: uid}
                    }
                    return member
                })
                return { ...payment, paymentCreator: updatePaymentCreator, payer: updatePaymentPayer, members: updatePaymentMembers}
            })
    
            // Actualizo en Firebase
            try {
                await updateLista(lista.id, "userCreator", updateUserCreator );
                await updateLista(lista.id, "userMember", updateUserMember );
                await updateLista(lista.id, "userConfig", updateUserConfig );
                await updateLista(lista.id, "categories", updatedCategories );
                await updateLista(lista.id, "payments", updatePayments );
            } catch (error) {
                console.error("Error al actualizar la lista:", error);
            }

            setListas(prevListas => prevListas.map(lista => (
                { ...lista, userCreator: updateUserCreator, userMember: updateUserMember, userConfig: updateUserConfig, categories: updatedCategories, payments: updatePayments }
            )));
        })
    )
}

export default ReplaceMember
