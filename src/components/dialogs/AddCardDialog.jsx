import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';


export default function AddCardDialog({ open, onClose, columnId, board, setBoard }) {
const [title, setTitle] = useState('');
const [priority, setPriority] = useState('Medium');


function handleAdd() {
const id = 'card-' + Date.now();
const newCard = { id, title, description:'', labels:[], priority, assignees:[] };
const newCards = { ...board.cards, [id]: newCard };
const col = { ...board.columns[columnId], cardIds: [...board.columns[columnId].cardIds, id] };
const newColumns = { ...board.columns, [columnId]: col };
setBoard({ ...board, cards: newCards, columns: newColumns });
onClose();
}


return (
<Dialog open={open} onClose={onClose} fullWidth>
<DialogTitle>Add Card</DialogTitle>
<DialogContent>
<TextField label="Title" fullWidth value={title} onChange={(e)=>setTitle(e.target.value)} sx={{ mt:1 }} />
<TextField select label="Priority" value={priority} onChange={(e)=>setPriority(e.target.value)} sx={{ mt:2 }} fullWidth>
<MenuItem value="High">High</MenuItem>
<MenuItem value="Medium">Medium</MenuItem>
<MenuItem value="Low">Low</MenuItem>
</TextField>
</DialogContent>
<DialogActions>
<Button onClick={onClose}>Cancel</Button>
<Button variant="contained" disabled={!title.trim()} onClick={handleAdd}>Add</Button>
</DialogActions>
</Dialog>
);
}