export const convertirImagenABase64 = (file) => {

    console.log(typeof file)

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Obtener solo la parte base64
      reader.onerror = (error) => reject(error);
    });
  };