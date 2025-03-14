import {useContext, useEffect, useState} from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography 
} from '@mui/material';
import { DBContext } from '../../contexts/dbcontext';


const DatabaseTable = () => {

  const { selectQuery } = useContext(DBContext);
  const [ngduNum, setNgdunum] = useState(0)
  // Sample data - replace with your actual database data

  useEffect(() => {      
      async function loadNGDUNum() {
        const ngdu = await selectQuery('SELECT count(1) FROM ngdu', []);
        setNgdunum(ngdu[0]['count(1)']); 
        
      }
      loadNGDUNum();     
     
    }, []);
  
  const rows = [
    { name: 'НГДУ', count: ngduNum },
    { name: 'Цеха', count: 48 },
    { name: 'Скважины', count: 1256 }
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