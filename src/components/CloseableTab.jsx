import { Tab, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Custom Tab component with close button
export const CloseableTab = ({ label, onClose, ...props }) => {
  const handleCloseClick = (event) => {
    event.stopPropagation();
    onClose();
  };

  return (
    <Tab
      {...props}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {label}
          <Box
            component="span"
            onClick={handleCloseClick}
            sx={{ 
              ml: 1, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
              borderRadius: '50%',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </Box>
        </Box>
      }
    />
  );
};