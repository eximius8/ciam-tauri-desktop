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


// ItemsTable.js component
const ItemsTable = ({ items, selected, setSelected }) => {
  

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  // Selection functions
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = items.map(item => item.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelectItem = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter(item => item !== id);
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const rowCount = items.length;
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
                onChange={handleSelectAll}
                inputProps={{
                  'aria-label': 'select all items',
                }}
              />
            </TableCell>
            <TableCell>Исполниель</TableCell>
            <TableCell>Creation Date</TableCell>
            <TableCell>File</TableCell>
            <TableCell>NGDU</TableCell>
            <TableCell>Оператор</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Well</TableCell>
            <TableCell>Workshop</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => {
            const isItemSelected = isSelected(item.id);
            
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
                    onClick={() => handleSelectItem(item.id)}
                  />
                </TableCell>
                <TableCell>{item.bush}</TableCell>
                <TableCell>{formatDate(item.creationdtm)}</TableCell>
                <TableCell>{item.file}</TableCell>
                <TableCell>{item.ngdu}</TableCell>
                <TableCell>{item.operator}</TableCell>
                <TableCell>{item.source}</TableCell>
                <TableCell>{item.type_hr}</TableCell>
                <TableCell>{item.well}</TableCell>
                <TableCell>{item.workshop}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemsTable;