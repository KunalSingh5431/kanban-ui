import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Drawer,
  MenuItem,
  Chip,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

export default function EditCardDrawer({ open, onClose, card, board, setBoard }) {
  const [local, setLocal] = useState(card || {});
  const [labelInput, setLabelInput] = useState("");

  useEffect(() => setLocal(card || {}), [card]);

  if (!card) return null;

  const priorityOptions = ["High", "Medium", "Low"];

  function handleSave() {
    const newCards = {
      ...board.cards,
      [card.id]: { ...board.cards[card.id], ...local },
    };
    setBoard({ ...board, cards: newCards });
    onClose();
  }

  function handleDelete() {
    const newCards = { ...board.cards };
    delete newCards[card.id];
    const newColumns = { ...board.columns };
    Object.values(newColumns).forEach((col) => {
      col.cardIds = col.cardIds.filter((id) => id !== card.id);
    });
    setBoard({ ...board, cards: newCards, columns: newColumns });
    onClose();
  }

  function addLabel() {
    if (labelInput.trim() && !(local.labels || []).includes(labelInput.trim())) {
      setLocal({ ...local, labels: [...(local.labels || []), labelInput.trim()] });
      setLabelInput("");
    }
  }

  function removeLabel(label) {
    setLocal({ ...local, labels: (local.labels || []).filter((l) => l !== label) });
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 450, p: 4, bgcolor: "background.paper", display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Edit Task
        </Typography>

        {/* Title */}
        <TextField
          fullWidth
          label="Title"
          value={local.title || ""}
          onChange={(e) => setLocal({ ...local, title: e.target.value })}
          sx={{ mb: 2 }}
          size="medium"
        />

        {/* Description */}
        <TextField
          multiline
          rows={5}
          fullWidth
          label="Description"
          value={local.description || ""}
          onChange={(e) => setLocal({ ...local, description: e.target.value })}
          sx={{ mb: 2 }}
          size="medium"
        />

        {/* Priority */}
        <TextField
          select
          label="Priority"
          value={local.priority || ""}
          onChange={(e) => setLocal({ ...local, priority: e.target.value })}
          sx={{ mb: 2 }}
          size="small"
        >
          {priorityOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        {/* Labels */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {(local.labels || []).map((label, i) => (
            <Chip
              key={i}
              label={label}
              onDelete={() => removeLabel(label)}
              color="primary"
              size="small"
            />
          ))}
        </Box>

        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            placeholder="Add label"
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addLabel()}
            fullWidth
          />
          <Button variant="contained" onClick={addLabel}>
            Add
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            color="error"
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
