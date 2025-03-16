import React, { useState } from 'react';
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
import { useNgduData } from './hooks/getNGDU';
import { useWorkshopData } from './hooks/getWorkshop';
import { useAuth } from './contexts/authcontext';
import DatabaseTable from './components/NGDUdata/NGDUDBtable';


const NgduSyncComponent = () => {
  const { isAuthenticated, apiUri } = useAuth();
  const { fetchAndSaveNgduData, isLoading, error, syncStatus } = useNgduData();

  const [lastSyncTime, setLastSyncTime] = useState(null);

  const clearDB = async () => {
    await executeQuery('DELETE FROM workshop');
    await executeQuery('DELETE FROM ngdu');
    setTableCleared(true);
  }
  
  const handleSync = async () => {
    const result = await fetchAndSaveNgduData();
    
    if (result.success) {
      setLastSyncTime(new Date());
    }
  };
  
  return (
    <>
      <DatabaseTable/>
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
      <WorkshopSyncComponent />
    </>
  );
};


/**
 * Component to trigger Workshop data synchronization
 * @param {Object} props
 * @param {function} props.executeQuery - Function to execute database queries
 */
const WorkshopSyncComponent = () => {
  const { isAuthenticated, apiUri } = useAuth();
  const { 
    fetchAndSaveWorkshopsData, 
    isLoading, 
    error, 
    syncStatus, 
    progress 
  } = useWorkshopData();
  const [lastSyncTime, setLastSyncTime] = useState(null);
  
  const handleSync = async () => {
    const result = await fetchAndSaveWorkshopsData();
    
    if (result.success) {
      setLastSyncTime(new Date());
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = progress.total > 0 
    ? Math.round((progress.current / progress.total) * 100) 
    : 0;
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Синхронизация Цехов
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
        
        {isLoading && progress.total > 0 && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage} 
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              Прогресс: {progress.current} из {progress.total} страниц ({progressPercentage}%)
            </Typography>
          </Box>
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
          {isLoading ? 'Синхронизация...' : 'Синхронизировать Цеха'}
        </Button>
      </CardActions>
    </Card>
  );
};


export default NgduSyncComponent;