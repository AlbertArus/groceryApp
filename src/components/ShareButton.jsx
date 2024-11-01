import { useUsuario } from '../UsuarioContext';

export const ShareButton = ({url, lista}) => {
  const {usuario} = useUsuario()
  const shareData = {
    title: 'GroceryApp',
    text: lista ? `${usuario.displayName} te ha invitado a colaborar en la lista ${lista.listaName}` : `${usuario.displayName} te ha invitado a colaborar en su lista`,
    url: url,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Compartir va bien');
      } catch (err) {
        console.error('Error al compartir:', err);
      }
    } else {
      alert('La funcionalidad de compartir no está disponible actualmente. Intentálo de nuevo más tarde');
    }
  };

  return handleShare
}