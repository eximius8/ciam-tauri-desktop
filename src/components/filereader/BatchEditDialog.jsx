import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Box, 
    Typography, 
    TextField, 
    Checkbox, 
    Button 
  } from '@mui/material';

// BatchEditDialog.js component
const BatchEditDialog = ({ 
    open, 
    onClose, 
    batchEditValues, 
    handleBatchEditChange, 
    handleBatchEditToggle, 
    applyBatchEdit 
  }) => {
    
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Batch Edit Selected Items</DialogTitle>
        <DialogContent sx={{ width: 400 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select which fields to update and enter new values.
          </Typography>
          
          {/* NGDU */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
            <Checkbox
              checked={batchEditValues.ngdu.apply}
              onChange={() => handleBatchEditToggle('ngdu')}
            />
            <TextField
              label="NGDU"
              value={batchEditValues.ngdu.value}
              onChange={(e) => handleBatchEditChange('ngdu', e.target.value)}
              disabled={!batchEditValues.ngdu.apply}
              fullWidth
              margin="dense"
              size="small"
            />
          </Box>
          
          {/* Operator */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Checkbox
              checked={batchEditValues.operator.apply}
              onChange={() => handleBatchEditToggle('operator')}
            />
            <TextField
              label="Operator"
              value={batchEditValues.operator.value}
              onChange={(e) => handleBatchEditChange('operator', e.target.value)}
              disabled={!batchEditValues.operator.apply}
              fullWidth
              margin="dense"
              size="small"
            />
          </Box>
          
          {/* Well */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Checkbox
              checked={batchEditValues.well.apply}
              onChange={() => handleBatchEditToggle('well')}
            />
            <TextField
              label="Well"
              value={batchEditValues.well.value}
              onChange={(e) => handleBatchEditChange('well', e.target.value)}
              disabled={!batchEditValues.well.apply}
              fullWidth
              margin="dense"
              size="small"
            />
          </Box>
          
          {/* Workshop */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Checkbox
              checked={batchEditValues.workshop.apply}
              onChange={() => handleBatchEditToggle('workshop')}
            />
            <TextField
              label="Workshop"
              value={batchEditValues.workshop.value}
              onChange={(e) => handleBatchEditChange('workshop', e.target.value)}
              disabled={!batchEditValues.workshop.apply}
              fullWidth
              margin="dense"
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={applyBatchEdit} 
            color="primary"
            variant="contained"
            disabled={!Object.values(batchEditValues).some(field => field.apply)}
          >
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default BatchEditDialog;