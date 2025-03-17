import { createContext, useState, useEffect, useContext } from 'react';
import Database from '@tauri-apps/plugin-sql';


export const DBContext = createContext();


// Custom hook to use the auth context
export const useDatabase = () => {
  const context = useContext(DBContext);
  if (!context) {
    throw new Error('useDatabase must be used within an DBProvider');
  }
  return context;
};

export const DBProvider = props => {
    const [db, setDb] = useState("");
    const [isDBLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadDB() {
          const database = await Database.load('sqlite:ciam.db');
          setDb(database);          
        }
        loadDB();
        setIsLoading(false);
    },[]);

    const selectQuery = async (query, params) => {
        if (!isDBLoading) {
            return await db.select(query, params)
        }
        return [];
    };

    const executeQuery = async (query, params) => {
        if (!isDBLoading) {
          try {
            return await db.execute(query, params)
          }
          catch (error) {console.error(error);}
        }
        return [];
    };

    const clearDB = async () => {
      await executeQuery('DELETE FROM measurements; DELETE FROM well; DELETE FROM workshop; DELETE FROM ngdu');      
    }

    const value = {
        db,
        isDBLoading,
        selectQuery,
        executeQuery,
        clearDB,
    };    
    
  
    return (
      <DBContext.Provider
        value={value}
      >
        {props.children}
      </DBContext.Provider>
    );
  };