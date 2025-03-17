import React, { useEffect, useState, useContext } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import SyncIcon from '@mui/icons-material/Sync';
import { useNgduData } from '../../hooks/useNgduData';
import { useWorkshopData } from '../../hooks/useWorkshopData';
import { useWellData } from '../../hooks/useWellData';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useAuth } from '../../contexts/authcontext';
import RemoteDataTable from '../../components/remotedata/RemoteDataTable';
import { DBContext } from '../../contexts/dbcontext';



export default function RemoteData() {
  const { authenticate, apiUri, username, password, isLoading: isLoadingAuth } = useAuth();

  const { fetchAndSaveNgduData, isLoadingNgdu, errorNgdu, syncStatusNgdu } = useNgduData();
  const { fetchAndSaveWorkshopsData, isLoadingWorkshop, errorWorkshop, syncStatusWorkshop, progressWorkshop } = useWorkshopData();
  const { fetchAndSaveWellsData, isLoadingWell, errorWell, syncStatusWell, progressWell } = useWellData();

  const [ lastSyncTime, setLastSyncTime] = useLocalStorage('remotelastupdate', null);

  const [ ngduNum, setNgduNum] = useState(0);
  const [ workshopNum, setWorkshopNum] = useState(0);
  const [ wellNum, setWellNum] = useState(0);
  const [ measurementNum, setmeasurementNum] = useState(0);
  const { selectQuery, clearDB, isDBLoading  } = useContext(DBContext);
  const [ error, setError ] = useState('');

  const [isLoading, setIsLoading] = useState(isLoadingNgdu && isLoadingWorkshop && isLoadingAuth && isLoadingWell);

  const settingsNotDone = !apiUri || !username || !password;  
 
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
    }, [lastSyncTime, apiUri, username, password, isLoading, isDBLoading]
  )
  
  const handleClearDB = async () => {
    await clearDB();
    setLastSyncTime(null);
  }
  
  const handleSync = async () => {
    setIsLoading(true);
    setError('');
    const auth = await authenticate(apiUri, username, password);
    setIsLoading(false)
    if (!auth.success) {
      setError(`Не удалось подключиться: ${auth.error}`)
    }else{
      const resultNgdu = await fetchAndSaveNgduData();
      if (resultNgdu.success) {
        let now = new Date();
        setLastSyncTime(now.toLocaleString());
      }
      const resultWorkshop = await fetchAndSaveWorkshopsData();      
      if (resultWorkshop.success) {
        let now = new Date();
        setLastSyncTime(now.toLocaleString());
      }
      const resultWell = await fetchAndSaveWellsData();      
      if (resultWell.success) {
        let now = new Date();
        setLastSyncTime(now.toLocaleString());
      }
    }
  };
  
  return (
    <>
      <RemoteDataTable 
        ngduNum={ngduNum} 
        workshopNum={workshopNum} 
        wellNum={wellNum} 
        measurementNum={measurementNum} 
      />

      {lastSyncTime && 
        <Alert severity="info" sx={{ my: 2 }}>
            Последняя синхронизация: {lastSyncTime}
        </Alert>
      }
      <Box sx={{ display: 'flex', my: 2, justifyContent: 'space-between' }}>
        <Button 
            variant="contained"
            color="success"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
            disabled={isLoading || !apiUri || !username || !password}
            onClick={handleSync}            
        >
          Синхронизировать базу данных
        </Button>
        <Button 
            variant="contained"
            color="error"
            startIcon={<SyncIcon />}
            disabled={isLoading}
            onClick={handleClearDB}            
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
      {settingsNotDone && (
        <Alert severity="warning" sx={{ mb: 2 }}>
            Пожалуйста, проверьте настройки соединения
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
      {syncStatusWell && (
          <Alert 
              severity={syncStatusWell.status === 'completed' ? 'success' : 
                syncStatusWell.status === 'failed' ? 'error' : 'info'}
              sx={{ mb: 2 }}
          >
              {syncStatusWell.message}
          </Alert>
      )}       
    </>
  );
};

