import FileBrowser from './FileBrowser';
import { FRProvider } from '../../contexts/filereadercontext';


export default function FileReader(){
    
        return (
            <FRProvider>
                <FileBrowser />
            </FRProvider> 
        )
    }