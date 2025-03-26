import { Toolbar, Typography, Button, Tooltip } from '@mui/material';

import {
  Edit as EditIcon,
} from '@mui/icons-material';


// TableToolbar.js component

const TableToolbar = ({ numSelected, openBatchEdit }) => {
  
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: 'rgba(25, 118, 210, 0.12)',
        }),
        mb: 2
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="subtitle1"
          id="tableTitle"
          component="div"
        >
          Select items to perform batch operations
        </Typography>
      )}

      {numSelected > 0 && (
        <Tooltip title="Batch Edit">
          <Button 
            variant="contained" 
            startIcon={<EditIcon />}
            onClick={openBatchEdit}
          >
            Изменить
          </Button>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default TableToolbar;