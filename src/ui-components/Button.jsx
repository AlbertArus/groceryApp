
const Button = ({onClick, buttonCopy, style}) => {
  return (
    <h4 className="buttonMain app-margin" style={style} onClick={onClick}>{buttonCopy}</h4>
  )
}

export default Button
