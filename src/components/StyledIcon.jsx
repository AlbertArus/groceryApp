import { styled } from '@mui/system';

// Define un componente estilizado para los íconos
const StyledIcon = styled('span')(({ theme }) => ({
  fontSize: '2rem', // Tamaño del ícono
  color: theme.palette.text.primary, // Color del ícono
  transition: 'color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    color: theme.palette.primary.main, // Color en hover
    transform: 'scale(1.1)', // Escala en hover
  },
  '&:active': {
    color: theme.palette.secondary.main, // Color en click
    transform: 'scale(0.9)', // Escala en click
  },
}));

function StyledIconComponent({ className, children }) {
  return (
    <StyledIcon className={className}>
      {children}
    </StyledIcon>
  );
}

export default StyledIconComponent;
