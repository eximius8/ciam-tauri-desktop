import React, { useState } from 'react';
// Import the correct dialog API from Tauri v2
import { open } from '@tauri-apps/plugin-dialog';
import { 
  Button, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Box,
  Chip,
  Divider,
  Stack
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Command } from '@tauri-apps/plugin-shell';

const FileBrowser = ({ onDataLoaded }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileCount, setFileCount] = useState(0);
  const [isLoadButtonEnabled, setIsLoadButtonEnabled] = useState(false);

  const browseFiles = async () => {
    // Define the file filters similar to tkinter filetypes
    const filters = [
      {
        name: 'Все поддерживаемые',
        extensions: ['ed', 'ek', 'es', 'dd', 'dv', 'dn', 'kat', 'me', 'md', 'mds', 'dmp', 'e', 'd']
      },
      {
        name: 'МИКОН-101Т',
        extensions: ['ed', 'ek', 'es', 'dd', 'dv', 'dn']
      },
      {
        name: 'КАТФЛОУ',
        extensions: ['kat']
      },
      {
        name: 'МАГМАТЕК',
        extensions: ['me', 'md', 'mds']
      },
      {
        name: 'САФ МУ-232И',
        extensions: ['dmp']
      },
      {
        name: 'CiamMasterMini',
        extensions: ['txt', 'e', 'd']
      }
    ];

    try {
      // Open the file dialog and allow multiple file selection
      const selected = await open({
        multiple: true,
        filters,
        title: 'Выберите файлы'
      });

      // Check if files were selected (not cancelled)
      if (selected !== null) {
        setSelectedFiles(selected);
        setFileCount(selected.length);
        setIsLoadButtonEnabled(true);
      }
    } catch (err) {
      console.error('Error selecting files:', err);
    }
  };

  const handleLoad = async () => {
    // Implement your file loading logic here
  
    const command = Command.sidecar("sidecars/filereader", [
      ...selectedFiles,
    ]);
    let result = await command.execute();    
    const obj = JSON.parse(result.stdout);   
    
    if (onDataLoaded && typeof onDataLoaded === 'function') {
      // Process files and pass data to parent component
      onDataLoaded(selectedFiles);
    }
  };

  // Extract filename from full path
  const getFileName = (filePath) => {
    return filePath.split('\\').pop().split('/').pop();
  };

  // Get file extension
  const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Stack spacing={3}>
        <Typography variant="h6" component="h2">
          Выбор файлов
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            variant="contained" 
            startIcon={<FolderOpenIcon />}
            onClick={browseFiles}
          >
            Выбрать файлы
          </Button>
          
          <Chip 
            label={`Выбрано файлов: ${fileCount}`} 
            color={fileCount > 0 ? "primary" : "default"}
            variant={fileCount > 0 ? "filled" : "outlined"}
          />
        </Box>
        
        {selectedFiles.length > 0 && (
          <>
            <Divider />
            <Typography variant="subtitle1">
              Выбранные файлы:
            </Typography>
            
            <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
              <List dense>
                {selectedFiles.map((file, index) => (
                  <ListItem key={index}>
                    <InsertDriveFileIcon color="primary" sx={{ mr: 1 }} />
                    <ListItemText 
                      primary={getFileName(file)}
                      secondary={file}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </>
        )}
        
        <Button 
          variant="contained" 
          color="success"
          startIcon={<CloudUploadIcon />}
          onClick={handleLoad} 
          disabled={!isLoadButtonEnabled}
          fullWidth
          size="large"
        >
          Загрузить
        </Button>
      </Stack>
    </Paper>
  );
};

export default FileBrowser;