import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import firebaseApp, { db } from "./firebase-config.js"
const auth = getAuth(firebaseApp)

const UsuarioContext = createContext();
export const useUsuario = () => useContext(UsuarioContext);

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(undefined);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        if (authUser) {
          // Cargar la información del usuario desde Firestore
          const docRef = doc(db, "usuarios", authUser.uid);
          const docSnap = await getDoc(docRef);
        //   console.log(authUser.uid)
        //   console.log("docSnap", docSnap)
        //   console.log("docSnap existe?", docSnap.exists())
          
          if (docSnap.exists()) {
            // console.log("reescribo docSnap con userData")
            const userData = docSnap.data();
            // console.log("userData", userData)
            // console.log(authUser)
            setUsuario({ ...authUser, ...userData });
            // console.log("actualizo usuario con userData")
            // console.log("usuario", usuario)
          } else {
            // console.log("docSnap no existe")
            setUsuario(authUser);
            // console.log("actualizo usuario con authUser")
            // console.log("No hay información adicional del usuario");
          }
        } else {
          setUsuario(null);
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
    }, []);

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};
