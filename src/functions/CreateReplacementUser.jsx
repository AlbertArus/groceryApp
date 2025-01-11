import { doc, setDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../firebase-config'
// import { useUsuario } from '../UsuarioContext.jsx';
import ReplaceMember from './ReplaceMember.jsx'

const CreateReplacementUser = async ({ usuario, UsuarioCompleto, updateLista, listas, setListas }) => {
    console.log(usuario.uid)
    try {
        const displayName = await UsuarioCompleto(usuario.uid)
        const uid = uuidv4()
        const newMember = doc(db, "usuarios", uid);
        const data = {
            uid,
            displayName,
            createdAt: new Date().toISOString(),
        }
        console.log(uid)
        await setDoc(newMember, data);
        console.log("usuario creado")
        await ReplaceMember({uid, usuario, updateLista, listas, setListas})
        console.log("replacement terminado")
    } catch (error) {
        console.error(error)
    }
}

export default CreateReplacementUser
