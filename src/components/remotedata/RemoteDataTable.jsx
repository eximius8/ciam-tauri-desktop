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

const RemoteDataTable = ({ngduNum, workshopNum, wellNum, measurementNum }) => {
   
  const rows = [
    { name: 'НГДУ', count: ngduNum },
    { name: 'Цеха', count: workshopNum },
    { name: 'Скважины', count: wellNum },
    { name: 'Измерения', count: measurementNum },
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Typography variant="h5" component="h2" className="mb-4">
        Информация о базе данных
      </Typography>
      
      <TableContainer component={Paper} className="shadow-md mt-4">
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

export default RemoteDataTable;