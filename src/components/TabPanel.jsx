import { Box } from '@mui/material';


export const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        style={{ padding: '16px' }}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    );
  };