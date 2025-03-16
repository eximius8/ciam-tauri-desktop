import React, { useEffect, useState, useContext } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import SyncIcon from '@mui/icons-material/Sync';
import { useNgduData } from '../../hooks/useNgduData';
import { useWorkshopData } from '../../hooks/useWorkshopData';
import { useAuth } from '../../contexts/authcontext';
import RemoteDataTable from '../../components/remotedata/RemoteDataTable';
import { DBContext } from '../../contexts/dbcontext';



export default function RemoteData() {
  const { isAuthenticated, apiUri } = useAuth();
  const { fetchAndSaveNgduData, isLoadingNgdu, errorNgdu, syncStatusNgdu } = useNgduData();
  const { fetchAndSaveWorkshopsData, isLoadingWorkshop, errorWorkshop, syncStatusWorkshop, progressWorkshop } = useWorkshopData();

  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [ngduNum, setNgduNum] = useState(0);
  const [workshopNum, setWorkshopNum] = useState(0);
  const [wellNum, setWellNum] = useState(0);
  const [measurementNum, setmeasurementNum] = useState(0);
  const { selectQuery } = useContext(DBContext);

  const isLoading = isLoadingNgdu && isLoadingWorkshop;
  const error = errorNgdu || errorWorkshop;
  const syncStatus = syncStatusNgdu || syncStatusWorkshop;

  useEffect(() => {

    async function loadItemNum() {
        const ngdu = await selectQuery('SELECT count(1) FROM ngdu', []);
        setNgduNum(ngdu[0]['count(1)']);
        const workshop = await selectQuery('SELECT count(1) FROM workshop', []);
        setWorkshopNum(workshop[0]['count(1)']);
        const well = await selectQuery('SELECT count(1) FROM well', []);
        setWellNum(well[0]['count(1)']);
        const measurements = await selectQuery('SELECT count(1) FROM measurements', []);
        setmeasurementNum(measurements[0]['count(1)']);
      }
      loadItemNum();
    }, [lastSyncTime]
  )
  
  
  const handleSync = async () => {
    const resultNgdu = await fetchAndSaveNgduData();
    const resultWorkshop = await fetchAndSaveWorkshopsData();
    
    if (resultNgdu.success && resultWorkshop.success) {
      setLastSyncTime(new Date());
    }
  };
  
  return (
    <>
      <RemoteDataTable 
        ngduNum={ngduNum} 
        workshopNum={workshopNum} 
        wellNum={wellNum} 
        measurementNum={ measurementNum} 
      />
      <Box>
        <Button 
            variant="contained"
            color="success"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
            disabled={isLoading || !isAuthenticated() || !apiUri}
            onClick={handleSync}
            sx={{ my: 2 }}
        >
          Синхронизировать базу данных
        </Button>
        
      </Box>
       

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            НГДУ Синхронизация
          </Typography>
          
          {!isAuthenticated() && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Необходима авторизация для синхронизации данных.
            </Alert>
          )}
          
          {!apiUri && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              API URI не настроен. Пожалуйста, проверьте настройки.
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {syncStatus && (
            <Alert 
              severity={syncStatus.status === 'completed' ? 'success' : 
                      syncStatus.status === 'failed' ? 'error' : 'info'}
              sx={{ mb: 2 }}
            >
              {syncStatus.message}
            </Alert>
          )}
          
          {lastSyncTime && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Последняя синхронизация: {lastSyncTime.toLocaleString()}
            </Typography>
          )}
        </CardContent>
        
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
            disabled={isLoading || !isAuthenticated() || !apiUri}
            onClick={handleSync}
            fullWidth
          >
            {isLoading ? 'Синхронизация...' : 'Синхронизировать НГДУ'}
          </Button>
        </CardActions>
      </Card>
      
    </>
  );
};

