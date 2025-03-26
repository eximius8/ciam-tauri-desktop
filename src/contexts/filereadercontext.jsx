import { createContext, useContext, useReducer } from 'react';
import { useDatabase } from './dbcontext';

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
        return state.map(item => (item.id === action.id ? {...item, ...action.item} : item));
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
    const { selectQuery, executeQuery } = useDatabase();


    const saveSelectedToDB = async () => {
      if (selected.length === 0) return;
      const selectedMeasurements = measurements.filter(obj => selected.includes(obj.id)); 
      for (const m of selectedMeasurements) {
        await executeQuery(
          'INSERT OR REPLACE INTO measurements' + 
          '(id, creationdtm, source, ngdu_id, mtype, operator, bush, type_hr,' +
          'workshop_id, well_id, mdt, meta, device_meta, dataArray)' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
          [ m.id, m.creationdtm, m.source, m.ngdu, m.mtype, m.operator, '', m.type_hr,
            m.workshop, m.well, m.mdt, '', m.device_meta, m.dataArray
          ]
        );
      }      
    }    
    
    const checkSelected = async () => {
      if (selected.length === 0) return;
      const selectedMeasurements = measurements.filter(obj => selected.includes(obj.id));      
      const allValid = selectedMeasurements.every(obj => obj.ngdu !== null && obj.ngdu !== '');
      if (!allValid) return;
      const propertyValues = new Set(selectedMeasurements.map(obj => obj.ngdu));
      const placeholders = Array.from(propertyValues, x => `"${x}"`).join(',');
      const query = `SELECT COUNT(*) FROM ngdu WHERE id IN (${placeholders})`;
      const result = await selectQuery(query, Array.from(propertyValues));
      return result[0]['COUNT(*)'] === propertyValues.size;
  }
   
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

    const updateMeasurementsFromSelected = (ngdu, workshop, well) => {
      selected.forEach(id => {
        measurementsDispatch({ type: 'update', id: id, item: {ngdu, workshop, well} })   
      })
    }

    const removeSelectedMeasurements = () => {
      selected.forEach(id => {
        measurementsDispatch({ type: 'delete', id: id });
      })
      selectedDispatch({ type: 'clear'});      
    }
    
    const value = {
      measurements, 
      measurementsDispatch, 
      updateMeasurements, 
      selected, 
      addSelected, 
      selectAll, 
      removeSelected,
      updateMeasurementsFromSelected,
      removeSelectedMeasurements,
      checkSelected, 
      saveSelectedToDB
    };     
  
    return (
      <FRContext.Provider
        value={value}
      >
        {props.children}
      </FRContext.Provider>
    );
  };