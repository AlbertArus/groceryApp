import { useEffect, useRef, useState } from "react";
import Button from "./Button";

const ButtonArea = ({ buttonCopy, onClick, children }) => {
    const wrapperRef = useRef(null);
    const contentRef = useRef(null);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const checkScrollability = () => {
            const contentElement = contentRef.current;
            const wrapperElement = wrapperRef.current;

            if (contentElement && wrapperElement) {
                const isContentTaller = contentElement.scrollHeight > wrapperElement.clientHeight;
                setIsScrollable(isContentTaller);
            }
        };

        checkScrollability();
        window.addEventListener('resize', checkScrollability);

        return () => {
            window.removeEventListener('resize', checkScrollability);
        };
    }, [children]);

    return (
        <div ref={wrapperRef} className="wrapper">
            <div ref={contentRef} className="content" style={{overflowY: isScrollable ? 'auto' : 'hidden'}}>
                {children}
            </div>   
            <div className="button-main-sticky" style={{position: "sticky", bottom: "0"}}>
                <Button
                    buttonCopy={buttonCopy}
                    onClick={onClick}
                />
            </div>
        </div>
    );
}

export default ButtonArea;