import ButtonArea from "./ButtonArea"

const EmptyState = ({img, alt, description, onClick, buttonCopy}) => {

  return (
    <ButtonArea
        buttonCopy={buttonCopy}
        onClick={onClick}
    >
        <div className="emptyState app-margin">
            <img src={`/Fotos GroceryApp/${img}.png`} alt={alt} style={{width:"100%", objectFit: "contain", maxHeight: "300px"}}></img>
            <h5 style={{width: "auto", textAlign: "center"}}>{description}</h5>
            {/* <h5 className="buttonMain" onClick={onClick}>{buttonCopy}</h5> */}
        </div>
    </ButtonArea>
  )
}

export default EmptyState