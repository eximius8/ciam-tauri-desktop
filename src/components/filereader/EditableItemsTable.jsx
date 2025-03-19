import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

// Component imports
import TableToolbar from './TableToolbar';
import ItemsTable from './ItemsTable';
import BatchEditDialog from './BatchEditDialog';
import { useFileReader } from '../../contexts/filereadercontext';

// Main component that orchestrates the table functionality
const EditableItemsTable = () => {

  const {items, dispatch} = useFileReader();

  const updateItems = (updateditems) => {
    updateditems.forEach(item => {
      dispatch({ type: 'update', id: item.id, item: item })      
    });
  }
    
   

  // State for batch editing
  const [selected, setSelected] = useState([]);
  const [openBatchEdit, setOpenBatchEdit] = useState(false);
  const [batchEditValues, setBatchEditValues] = useState({
    ngdu: { value: '', apply: false },
    operator: { value: '', apply: false },
    well: { value: '', apply: false },
    workshop: { value: '', apply: false }
  });

  // Batch edit functions
  const openBatchEditDialog = () => {
    setBatchEditValues({
      ngdu: { value: '', apply: false },
      operator: { value: '', apply: false },
      well: { value: '', apply: false },
      workshop: { value: '', apply: false }
    });
    setOpenBatchEdit(true);
  };

  const handleBatchEditChange = (field, value) => {
    setBatchEditValues({
      ...batchEditValues,
      [field]: { ...batchEditValues[field], value }
    });
  };

  const handleBatchEditToggle = (field) => {
    setBatchEditValues({
      ...batchEditValues,
      [field]: { ...batchEditValues[field], apply: !batchEditValues[field].apply }
    });
  };

  const applyBatchEdit = () => {
    const updatedItems = items.map(item => {
      if (selected.includes(item.id)) {
        const updates = {};
        Object.keys(batchEditValues).forEach(field => {
          if (batchEditValues[field].apply) {
            updates[field] = batchEditValues[field].value;
          }
        });
        return { ...item, ...updates };
      }
      return item;
    });
    
    updateItems(updatedItems);
    setOpenBatchEdit(false);
    setSelected([]);
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Items Table
      </Typography>
      
      <TableToolbar 
        numSelected={selected.length} 
        openBatchEdit={openBatchEditDialog} 
      />
      
      <ItemsTable 
        items={items}
        selected={selected}
        setSelected={setSelected}
      />
      
      <BatchEditDialog 
        open={openBatchEdit}
        onClose={() => setOpenBatchEdit(false)}
        batchEditValues={batchEditValues}
        handleBatchEditChange={handleBatchEditChange}
        handleBatchEditToggle={handleBatchEditToggle}
        applyBatchEdit={applyBatchEdit}
      />
    </Box>
  );
};

export default EditableItemsTable;
