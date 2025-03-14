import { useContext } from 'react';
import {  
  TextField,
  Toolbar,
  Typography,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,  
  IconButton,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Info as InfoIcon
} from '@mui/icons-material';

import { DataTableContext } from '../../contexts/datatablecontexts';

export default function TableToolBar() {
  const { 
    selectedstate, 
    deleteConfirmOpenstate,
    searchTextstate,
    pagestate,
    filterColumnstate,
    filterValuestate,
    filtersstate,
    uniqueValuesstate,
    columns } = useContext(DataTableContext);
  const { setDeleteConfirmOpen } = deleteConfirmOpenstate;
  const { selected } = selectedstate;
  const { searchText, setSearchText } = searchTextstate;
  const { setPage } = pagestate;
  const { filterColumn, setFilterColumn } = filterColumnstate;
  const { filterValue, setFilterValue } = filterValuestate;
  const { filters, setFilters } = filtersstate;
  const { uniqueValues } = uniqueValuesstate;


  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  const applyFilter = () => {
    if (filterColumn && filterValue) {
      setFilters({
        ...filters,
        [filterColumn]: filterValue
      });
      setFilterColumn('');
      setFilterValue('');
      setPage(0);
    }
  };

  const handleFilterColumnChange = (event) => {
    setFilterColumn(event.target.value);
    setFilterValue('');
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setPage(0);
  };

  const handleDeleteSelected = () => {
    setDeleteConfirmOpen(true);
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchText('');
    setPage(0);
  };

  return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(selected.length > 0 && {
            bgcolor: 'rgba(25, 118, 210, 0.08)',
          }),
        }}
      >
        {selected.length > 0 ? (
          <Box sx={{ flex: '1 1 100%', display: 'flex', alignItems: 'center' }}>
            <Typography
              color="inherit"
              variant="subtitle1"
              component="div"
              sx={{ mr: 2 }}
            >
              Выбрано: {selected.length}
            </Typography>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSelected}
              size="small"
              sx={{ mr: 2 }}
            >
              Удалить
            </Button>
            <Button
              variant="contained"
              color="info"
              startIcon={<EditIcon />}
              onClick={handleDeleteSelected}
              size="small"
              sx={{ mr: 2 }}
            >
              Изменить
            </Button>
            {selected.length == 1 
              &&
              <Button
                variant="contained"
                color="success"
                startIcon={<InfoIcon />}
                onClick={handleDeleteSelected}
                size="small"
                sx={{ mr: 2 }}
              >
                Посмотреть
              </Button>
            }
          </Box>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Данные измерений
          </Typography>
        )}

        <TextField
          variant="outlined"
          size="small"
          placeholder="Поиск..."
          value={searchText}
          onChange={handleSearchChange}
          sx={{ mr: 2, width: '250px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchText('')}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl variant="outlined" size="small" sx={{ mr: 1, minWidth: '150px' }}>
            <InputLabel>Столбец для фильтра</InputLabel>
            <Select
              value={filterColumn}
              onChange={handleFilterColumnChange}
              label="Столбец для фильтра"
            >
              <MenuItem value="">
                <em>Выберите столбец</em>
              </MenuItem>
              {columns.filter(col => col.filterable).map((column) => (
                <MenuItem key={column.id} value={column.id}>{column.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {filterColumn && (
            <FormControl variant="outlined" size="small" sx={{ mr: 1, minWidth: '150px' }}>
              <InputLabel>Значение</InputLabel>
              <Select
                value={filterValue}
                onChange={handleFilterValueChange}
                label="Значение"
              >
                <MenuItem value="">
                  <em>Выберите значение</em>
                </MenuItem>
                {uniqueValues[filterColumn]?.map((value) => (
                  <MenuItem key={value} value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {filterColumn && (
            <IconButton size="small" onClick={applyFilter} sx={{ mr: 1 }}>
              <FilterListIcon />
            </IconButton>
          )}

          {Object.keys(filters).length > 0 && (
            <IconButton size="small" onClick={clearAllFilters} color="secondary">
              <ClearIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>)
}