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
import useLocalStorage from '../../hooks/useLocalStorage';
import { useAuth } from '../../contexts/authcontext';
import RemoteDataTable from '../../components/remotedata/RemoteDataTable';
import { DBContext } from '../../contexts/dbcontext';



export default function RemoteData() {
  const { isAuthenticated, apiUri, tryauth } = useAuth();
  const { fetchAndSaveNgduData, isLoadingNgdu, errorNgdu, syncStatusNgdu } = useNgduData();
  const { fetchAndSaveWorkshopsData, isLoadingWorkshop, errorWorkshop, syncStatusWorkshop, progressWorkshop } = useWorkshopData();

  const [ lastSyncTime, setLastSyncTime] = useLocalStorage('remotelastupdate', null);
  const [ ngduNum, setNgduNum] = useState(0);
  const [ workshopNum, setWorkshopNum] = useState(0);
  const [ wellNum, setWellNum] = useState(0);
  const [ measurementNum, setmeasurementNum] = useState(0);
  const { selectQuery, clearDB } = useContext(DBContext);
  const [ error, setError ] = useState('');

  const isLoading = isLoadingNgdu && isLoadingWorkshop;
  
 
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
  
  const handleClearDB = async () => {
    await clearDB();
    setLastSyncTime(null);
  }
  
  const handleSync = async () => {
    try {
        await tryauth()
    }catch {(error) => setError(error.message)};    
    const resultNgdu = await fetchAndSaveNgduData();
    const resultWorkshop = await fetchAndSaveWorkshopsData();
    
    if (resultNgdu.success && resultWorkshop.success) {
      let now = new Date();
      setLastSyncTime(now.toLocaleString());
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
            variant="contained"
            color="success"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
            disabled={isLoading || !apiUri}
            onClick={handleSync}
            sx={{ my: 2 }}
        >
          Синхронизировать базу данных
        </Button>
        <Button 
            variant="contained"
            color="error"
            startIcon={<SyncIcon />}            
            onClick={handleClearDB}
            sx={{ my: 2, ml: 10 }}
        >
          Очистить базу данных
        </Button>        
      </Box>
      {isLoadingNgdu && 
        <Alert severity="info" sx={{ mb: 2 }}>
            Синхронизую таблицу НГДУ
        </Alert>
      }
      {isLoadingWorkshop && 
        <Alert severity="info" sx={{ mb: 2 }}>
            Синхронизую таблицу Цехов
        </Alert>
      }
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
        
        
        {syncStatusNgdu && (
            <Alert 
                severity={syncStatusNgdu.status === 'completed' ? 'success' : 
                    syncStatusNgdu.status === 'failed' ? 'error' : 'info'}
                sx={{ mb: 2 }}
            >
                {syncStatusNgdu.message}
            </Alert>
        )}       
        {syncStatusWorkshop && (
            <Alert 
                severity={syncStatusWorkshop.status === 'completed' ? 'success' : 
                    syncStatusWorkshop.status === 'failed' ? 'error' : 'info'}
                sx={{ mb: 2 }}
            >
                {syncStatusWorkshop.message}
            </Alert>
        )}       
    </>
  );
};

