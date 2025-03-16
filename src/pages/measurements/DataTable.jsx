import React, { useEffect, useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  Box,
  Chip
} from '@mui/material';


import ConfirmDeleteDialog from '../../components/datatable/ConfirmDeleteDialog';
import TableToolBar from '../../components/datatable/TableToolBar';
import { DataTableContext } from '../../contexts/datatablecontexts';
import { DBContext } from '../../contexts/dbcontext';


// Sample data - replace with your actual data source
const createData = (id, ngdu, measurementType, operator, field, workshop, well, executor, measureDate, source) => ({
  id,
  ngdu,
  measurementType,
  operator,
  field,
  workshop,
  well,
  executor,
  measureDate,
  source
});

const generateSampleData = () => {
  const types = ['Динамометрирование', 'Влагометрия', 'Расходометрия', 'Термометрия'];
  const ngdus = ['НГДУ-1', 'НГДУ-2', 'НГДУ-3', 'НГДУ-4'];
  const operators = ['Иванов И.И.', 'Петров П.П.', 'Сидоров С.С.', 'Кузнецов К.К.'];
  const fields = ['Западное', 'Восточное', 'Северное', 'Южное'];
  const workshops = ['Цех-1', 'Цех-2', 'Цех-3', 'Цех-4'];
  const executors = ['Смирнов С.С.', 'Попов П.П.', 'Васильев В.В.', 'Михайлов М.М.'];
  const sources = ['Файл', 'Ручной ввод', 'API', 'База данных'];
  
  const rows = [];
  for (let i = 1; i <= 200; i++) {
    const randomDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const formattedDate = randomDate.toLocaleDateString('ru-RU');
    
    rows.push(createData(
      i,
      ngdus[Math.floor(Math.random() * ngdus.length)],
      types[Math.floor(Math.random() * types.length)],
      operators[Math.floor(Math.random() * operators.length)],
      fields[Math.floor(Math.random() * fields.length)],
      workshops[Math.floor(Math.random() * workshops.length)],
      `Скв-${Math.floor(Math.random() * 1000) + 1}`,
      executors[Math.floor(Math.random() * executors.length)],
      formattedDate,
      sources[Math.floor(Math.random() * sources.length)]
    ));
  }
  return rows;
};

const DataTable = () => {
  const { 
    selectedstate, 
    searchTextstate,
    pagestate,
    rowsPerPagestate,
    filtersstate,
    uniqueValuesstate,
    rowsstate,
    columns } = useContext(DataTableContext);  
  const { selected, setSelected } = selectedstate;
  const { searchText } = searchTextstate;
  const { page, setPage } = pagestate;
  const { rowsPerPage, setRowsPerPage } = rowsPerPagestate;
  const { filters, setFilters } = filtersstate;
  const { setUniqueValues } = uniqueValuesstate;
  const { rows, setRows } = rowsstate;   


  const { selectQuery } = useContext(DBContext);
  
  

  // Generate sample data on component mount
  useEffect(() => {
    const sampleData = generateSampleData();
    //setRows(sampleData);
    async function loadMeasurements() {
      const measurements = await selectQuery('SELECT * FROM measurements', []);


      setRows(measurements);
    }
    loadMeasurements();
    
    // Generate unique values for each filterable column
    const uniqueValueMap = {};
    columns.forEach(column => {
      if (column.filterable) {
        const values = [...new Set(sampleData.map(row => row[column.id]))];
        uniqueValueMap[column.id] = values.sort();
      }
    });
    setUniqueValues(uniqueValueMap);
  }, []);

  const handleRequestSort = (property) => {
    // Implement sorting logic here if needed
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const removeFilter = (columnToRemove) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[columnToRemove];
    setFilters(updatedFilters);
    setPage(0);
  };

  
  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Apply search and filters
  const filteredRows = rows.filter(row => {
    // Check if row matches all active filters
    const matchesFilters = Object.entries(filters).every(([column, value]) => {
      return String(row[column]).toLowerCase().includes(value.toLowerCase());
    });

    // Check if row matches search text (across all filterable columns)
    const matchesSearch = searchText === '' || columns.some(column => {
      return column.filterable && String(row[column.id]).toLowerCase().includes(searchText.toLowerCase());
    });

    return matchesFilters && matchesSearch;
  });

  // Get current page rows
  const currentPageRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
     <TableToolBar />

      {Object.keys(filters).length > 0 && (
        <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {Object.entries(filters).map(([column, value]) => (
            <Chip
              key={column}
              label={`${columns.find(col => col.id === column)?.label}: ${value}`}
              onDelete={() => removeFilter(column)}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      )}

      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size="medium"
        >
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                  checked={filteredRows.length > 0 && selected.length === filteredRows.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all' }}
                />
              </TableCell>
              {columns.map((column) => 
                (
                  <TableCell
                    key={column.id}
                    align="center"
                    padding="normal"
                  >
                    {column.label}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageRows.map((row, index) => {
              const isItemSelected = isSelected(row.id);

              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox 
                      checked={isItemSelected}
                      onClick={(event) => handleClick(event, row.id)}
                    />
                  </TableCell>
                  {columns.map((column) => 
                     <TableCell key={column.id} align="left" onClick={(event) => handleClick(event, row.id)}>
                      {row[column.id]}
                     </TableCell>
                  )}
                </TableRow>
              );
            })}
            {currentPageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  Нет данных для отображения
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Строк на странице:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
      />

      {/* Confirmation Dialog for Multiple Delete */}
      <ConfirmDeleteDialog />
    </Paper>
  );
};

export default DataTable;