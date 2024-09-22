
export const ShareButton = () => {
  const shareData = {
    title: 'GroceryApp',
    text: '¡Mira este increíble proyecto!',
    url: window.location.href,
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