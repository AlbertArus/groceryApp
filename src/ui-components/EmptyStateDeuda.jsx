import ButtonsPagos from "../components/ButtonsPagos"

const EmptyStateDeuda = ({img, alt, description, lista, handleArchive, deleteLista}) => {

    return (
        <div className="emptyState app-margin">
            <img src={`/Fotos GroceryApp/${img}.png`} alt={alt} style={{width:"100%", objectFit: "contain", maxHeight: "300px"}}></img>
            <h5 style={{width: "auto", textAlign: "center"}}>{description}</h5>
            <ButtonsPagos 
                lista={lista}
                handleArchive={handleArchive}
                deleteLista={deleteLista}
            />
        </div>
    )
}

export default EmptyStateDeuda