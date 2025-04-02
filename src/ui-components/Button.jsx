const Button = ({onClick, buttonCopy, style, inactive}) => {

    return (
    <h4 className={`buttonMain app-margin ${inactive ? "inactive" : ""}`} style={style} onClick={onClick}>{buttonCopy}</h4>
  )
}

export default Button
