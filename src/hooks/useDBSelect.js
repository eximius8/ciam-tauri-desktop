import { useEffect, useState } from 'react';
import { useDatabase } from '../contexts/dbcontext';


export const useDBSelect = (id, table, key) => {
    const { selectQuery } = useDatabase();
    const [ name, setName] = useState('');
    
    useEffect(() => {
        const loadName = () => {
            selectQuery(`SELECT ${key} FROM ${table} WHERE id = ?`, [id])
                .then((result) => {                  
                    if (result.length > 0) {
                        setName(result[0][key]);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } 
        loadName();
    }, [id, selectQuery]);      

    if (name === '') {
        return id;
    }
    return name;  
}
