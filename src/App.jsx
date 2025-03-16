import React, { useState } from 'react';
import { 
  Tabs, 
  Tab, 
  Box, 
  Menu, 
  MenuItem, 
  AppBar, 
  Toolbar
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import Measurements from './pages/measurements/Measurements';
import SoftwareSettingsDialog from './components/SoftwareSettingsDialog';
import RemoteData from './pages/remotedata/RemoteData';

import { TabPanel } from './components/TabPanel';
import { CloseableTab } from './components/CloseableTab';



const App = () => {
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);



  
  // Initial static tabs
  const [staticTabs] = useState([
    { id: 'all', label: 'Все измерения', 
      content: <Measurements />
    },
    {
      id: 'auxdata', label: 'НГДУ', content: <RemoteData />
    },
    { id: 'import', label: 'Импорт из файлов', content: 'Содержимое вкладки Импорт из файлов' },
  ]);
  
  // Dynamic tabs that can be added through dropdown
  const [dynamicTabs, setDynamicTabs] = useState([]);
  
  // Track which special tab types have been opened
  const [openedTabTypes, setOpenedTabTypes] = useState({
    'МИКОН 101': false,
    'СУДОС': false,
    'Сиддос': false
  });

  // All tabs combined
  const allTabs = [...staticTabs, ...dynamicTabs];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddTab = (type) => {
    // Check if this tab type is already open
    if (openedTabTypes[type]) {
      // Find the index of this tab type and switch to it
      const tabIndex = staticTabs.length + dynamicTabs.findIndex(tab => tab.label === type);
      if (tabIndex >= 0) {
        setValue(tabIndex);
      }
    } else {
      // Add new tab and mark it as opened
      const newTab = {
        id: `tab-${type}`,
        label: type,
        content: `Содержимое вкладки ${type}`
      };
      
      setDynamicTabs([...dynamicTabs, newTab]);
      setOpenedTabTypes({ ...openedTabTypes, [type]: true });
      setValue(staticTabs.length + dynamicTabs.length);
    }
    
    handleMenuClose();
  };

  const handleCloseTab = (index) => {
    // Get the actual index in the dynamicTabs array
    const dynamicIndex = index - staticTabs.length;
    if (dynamicIndex >= 0 && dynamicIndex < dynamicTabs.length) {
      const tabToRemove = dynamicTabs[dynamicIndex];
      
      // Create a new array without the closed tab
      const newDynamicTabs = [...dynamicTabs];
      newDynamicTabs.splice(dynamicIndex, 1);
      setDynamicTabs(newDynamicTabs);
      
      // Mark this tab type as not opened
      setOpenedTabTypes({ ...openedTabTypes, [tabToRemove.label]: false });
      
      // Set the value to the previous tab if we're closing the active tab
      if (value === index) {
        // Select the previous tab or the last tab if this was the first dynamic tab
        const newValue = dynamicIndex > 0 
          ? staticTabs.length + dynamicIndex - 1 
          : staticTabs.length - 1;
        setValue(newValue);
      } else if (value > index) {
        // Adjust the selected tab value if we're removing a tab before it
        setValue(value - 1);
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>      
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar disableGutters sx={{ minHeight: '48px' }}>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Tabs 
              value={value} 
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {/* Static tabs without close button */}
              {staticTabs.map((tab, index) => (
                <Tab key={tab.id} label={tab.label} />
              ))}
              
              {/* Dynamic tabs with close button */}
              {dynamicTabs.map((tab, index) => (
                <CloseableTab 
                  key={tab.id} 
                  label={tab.label} 
                  onClose={() => handleCloseTab(staticTabs.length + index)} 
                />
              ))}
              
              {/* "More" tab for the dropdown menu */}
              <Tab 
                icon={<MoreHorizIcon />} 
                aria-haspopup="true"
                onClick={handleMenuOpen}
              />
            </Tabs>
          </Box>
          <SoftwareSettingsDialog />          
        </Toolbar>
      </AppBar>
      
      <Menu
        id="new-tab-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={() => handleAddTab('МИКОН 101')} 
          disabled={openedTabTypes['МИКОН 101']}
        >
          МИКОН 101
        </MenuItem>
        <MenuItem 
          onClick={() => handleAddTab('СУДОС')} 
          disabled={openedTabTypes['СУДОС']}
        >
          СУДОС
        </MenuItem>
        <MenuItem 
          onClick={() => handleAddTab('Сиддос')} 
          disabled={openedTabTypes['Сиддос']}
        >
          Сиддос
        </MenuItem>
      </Menu>

      {allTabs.map((tab, index) => (
        <TabPanel key={tab.id} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default App;