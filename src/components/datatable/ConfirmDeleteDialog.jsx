
import { useContext } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { DataTableContext } from '../../contexts/datatablecontexts';

export default function ConfirmDeleteDialog() {
    
    const { selectedstate, deleteConfirmOpenstate, rowsstate } = useContext(DataTableContext);
    const { selected, setSelected } = selectedstate;
    const { deleteConfirmOpen, setDeleteConfirmOpen } = deleteConfirmOpenstate;
    const { rows, setRows } = rowsstate; 

    const confirmDeleteSelected = () => {
        // Delete all selected items
        setRows(rows.filter(row => !selected.includes(row.id)));
        setSelected([]);
        setDeleteConfirmOpen(false);
      };    

    return (
        <Dialog
            open={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Подтвердите удаление
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Вы уверены, что хотите удалить {selected.length} выбранных элементов? Это действие нельзя отменить.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleteConfirmOpen(false)}>Отмена</Button>
                <Button onClick={confirmDeleteSelected} color="error" autoFocus>
                    Удалить
                </Button>
            </DialogActions>
        </Dialog>
    )
}