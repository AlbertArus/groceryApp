import React, { useState } from 'react'
import CameraOrGallery from '../functions/CameraOrGallery';
import OCR from '../OCR/OCR';
import { useSearchParams } from 'react-router-dom';

const Camera = ({ lista, EditItem, AddMultipleItems, AddCategory }) => {
    const [cameraOpen, setCameraOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [searchParams] = useSearchParams()
    const OCRneed = searchParams?.get("view") !== "payments"

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
            <div className="element-container">
                <span className="material-symbols-outlined" onClick={() => setCameraOpen(true)}>add_a_photo</span>
            </div>
            {image && OCRneed &&
                <OCR
                    image={image}
                    setImage={setImage}
                    lista={lista}
                    AddMultipleItems={AddMultipleItems}
                    EditItem={EditItem}
                    AddCategory={AddCategory}
                />
            }
        </>
    )
}

export default Camera