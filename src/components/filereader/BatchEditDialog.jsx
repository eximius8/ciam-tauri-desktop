import { useState } from 'react';
import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Box, 
    Typography, 
    TextField, 
    Checkbox, 
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
  } from '@mui/material';
import { useDatabase } from '../../contexts/dbcontext';


const EditField = ({isSelected, setIsSelected, name, value, setValue, items}) => {

  return (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
            <Checkbox
              checked={isSelected}
              onChange={(event) => setIsSelected(event.target.checked)}
            />
            <FormControl fullWidth>
              <InputLabel id="item-label">{name}</InputLabel>
              <Select
                labelId="item-label"
                id="ngdu"
                value={value}
                label={name}
                disabled={!isSelected}
                fullWidth
                margin="dense"
                size="small"
                onChange={(e) => setValue(e.target.value)}
              >
                {items.map((item) => <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>)}         
              </Select>
            </FormControl>            
          </Box>
  )
}



// BatchEditDialog.js component
const BatchEditDialog = ({ open, onClose }) => {
    const { ngdus, selectQuery } = useDatabase();
    const [ isNGDUselected, setIsNGDUselected ] = useState(false);
    const [ isWorkshopselected, setIsWorkshopselected ] = useState(false);
    const [ isWellselected, setIsWellselected ] = useState(false);

    const [ ngduValue, setNgduValue ] = useState('');
    const [ workshopValue, setWorkshopValue ] = useState('');
    const [ wellValue, setWellValue ] = useState('');
   
    const [ workshopItems, setWorkshopItems ] = useState([]);
    const [ wellItems, setWellItems ] = useState([]);

    const handleNGDUChange = async (value) => {
        setNgduValue(value);
        setWorkshopValue('');
        setWellValue('');
        setIsWorkshopselected(true);
        setIsWellselected(true);
        setWellItems([]);
        if (value !== '') {
          const workshops = await selectQuery('SELECT * FROM workshop WHERE ngduId = ?', [value]);
          console.log(workshops);
          setWorkshopItems(workshops);
        } else{
          setWorkshopItems([]);
        }
    }



    //const applyBatchEdit = () => {
    //    const updatedItems = items.map(item => {
    //      if (selected.includes(item.id)) {
    //        const updates = {};
    //        Object.keys(batchEditValues).forEach(field => {
    //          if (batchEditValues[field].apply) {
    //            updates[field] = batchEditValues[field].value;
    //          }
    //        });
    //        return { ...item, ...updates };
    //      }
    //      return item;
    //    });
    //    
    //    updateItems(updatedItems);
    //    setOpenBatchEdit(false);
    //    setSelected([]);
    //  };
/**


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
 */

  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Batch Edit Selected Items</DialogTitle>
        <DialogContent sx={{ width: 400 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select which fields to update and enter new values.
          </Typography>
          
          {/* NGDU */}
          <EditField
            isSelected={isNGDUselected}
            setIsSelected={setIsNGDUselected}
            name="НГДУ"
            value={ngduValue}
            setValue={handleNGDUChange}
            items={ngdus}
          />
          <EditField
            isSelected={isWorkshopselected}
            setIsSelected={setIsWorkshopselected}
            name="Исполнитель"
            value={workshopValue}
            setValue={setWorkshopValue}
            items={workshopItems}
          />
          <EditField
            isSelected={isWellselected}
            setIsSelected={setIsWellselected}
            name="Скважина"
            value={wellValue}
            setValue={setWellValue}
            items={wellItems}
          />          

          
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={() => console.log('Apply Changes')} 
            color="primary"
            variant="contained"
            disabled={false}
          >
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default BatchEditDialog;