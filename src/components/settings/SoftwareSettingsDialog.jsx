import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const SoftwareSettingsDialog = () => {
  const [open, setOpen] = useState(false);
  const [apiUri, setApiUri] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberCredentials, setRememberCredentials] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved credentials when component mounts
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        // For Tauri apps, we can use localStorage
        // In a production Tauri app, you might want to use more secure storage methods
        // like tauri's fs module with proper encryption
        const savedApiUri = localStorage.getItem('apiUri');
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        const savedRemember = localStorage.getItem('rememberCredentials');
        
        if (savedApiUri) setApiUri(savedApiUri);
        if (savedUsername) setUsername(savedUsername);
        if (savedPassword) setPassword(savedPassword);
        if (savedRemember !== null) setRememberCredentials(savedRemember === 'true');
      } catch (error) {
        console.error('Failed to load saved credentials:', error);
      }
    };

    loadCredentials();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset verification status when dialog closes
    setVerificationStatus(null);
  };

  const saveCredentials = () => {
    try {
      if (rememberCredentials) {
        localStorage.setItem('apiUri', apiUri);
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        localStorage.setItem('rememberCredentials', 'true');
      } else {
        // Clear saved credentials if "remember" is unchecked
        localStorage.removeItem('apiUri');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.setItem('rememberCredentials', 'false');
      }
    } catch (error) {
      console.error('Failed to save credentials:', error);
    }
  };

  const handleVerification = async () => {
    if (!apiUri || !username || !password) {
      setVerificationStatus({
        success: false,
        message: 'Заполните все поля'
      });
      return;
    }

    setIsLoading(true);
    setVerificationStatus(null);

    try {
      const endpoint = `${apiUri}/api/auth/signin`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus({
          success: true,
          message: 'Данные верны!'
        });
        // Save credentials after successful verification
        saveCredentials();
      } else {
        setVerificationStatus({
          success: false,
          message: data.message || 'Проверка прошла неудачно'
        });
      }
    } catch (error) {
      setVerificationStatus({
        success: false,
        message: `Ошибка: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRememberChange = (event) => {
    setRememberCredentials(event.target.checked);
  };

  return (
    <>
      <IconButton 
        size="medium" 
        aria-label="settings"
        onClick={handleOpen}
        sx={{ marginLeft: 'auto' }}
      >
                
        <SettingsIcon />
      </IconButton>
      

      <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Настройки
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="API URI"
              variant="outlined"
              fullWidth
              value={apiUri}
              onChange={(e) => setApiUri(e.target.value)}
              placeholder="http://10.1.10.111:30801"
              size="small"
            />
            
            <TextField
              label="Пользователь"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="small"
            />
            
            <TextField
              label="Пароль"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
            />
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={rememberCredentials} 
                  onChange={handleRememberChange}
                  color="primary"
                />
              }
              label="Запомнить"
            />
            
            {verificationStatus && (
              <Alert severity={verificationStatus.success ? 'success' : 'error'}>
                {verificationStatus.message}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {rememberCredentials 
              ? "Пароль будет сохранен" 
              : "Пароль не будет сохранен"}
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleVerification}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Проверяю...' : 'Проверить данные для входа'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SoftwareSettingsDialog;