import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

// Component imports
import TableToolbar from './TableToolbar';
import ItemsTable from './ItemsTable';
import BatchEditDialog from './BatchEditDialog';

// Main component that orchestrates the table functionality
const EditableItemsTable = () => {
  // Sample item data
  const [items, setItems] = useState([
    {
      id: "dbf137c8db89cc39b2d8629eec674b6d",
      bush: "000005",
      creationdtm: "2025-03-18T15:20:56.635+01:00",
      file: "00000206.D",
      ngdu: "",
      operator: "5",
      source: "Файлы СИАМ",
      type_hr: "SIAM COMPLEX DYNAMOGRAM V2.0",
      well: "009638",
      workshop: "5",
      dataArray: [{}, {}],
      device_meta: {
        voltage: null,
        deviceType: 'динамограф',
        deviceManufacturer: 'СИАМ',
        deviceModel: 'Файлы СИАМ',
        deviceVersion: '00'
      },
      dynometa: {
        debit: null,
        buffPres: 0,
        rodMove: null,
        rodDiameter: 320,
        period: 728
      },
      field: "5",
      mdt: "2023-05-02T11:55:11.000+02:00",
      mtype: "dyno"
    },
    {
      id: "abc123c8db89cc39b2d8629eec674xyz",
      bush: "000007",
      creationdtm: "2025-03-17T10:15:42.125+01:00",
      file: "00000208.D",
      ngdu: "",
      operator: "7",
      source: "Файлы СИАМ",
      type_hr: "SIAM COMPLEX DYNAMOGRAM V2.0",
      well: "009640",
      workshop: "7",
      dataArray: [{}, {}],
      device_meta: {
        voltage: null,
        deviceType: 'динамограф',
        deviceManufacturer: 'СИАМ',
        deviceModel: 'Файлы СИАМ',
        deviceVersion: '00'
      },
      dynometa: {
        debit: null,
        buffPres: 0,
        rodMove: null,
        rodDiameter: 320,
        period: 728
      },
      field: "7",
      mdt: "2023-05-01T09:30:22.000+02:00",
      mtype: "dyno"
    },
    {
      id: "def456c8db89cc39b2d8629eec674abc",
      bush: "000009",
      creationdtm: "2025-03-16T09:12:33.245+01:00",
      file: "00000210.D",
      ngdu: "",
      operator: "3",
      source: "Файлы СИАМ",
      type_hr: "SIAM COMPLEX DYNAMOGRAM V2.0",
      well: "009642",
      workshop: "3",
      dataArray: [{}, {}],
      device_meta: {
        voltage: null,
        deviceType: 'динамограф',
        deviceManufacturer: 'СИАМ',
        deviceModel: 'Файлы СИАМ',
        deviceVersion: '00'
      },
      dynometa: {
        debit: null,
        buffPres: 0,
        rodMove: null,
        rodDiameter: 320,
        period: 728
      },
      field: "3",
      mdt: "2023-04-30T14:22:45.000+02:00",
      mtype: "dyno"
    }
  ]);

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
    
    setItems(updatedItems);
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
