import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Drawer } from "@mui/material";

export default function EditCardDrawer({
  open,
  onClose,
  card,
  board,
  setBoard,
}) {
  const [local, setLocal] = useState(card || {});

  useEffect(() => setLocal(card || {}), [card]);

  if (!card) return null;

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

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {local.title}
        </Typography>

        <TextField
          fullWidth
          label="Title"
          value={local.title || ""}
          onChange={(e) => setLocal({ ...local, title: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          multiline
          rows={4}
          fullWidth
          label="Description"
          value={local.description || ""}
          onChange={(e) => setLocal({ ...local, description: e.target.value })}
          sx={{ mb: 2 }}
        />

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button variant="outlined" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
