import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export const uploadImage = async (imageData, path) => {
  if (!imageData) return "";
  
  try {
    const storage = getStorage();
    const timestamp = Date.now();
    const storageRef = ref(storage, `${path}/${uuidv4()}_${timestamp}`);
    
    await uploadString(storageRef, imageData, 'data_url');
    
    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;
  
  try {
    const storage = getStorage();
    const decodedUrl = decodeURIComponent(imageUrl);
    const startIndex = decodedUrl.indexOf('/o/') + 3;
    const endIndex = decodedUrl.indexOf('?');
    const storagePath = decodedUrl.substring(startIndex, endIndex);
    
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    // We don't throw here to prevent blocking operations if delete fails
  }
};