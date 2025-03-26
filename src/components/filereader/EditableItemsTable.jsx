import { useState } from 'react';
import { Box, Typography } from '@mui/material';

// Component imports
import TableToolbar from './TableToolbar';
import ItemsTable from './ItemsTable';
import BatchEditDialog from './BatchEditDialog';



// Main component that orchestrates the table functionality
const EditableItemsTable = () => {

  
  const [openBatchEdit, setOpenBatchEdit] = useState(false);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Items Table
      </Typography>
      
      <TableToolbar        
        openBatchEdit={() => setOpenBatchEdit(true)} 
      />
      
      <ItemsTable />
      
      <BatchEditDialog 
        open={openBatchEdit}
        onClose={() => setOpenBatchEdit(false)}
      />
    </Box>
  );
};

export default EditableItemsTable;
