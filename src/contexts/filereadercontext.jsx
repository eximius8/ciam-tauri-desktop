import { createContext, useContext, useReducer } from 'react';


function measurementreducer(state, action) {
    
    switch (action.type) {
      case 'add':{
          let index = state.findIndex((item) => item.id === action.item.id);
        if (index === -1) {
            return [...state, action.item];
        }else {
            return state
        } }       
      case 'delete':
        return state.filter(item => item.id !== action.id);
      case 'update':
        return state.map(item => (item.id === action.id ? action.item : item));
      default:
        return state;
    }  
}


function selectedreducer(state, action) {
  switch (action.type) {
    case 'add':{
        let index = state.findIndex((id) => id === action.id);
      if (index === -1) {
          return [...state, action.id];
      }else {
          return state
      } }       
    case 'delete':
      return state.filter(id => id !== action.id);
    case 'clear':
      return []; 
    default:
      return state;
  }
}

export const FRContext = createContext();

// Custom hook to use the auth context
export const useFileReader = () => {
  const context = useContext(FRContext);
  if (!context) {
    throw new Error('useFileReader must be used within an FRProvider');
  }
  return context;
};

export const FRProvider = props => {
    const [ measurements, measurementsDispatch ] = useReducer(measurementreducer, []);
    const [ selected, selectedDispatch ] = useReducer(selectedreducer, []);  

   
    const updateMeasurements = (updatedmeasurements) => {
      updatedmeasurements.forEach(measurement => {
        measurementsDispatch({ type: 'update', id: measurement.id, item: measurement })      
      });
    }

    const addSelected = (id) => {
      selectedDispatch({ type: 'add', id: id });
    }

    const selectAll = (yes) => {
      if (yes) {
        measurements.forEach(measurement => {
          selectedDispatch({ type: 'add', id: measurement.id });
        });        
        return;
      }
      selectedDispatch({ type: 'clear'});      
    }

    const removeSelected = (id) => {
      selectedDispatch({ type: 'delete', id: id });
    }
    
    const value = {
      measurements, 
      measurementsDispatch, 
      updateMeasurements, 
      selected, 
      addSelected, 
      selectAll, 
      removeSelected
    };     
  
    return (
      <FRContext.Provider
        value={value}
      >
        {props.children}
      </FRContext.Provider>
    );
  };