import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import firebaseApp, { db } from "./firebase-config.js"
const auth = getAuth(firebaseApp)

const UsuarioContext = createContext();
export const useUsuario = () => useContext(UsuarioContext);

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
      if (usuario) {
        setUsuario(usuario);
        // Cargar la información del usuario desde Firestore
        const docRef = doc(db, "usuarios", usuario.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            // Aquí puedes almacenar los datos en el estado si lo deseas
            setUsuario({ ...usuario, ...userData });
            // loadListasFromFirebase();
            } else {
            console.log("No hay tal documento!");
        }
      } else {
        setUsuario(null);
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

// export const useUsuario = () => {
//   return useContext(UsuarioContext);
// };
