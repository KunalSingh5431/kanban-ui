import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Chip,
  Typography,
  Box,
} from "@mui/material";

export default function AddCardDialog({ open, onClose, columnId, board, setBoard }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [labels, setLabels] = useState([]);
  const [labelInput, setLabelInput] = useState("");

  const priorityColors = {
    High: "error.main",
    Medium: "warning.main",
    Low: "success.main",
  };

  function handleAdd() {
    const id = "card-" + Date.now();
    const newCard = { id, title, description: "", labels, priority, assignees: [] };
    const newCards = { ...board.cards, [id]: newCard };
    const col = {
      ...board.columns[columnId],
      cardIds: [...board.columns[columnId].cardIds, id],
    };
    const newColumns = { ...board.columns, [columnId]: col };
    setBoard({ ...board, cards: newCards, columns: newColumns });
    setTitle("");
    setPriority("Medium");
    setLabels([]);
    onClose();
  }

  function addLabel() {
    if (labelInput.trim() && !labels.includes(labelInput.trim())) {
      setLabels([...labels, labelInput.trim()]);
      setLabelInput("");
    }
  }

  function removeLabel(label) {
    setLabels(labels.filter((l) => l !== label));
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Add New Task</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="medium"
          />

          {/* Priority */}
          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            fullWidth
            size="small"
            sx={{
              "& .MuiSelect-select": {
                color: priorityColors[priority] || "text.primary",
                fontWeight: 600,
              },
            }}
          >
            {["High", "Medium", "Low"].map((p) => (
              <MenuItem key={p} value={p}>
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: priorityColors[p],
                    mr: 1,
                  }}
                />
                {p}
              </MenuItem>
            ))}
          </TextField>

          {/* Labels */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {labels.map((label, i) => (
              <Chip
                key={i}
                label={label}
                size="small"
                color="primary"
                onDelete={() => removeLabel(label)}
              />
            ))}
          </Box>

          <Stack direction="row" spacing={1}>
            <TextField
              placeholder="Add label"
              size="small"
              fullWidth
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addLabel()}
            />
            <Button variant="outlined" onClick={addLabel}>
              Add
            </Button>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!title.trim()}
          onClick={handleAdd}
          sx={{ px: 3 }}
        >
          Add Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}
