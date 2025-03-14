import { createContext, useState, useEffect } from 'react';
import Database from '@tauri-apps/plugin-sql';

export const DBContext = createContext();


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

    const value = {
        db,
        isDBLoading,
        selectQuery     
    };    
    
  
    return (
      <DBContext.Provider
        value={value}
      >
        {props.children}
      </DBContext.Provider>
    );
  };