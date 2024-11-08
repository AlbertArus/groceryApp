
const EmptyState = ({img, alt, description, onClick, buttonCopy}) => {

  return (
    <div className="emptyState">
      <img src={`/Fotos GroceryApp/${img}.png`} alt={alt} style={{width:"100%", height:"100%"}}></img>
      <h5 style={{width: "auto", }}>{description}</h5>
      <h5 className="buttonMain" onClick={onClick}>{buttonCopy}</h5>
    </div>
  )
}

export default EmptyState