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
import { useAuth } from '../contexts/authcontext';
import useLocalStorage from '../hooks/useLocalStorage';

const SoftwareSettingsDialog = () => {
  const {
    authenticate,
    saveCredentials
  } = useAuth();

  const [open, setOpen] = useState(false);
  const [apiUri, setApiUri] = useLocalStorage('apiUri', '');
  const [username, setUsername] = useLocalStorage('username', '');
  const [password, setPassword] = useLocalStorage('password', '');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset verification status when dialog closes
    setVerificationStatus(null);
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
      // Use the authenticate method from the auth context
      const result = await authenticate(apiUri, username, password);

      if (result.success) {
        setVerificationStatus({
          success: true,
          message: 'Данные верны!'
        });
      } else {
        setVerificationStatus({
          success: false,
          message: result.error || 'Проверка прошла неудачно'
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
            Пароль будет сохранен
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