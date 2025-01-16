
const DeleteUserFromList = async ({ member, lista, updateLista, setListas }) => {
    if(!member) {
        console.error("no hay usuario");
        return;
    }
    // Lista

        // Member en userMember
        const updateUserMember = lista.userMember.filter(currentMember => currentMember !== member)

        // Sacar member de userConfig
        const { [member]: deleted, ...updateUserConfig } = lista.userConfig;

    // Category e Item
    const updatedCategories = lista.categories.map(category => {
        // Member en Item
        const updatedItems = category.items.map(item => {
                const updateItemUserMember = (item.itemUserMember || []).filter(currentMember => currentMember !== member);
                return { ...item, itemUserMember: updateItemUserMember};
            }
        );

        return { ...category, items: updatedItems };
    });
            
    // Actualizo en Firebase
    try {
        await updateLista(lista.id, "userMember", updateUserMember );
        await updateLista(lista.id, "userConfig", updateUserConfig );
        await updateLista(lista.id, "categories", updatedCategories );
    } catch (error) {
        console.error("Error al actualizar la lista:", error);
    }

    setListas(prevListas => prevListas.map(lista => (
        { ...lista, userMember: updateUserMember, userConfig: updateUserConfig, categories: updatedCategories }
    )));
}

export default DeleteUserFromList

