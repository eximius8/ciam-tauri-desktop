import { useState } from 'react';
import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Box, 
    Typography, 
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
  } from '@mui/material';
import { useDatabase } from '../../contexts/dbcontext';
import { useFileReader } from '../../contexts/filereadercontext';


const EditField = ({name, value, setValue, items, title}) => {

  return (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
            
            <FormControl fullWidth>
              <InputLabel id="item-label">{name}</InputLabel>
              <Select
                labelId="item-label"
                id="ngdu"
                value={value}
                label={name}                
                fullWidth
                margin="dense"
                size="small"
                onChange={(e) => setValue(e.target.value)}
              >
                {items.map((item) => <MenuItem key={item.id} value={item.id}>{item[title]}</MenuItem>)}         
              </Select>
            </FormControl>            
          </Box>
  )
}

// BatchEditDialog.js component
const BatchEditDialog = ({ open, onClose }) => {
    const { ngdus, selectQuery } = useDatabase();
    const [ ngduValue, setNgduValue ] = useState('');
    const [ workshopValue, setWorkshopValue ] = useState('');
    const [ wellValue, setWellValue ] = useState('');
   
    const [ workshopItems, setWorkshopItems ] = useState([]);
    const [ wellItems, setWellItems ] = useState([]);

    const { updateMeasurementsFromSelected } = useFileReader();

    

    const handleNGDUChange = async (value) => {
        setNgduValue(value);
        setWorkshopValue('');
        setWellValue('');
        setWellItems([]);
        if (value !== '') {
          const workshops = await selectQuery('SELECT * FROM workshop WHERE ngduId = ?', [value]);
          setWorkshopItems(workshops);
        } else{
          setWorkshopItems([]);
        }
    }

    const handleWorkshopChange = async (value) => {
        setWorkshopValue(value);
        setWellValue('');
        if (value !== '') {
          const wells = await selectQuery('SELECT * FROM well WHERE workshopId = ?', [value]);
          setWellItems(wells);
        } else{
          setWellItems([]);
        }
    }



    const applyChanges = () => {
      updateMeasurementsFromSelected(ngduValue, workshopValue, wellValue);
      onClose();
    }
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Batch Edit Selected Items</DialogTitle>
        <DialogContent sx={{ width: 400 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select which fields to update and enter new values.
          </Typography>
          
          {/* NGDU */}
          <EditField
            name="НГДУ"
            value={ngduValue}
            setValue={handleNGDUChange}
            items={ngdus}
            title='title'
          />
          <EditField
            name="Цех"
            value={workshopValue}
            setValue={handleWorkshopChange}
            items={workshopItems}
            title='title'
          />
          <EditField
            name="Скважина"
            value={wellValue}
            setValue={setWellValue}
            items={wellItems}
            title='number'
          />           
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Отмена
          </Button>
          <Button 
            onClick={applyChanges} 
            color="primary"
            variant="contained"
            disabled={!ngduValue || !workshopValue || !wellValue}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default BatchEditDialog;