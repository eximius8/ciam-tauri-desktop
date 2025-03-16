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
import { useNgduData } from '../../hooks/getNGDU';
import { useWorkshopData } from '../../hooks/getWorkshop';
import { useAuth } from '../../contexts/authcontext';
import RemoteDataTable from '../../components/remotedata/RemoteDataTable';



export default function RemoteData() {
  const { isAuthenticated, apiUri } = useAuth();
  const { fetchAndSaveNgduData, isLoading, error, syncStatus } = useNgduData();

  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [ngduNum, setngduNum] = useState(0);
  const [workshopNum, setworkshopNum] = useState(0);
  const [wellNum, setwellNum] = useState(0);
  const [measurementNum, setmeasurementNum] = useState(0);

  
  
  const handleSync = async () => {
    const result = await fetchAndSaveNgduData();
    
    if (result.success) {
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

