import {useContext, useEffect, useState} from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Button
} from '@mui/material';
import { DBContext } from '../../contexts/dbcontext';


const DatabaseTable = () => {

  const { selectQuery, executeQuery } = useContext(DBContext);
  const [ ngduNum, setNgdunum] = useState(0);
  const [ workshopNum, setworkshopNum ] = useState(0);
  const [ wellNum, setwellNum ] = useState(0);
  const [ tableCleared, setTableCleared ] = useState(false);

  useEffect(() => {      
      async function loadItemNum() {
        const ngdu = await selectQuery('SELECT count(1) FROM ngdu', []);
        setNgdunum(ngdu[0]['count(1)']);
        const workshop = await selectQuery('SELECT count(1) FROM workshop', []);
        setworkshopNum(workshop[0]['count(1)']);
        const well = await selectQuery('SELECT count(1) FROM well', []);
        setwellNum(well[0]['count(1)']);
      }
      loadItemNum();     
     
    }, [selectQuery, executeQuery, tableCleared]);
  
  const rows = [
    { name: 'НГДУ', count: ngduNum },
    { name: 'Цеха', count: workshopNum },
    { name: 'Скважины', count: wellNum }
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Typography variant="h5" component="h2" className="mb-4">
        Информация о базе данных
      </Typography>
      
      <TableContainer component={Paper} className="shadow-md mt-3">
        <Table aria-label="database records table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Наименование списка</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Количество элементов</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow 
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.count.toLocaleString('ru-RU')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DatabaseTable;