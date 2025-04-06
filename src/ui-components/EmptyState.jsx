import Button from "./Button"

const EmptyState = ({img, alt, description, onClick, buttonCopy, style, onClick2, buttonCopy2, style2, inactive}) => {
    return (
        <div className="emptyState app-margin">
            <img src={`/Fotos GroceryApp/${img}.png`} alt={alt} style={{width:"100%", objectFit: "contain", maxHeight: "300px"}}></img>
            <h5 style={{width: "auto", textAlign: "center"}}>{description}</h5>
            <div className="button-main-fixed">
                <Button
                    buttonCopy={buttonCopy}
                    onClick={onClick}
                    style={style}
                    inactive={inactive}
                />
                {onClick2 && (
                    <Button
                        buttonCopy={buttonCopy2}
                        onClick={onClick2}
                        style={style2}
                        inactive={inactive}
                    />
                )}
            </div>
        </div>
    )
}

export default EmptyState