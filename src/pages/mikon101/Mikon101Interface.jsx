import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  LinearProgress,
  CircularProgress,
  Chip,
  Grid,
  Divider,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UsbIcon from '@mui/icons-material/Usb';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';

// Styled components
const ConnectionStatusChip = styled(Chip)(({ theme, connected }) => ({
  backgroundColor: connected ? theme.palette.success.main : theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  '& .MuiChip-icon': {
    color: theme.palette.common.white,
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
  maxHeight: 400,
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Mikon101Interface = () => {
  // State
  const [comPorts, setComPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [dynamogramData, setDynamogramData] = useState([]);
  const [echogramData, setEchogramData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);

  // Simulated COM ports - in a real app, this would come from a serial port API
  useEffect(() => {
    // Simulate fetching available COM ports
    const fetchComPorts = async () => {
      // In a real application, you would use a library like serialport.js
      // or web-serial API to get available ports
      const mockPorts = ['COM1', 'COM2', 'COM3', 'COM4', 'COM5'];
      setComPorts(mockPorts);
    };

    fetchComPorts();
  }, []);

  // Handle COM port selection
  const handlePortChange = (event) => {
    setSelectedPort(event.target.value);
  };

  // Simulated connection to the device
  const connectToDevice = async () => {
    if (!selectedPort) {
      setError('Пожалуйста, выберите COM порт');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful connection
      setIsConnected(true);
      
      // Simulate device info fetching with progress updates
      for (let i = 0; i <= 100; i += 10) {
        setDownloadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Set mock device info
      setDeviceInfo({
        serialNumber: 'MK101-22040056',
        usesAtmelFlash: true,
        deviceVersion: '3.5.17',
        dataFormatVersion: '2.1',
        lastMeasurementDate: '2025-04-10T15:32:41',
        batteryLevel: 78,
        totalMeasurements: 148,
      });
      
      // Set mock measurement data
      setDynamogramData([
        { id: 1, date: '2025-04-10T15:32:41', maxLoad: 12500, minLoad: 2800, status: 'Normal' },
        { id: 2, date: '2025-04-10T13:15:22', maxLoad: 12600, minLoad: 2750, status: 'Normal' },
        { id: 3, date: '2025-04-10T11:02:18', maxLoad: 12480, minLoad: 2820, status: 'Normal' },
        { id: 4, date: '2025-04-09T22:48:33', maxLoad: 12350, minLoad: 2900, status: 'Warning' },
        { id: 5, date: '2025-04-09T19:21:05', maxLoad: 12200, minLoad: 3100, status: 'Normal' },
      ]);
      
      setEchogramData([
        { id: 1, date: '2025-04-10T15:32:41', fluidLevel: 1250, gasLevel: 320, status: 'Normal' },
        { id: 2, date: '2025-04-10T13:15:22', fluidLevel: 1255, gasLevel: 315, status: 'Normal' },
        { id: 3, date: '2025-04-10T11:02:18', fluidLevel: 1260, gasLevel: 310, status: 'Normal' },
        { id: 4, date: '2025-04-09T22:48:33', fluidLevel: 1240, gasLevel: 330, status: 'Warning' },
        { id: 5, date: '2025-04-09T19:21:05', fluidLevel: 1245, gasLevel: 325, status: 'Normal' },
      ]);
    } catch (err) {
      setError('Ошибка подключения к устройству');
      setIsConnected(false);
    } finally {
      setLoading(false);
      setDownloadProgress(0);
    }
  };

  // Disconnect from device
  const disconnectDevice = () => {
    setIsConnected(false);
    setDeviceInfo(null);
    setDynamogramData([]);
    setEchogramData([]);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Интерфейс прибора МИКОН 101
      </Typography>

      {/* Connection Controls */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={5}>
          <FormControl fullWidth disabled={loading || isConnected}>
            <InputLabel id="com-port-label">COM Порт</InputLabel>
            <Select
              labelId="com-port-label"
              id="com-port-select"
              value={selectedPort}
              label="COM Порт"
              onChange={handlePortChange}
            >
              {comPorts.map((port) => (
                <MenuItem key={port} value={port}>
                  {port}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            color={isConnected ? "error" : "primary"}
            onClick={isConnected ? disconnectDevice : connectToDevice}
            startIcon={<UsbIcon />}
            disabled={loading || (!selectedPort && !isConnected)}
            fullWidth
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isConnected ? "Отключить" : "Подключить"
            )}
          </Button>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <ConnectionStatusChip
            icon={<UsbIcon />}
            label={isConnected ? "Подключено" : "Отключено"}
            connected={isConnected ? 1 : 0}
          />
        </Grid>
      </Grid>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Progress Bar */}
      {loading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Загрузка данных с устройства...
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={downloadProgress} 
            sx={{ mt: 1, height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" color="text.secondary" align="right">
            {downloadProgress}%
          </Typography>
        </Box>
      )}

      {/* Device Information */}
      {isConnected && deviceInfo && (
        <>
          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Информация об устройстве
            </Typography>
          </Box>
          
          <StyledTableContainer component={Paper} variant="outlined">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '50%' }}>
                    Серийный номер
                  </TableCell>
                  <TableCell>{deviceInfo.serialNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Используется флеш память Atmel
                  </TableCell>
                  <TableCell>{deviceInfo.usesAtmelFlash ? 'Да' : 'Нет'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Версия устройства (логической карты)
                  </TableCell>
                  <TableCell>{deviceInfo.deviceVersion}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Версия формата данных
                  </TableCell>
                  <TableCell>{deviceInfo.dataFormatVersion}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Дата последнего измерения
                  </TableCell>
                  <TableCell>
                    {new Date(deviceInfo.lastMeasurementDate).toLocaleString('ru-RU')}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Уровень заряда батареи
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={deviceInfo.batteryLevel} 
                        sx={{ 
                          width: 100, 
                          mr: 2,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: 
                              deviceInfo.batteryLevel > 60 ? 'success.main' :
                              deviceInfo.batteryLevel > 30 ? 'warning.main' : 'error.main',
                          }
                        }} 
                      />
                      {deviceInfo.batteryLevel}%
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Общее количество измерений
                  </TableCell>
                  <TableCell>{deviceInfo.totalMeasurements}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </StyledTableContainer>

          {/* Measurement Data Tabs */}
          <Box sx={{ mt: 4 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab icon={<BarChartIcon />} label="Динамограммы" id="tab-0" />
              <Tab icon={<TimelineIcon />} label="Эхограммы" id="tab-1" />
            </Tabs>
            
            {/* Dynamogram Data */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="subtitle1" gutterBottom>
                Данные динамограмм
              </Typography>
              <StyledTableContainer component={Paper} variant="outlined">
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Дата и время</TableCell>
                      <TableCell>Макс. нагрузка (кг)</TableCell>
                      <TableCell>Мин. нагрузка (кг)</TableCell>
                      <TableCell>Статус</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dynamogramData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{new Date(row.date).toLocaleString('ru-RU')}</TableCell>
                        <TableCell>{row.maxLoad}</TableCell>
                        <TableCell>{row.minLoad}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.status} 
                            color={row.status === 'Normal' ? 'success' : 'warning'} 
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
              <Button 
                startIcon={<DownloadIcon />} 
                variant="outlined" 
                sx={{ mt: 2 }}
              >
                Экспорт данных
              </Button>
            </TabPanel>
            
            {/* Echogram Data */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="subtitle1" gutterBottom>
                Данные эхограмм
              </Typography>
              <StyledTableContainer component={Paper} variant="outlined">
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Дата и время</TableCell>
                      <TableCell>Уровень жидкости (м)</TableCell>
                      <TableCell>Уровень газа (м)</TableCell>
                      <TableCell>Статус</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {echogramData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{new Date(row.date).toLocaleString('ru-RU')}</TableCell>
                        <TableCell>{row.fluidLevel}</TableCell>
                        <TableCell>{row.gasLevel}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.status} 
                            color={row.status === 'Normal' ? 'success' : 'warning'} 
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
              <Button 
                startIcon={<DownloadIcon />} 
                variant="outlined" 
                sx={{ mt: 2 }}
              >
                Экспорт данных
              </Button>
            </TabPanel>
          </Box>
        </>
      )}
      
      {/* Placeholder when disconnected */}
      {!isConnected && (
        <Box sx={{ 
          mt: 4, 
          p: 5, 
          textAlign: 'center', 
          bgcolor: 'background.paper',
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 2
        }}>
          <UsbIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Подключите устройство МИКОН 101 через COM порт
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Выберите порт из выпадающего списка и нажмите "Подключить"
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Mikon101Interface;