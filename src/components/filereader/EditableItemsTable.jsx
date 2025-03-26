import { useState } from 'react';
import { Box, Typography } from '@mui/material';

// Component imports
import TableToolbar from './TableToolbar';
import ItemsTable from './ItemsTable';
import BatchEditDialog from './BatchEditDialog';
import { useFileReader } from '../../contexts/filereadercontext';


// Main component that orchestrates the table functionality
const EditableItemsTable = () => {

  const { selected } = useFileReader();  // State for batch editing  
  const [openBatchEdit, setOpenBatchEdit] = useState(false);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Items Table
      </Typography>
      
      <TableToolbar 
        numSelected={selected.length} 
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
