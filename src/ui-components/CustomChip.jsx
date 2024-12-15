import { Chip } from "@mui/material";

const CustomChip = ({ label, isSelected, onClick }) => (
    <Chip
        label={label}
        clickable
        onClick={onClick}
        sx={{
            fontFamily: "inherit",
            fontSize: "12px",
            padding: "5px",
            borderRadius: "5px",
            backgroundColor: '#ffeec9',
            border: isSelected ? '1.5px solid #ED9E04' : 'none',
            marginRight: "5px",
            "&:hover": {
                backgroundColor: isSelected ? '#FBE7C1' : '#f0f0f0',
            },
        }}
    />
);

export default CustomChip
