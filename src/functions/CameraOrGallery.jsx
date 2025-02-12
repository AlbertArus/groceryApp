import { useRef, useEffect } from "react";

export default function CameraOrGallery({ onClose, image, setImage }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera(); // Limpia el startCamera para que si onClose cierra la vista la cámara no siga activa
    };
  }, []);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (error) {
//       console.error("Error al acceder a la cámara:", error);
//       alert("No se pudo acceder a la cámara.");
//     }
//   };

    const startCamera = async () => {
        try {
        const constraints = {
            video: { 
                facingMode: { exact: "environment" }, // Intenta abrir la cámara trasera
                width: { ideal: 1920 }, // Resolución ideal
                height: { ideal: 1080 },
            } 
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        } catch (error) {
        console.error("Error al acceder a la cámara trasera:", error);
        // Si falla, intenta con la cámara delantera o la única disponible
        try {
            const constraints = {
            video: {
                width: { ideal: 1920 }, // Resolución ideal
                height: { ideal: 1080 }
            } // Intenta con cualquier cámara disponible
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
            videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error al acceder a la cámara:", error);
            alert("No se pudo acceder a la cámara.");
        }
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
    
        // Detener todas las pistas
        tracks.forEach((track) => {
            track.stop(); // Detener la pista
            console.log("Pista detenida:", track);
        });
    
        // Liberar la referencia al stream
        videoRef.current.srcObject = null;
        } else {
        console.log("No hay stream de cámara activo.");
        }
    };

  const takePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        // setImage(canvasRef.current.toDataURL("image/png"));
        const newImage = canvasRef.current.toDataURL("image/png");
        setImage(newImage); // Actualiza el estado `image`
        console.log("Nueva imagen:", newImage)
        stopCamera()
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setImage(result);
        onClose(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApprove = () => {
      stopCamera();
      onClose(image);
  };

  const handleRetake = () => {
    setImage(null)
    startCamera();
  };

  const switchCamera = async () => {
    stopCamera();
    const constraints = {
      video: { facingMode: videoRef.current.srcObject ? (videoRef.current.srcObject.getVideoTracks()[0].getSettings().facingMode === "environment" ? "user" : "environment") : "environment" }
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error al alternar la cámara:", error);
      alert("No se pudo alternar la cámara.");
    }
  };

  console.log(image)

  return (
    <div className="camera-container">
      {image ? (
        <>
          <img src={image} alt="Foto tomada" className="captured-image" />
          <div className="confirm-buttons">
            <button onClick={handleRetake} className="reject"><span className="material-symbols-outlined">restart_alt</span></button>
            <button onClick={handleApprove} className="approve"><span className="material-symbols-outlined">check</span></button>
          </div>
        </>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline className="camera-video" />
          <canvas ref={canvasRef} className="hidden-canvas" />
          
          <button className="close-button" onClick={() => {stopCamera(); onClose(null)}}><span className="material-symbols-outlined">close</span></button>
          <div className="camera-buttons">
            <label className="gallery-button">
                <span className="material-symbols-outlined">photo_library</span>
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>
            <button className="capture-button" onClick={takePhoto}></button>          
            <button className="switch-camera-button" onClick={switchCamera}><span className="material-symbols-outlined">restart_alt</span></button>
          </div>
        </>
      )}
    </div>
  );
}