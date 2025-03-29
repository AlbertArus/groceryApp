import Button from "./Button";

const ButtonArea = ({ buttonCopy, onClick, style, children }) => {

    return (
        <div className="wrapper">
            <div className="content">
                {children}
            </div>
            <div className="button-main-fixed">
                <Button
                    buttonCopy={buttonCopy}
                    onClick={onClick}
                    style={style}
                />
            </div>
        </div>
    );
}

export default ButtonArea;