import { createContext, useState } from 'react';

export const DataTableContext = createContext();


export const DataTableProvider = props => {
    const [selected, setSelected] = useState([]);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterColumn, setFilterColumn] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filters, setFilters] = useState({});
    const [uniqueValues, setUniqueValues] = useState({});
    const [rows, setRows] = useState([]); 

    // Columns configuration
    const columns = [        
        { id: 'ngdu', label: 'НГДУ', filterable: true },
        { id: 'measurementType', label: 'Тип измерения', filterable: true },
        { id: 'operator', label: 'Оператор', filterable: true },
        { id: 'field', label: 'Месторождение', filterable: true },
        { id: 'workshop', label: 'Цех', filterable: true },
        { id: 'well', label: 'Скважина', filterable: true },
        { id: 'executor', label: 'Исполнитель', filterable: true },
        { id: 'measureDate', label: 'Дата замера', filterable: true },
        { id: 'source', label: 'Источник', filterable: true },        
      ];
  
    return (
      <DataTableContext.Provider
        value={{ 
            selectedstate: {selected, setSelected}, 
            deleteConfirmOpenstate: {deleteConfirmOpen, setDeleteConfirmOpen},
            searchTextstate: {searchText, setSearchText},
            pagestate: {page, setPage},
            rowsPerPagestate: {rowsPerPage, setRowsPerPage},
            filterColumnstate: {filterColumn, setFilterColumn},
            filterValuestate: {filterValue, setFilterValue},
            filtersstate: {filters, setFilters},
            uniqueValuesstate: {uniqueValues, setUniqueValues},
            rowsstate: {rows, setRows},
            columns
        }}
      >
        {props.children}
      </DataTableContext.Provider>
    );
  };