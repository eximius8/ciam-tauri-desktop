import { 
    TableCell, 
    TableRow, 
    Checkbox 
  } from '@mui/material';

import { useDBSelect } from '../../hooks/useDBSelect';
import { useFileReader } from '../../contexts/filereadercontext';

// Format date for display
const formatDate = (dateString) => {
    try {
    const date = new Date(dateString);
    return date.toLocaleString();
    } catch (e) {
    return dateString;
    }
};

export default function MeasurementTableRow({item}) {    
    const ngduTitle = useDBSelect(item.ngdu, 'ngdu', 'title');
    const workshopTitle = useDBSelect(item.workshop, 'workshop', 'title');
    const wellNumber = useDBSelect(item.well, 'well', 'number');
    const { selected, addSelected, removeSelected } = useFileReader();

    const isSelected = () => {
        return selected.indexOf(item.id) !== -1;
    }
    const isItemSelected = isSelected(item.id);

    const handleSelectItem = () => {
        if (isItemSelected) {
            removeSelected(item.id);
        } else {
            addSelected(item.id);
        }
    }
                
    return (
        <TableRow 
            key={item.id} 
            hover
            selected={isItemSelected}
            role="checkbox"
            aria-checked={isItemSelected}
        >
            <TableCell padding="checkbox">
                <Checkbox
                color="primary"
                checked={isItemSelected}
                onClick={handleSelectItem}
                />
            </TableCell>
            <TableCell>{formatDate(item.mdt)}</TableCell>
            <TableCell>{ngduTitle}</TableCell>
            <TableCell>{workshopTitle}</TableCell>
            <TableCell>{wellNumber}</TableCell>
            <TableCell>{item.bush}</TableCell>
            <TableCell>{item.operator}</TableCell>
            <TableCell>{item.type_hr}</TableCell>
            <TableCell>{item.source}</TableCell>
            <TableCell>{item.file}</TableCell>
        </TableRow>
    );
}