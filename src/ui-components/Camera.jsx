import React, { useState } from 'react'
import CameraOrGallery from '../functions/CameraOrGallery';
import OCR from '../OCR/OCR';

const Camera = ({ lista }) => {
    const [cameraOpen, setCameraOpen] = useState(false);
    const [image, setImage] = useState(null);

    const handleImageCapture = (image) => {
        setImage(image)
        setCameraOpen(false)
    }

    if (cameraOpen) {
        return <CameraOrGallery 
            image={image}
            setImage={setImage}
            onClose={handleImageCapture}
        />;
    }

    return (
        <>
            <div className="search-container" style={{ padding: "5px 5px 0px 5px", marginLeft: "10px" }}>
                <span className="material-symbols-outlined" onClick={() => setCameraOpen(true)}>add_a_photo</span>
            </div>
            {image && 
                <OCR
                    image={image}
                    setImage={setImage}
                    lista={lista}
                />
            }
        </>
    )
}

export default Camera
