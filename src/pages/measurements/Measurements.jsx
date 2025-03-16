import DataTable from './DataTable';
import { DataTableProvider } from '../../contexts/datatablecontexts';


export default function Measurements(){

    return (
        <DataTableProvider>
            <DataTable />
        </DataTableProvider> 
    )
}