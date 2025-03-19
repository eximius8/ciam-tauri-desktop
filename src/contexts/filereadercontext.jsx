import { createContext, useContext, useReducer } from 'react';


function reducer(state, action) {
    
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
    const [items, dispatch] = useReducer(reducer, []);    

    const value = {
        items, dispatch
    };     
  
    return (
      <FRContext.Provider
        value={value}
      >
        {props.children}
      </FRContext.Provider>
    );
  };