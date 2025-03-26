import { useEffect, useState } from 'react';
import { Toolbar, Typography, Button } from '@mui/material';

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useFileReader } from '../../contexts/filereadercontext';


const TableToolbar = ({ openBatchEdit }) => {

  const { selected, removeSelectedMeasurements, checkSelected, saveSelectedToDB } = useFileReader();
  const [ saveDisabled, setSaveDisabled] = useState(true);
  const numSelected = selected.length; 

  useEffect(() => {
    const check = async () => {
      const result = await checkSelected();
      setSaveDisabled(!result);
    };
    check();
  },[selected, checkSelected]);
  
  
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
        <>
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            onClick={saveSelectedToDB}
            disabled={saveDisabled}          
            sx={{ mr: 2 }}
          >
            Сохранить
          </Button>        
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={removeSelectedMeasurements}            
            sx={{ mr: 2 }}
          >
            Удалить
          </Button>        
          <Button 
            variant="contained" 
            startIcon={<EditIcon />}
            onClick={openBatchEdit}
          >
            Изменить
          </Button>          
        </>
      )}
    </Toolbar>
  );
};

export default TableToolbar;