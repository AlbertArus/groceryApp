import CameraOrGallery from '../functions/CameraOrGallery';

const Camera = ({ image, setImage, cameraOpen, setCameraOpen }) => {

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

        </>
    )
}

export default Camera