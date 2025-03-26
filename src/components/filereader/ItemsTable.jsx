import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Checkbox 
  } from '@mui/material';
import MeasurementTableRow from './MeasurementTableRow';
import { useFileReader } from '../../contexts/filereadercontext';


// ItemsTable.js component
const ItemsTable = () => {
  const { measurements, selected, selectAll } = useFileReader();
  

  // Selection functions
  const handleSelectAll = (event) => {    
    selectAll(event.target.checked);
  };  

  const rowCount = measurements.length;
  const numSelected = selected.length;

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="items table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={(event) => handleSelectAll(event)}
                inputProps={{
                  'aria-label': 'select all items',
                }}
              />
            </TableCell>
            <TableCell>Дата замера</TableCell>
            <TableCell>НГДУ</TableCell>
            <TableCell>Цех</TableCell>
            <TableCell>Скважина</TableCell>
            <TableCell>Исполнитель</TableCell>
            <TableCell>Оператор</TableCell>
            <TableCell>Тип замера</TableCell>
            <TableCell>Прибор</TableCell>
            <TableCell>Файл</TableCell>            
          </TableRow>
        </TableHead>
        <TableBody>
          {measurements.map((item) => <MeasurementTableRow key={item.id} item={item}/>)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemsTable;