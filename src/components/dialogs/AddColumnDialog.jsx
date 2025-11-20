import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function AddColumnDialog({ open, onClose, board, setBoard }) {
  const [title, setTitle] = useState("New Column");

  function handleAdd() {
    const id = "col-" + Date.now();
    const newColumn = { id, title, cardIds: [] };
    const newColumns = { ...board.columns, [id]: newColumn };
    const newOrder = [...board.columnOrder, id];
    setBoard({ ...board, columns: newColumns, columnOrder: newOrder });
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Column</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
