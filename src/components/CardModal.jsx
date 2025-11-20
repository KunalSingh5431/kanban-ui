import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Chip,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Paper
} from "@mui/material";

export default function CardModal({
  open,
  onClose,
  card = null,
  onSave,
  labelOptions = [],
  priorityOptions = ["High", "Medium", "Low"],
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [labels, setLabels] = useState([]);
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("todo");
  const [due, setDue] = useState("");
  const labelInputRef = useRef(null);

  useEffect(() => {
    if (card) {
      setTitle(card.title || "");
      setDescription(card.description || "");
      setLabels(card.labels ? [...card.labels] : []);
      setPriority(card.priority || "");
      setStatus((card.status || "todo").toLowerCase());
      setDue(card.due || "");
    } else {
      setTitle("");
      setDescription("");
      setLabels([]);
      setPriority("");
      setStatus("todo");
      setDue("");
    }
  }, [card, open]);

  const addLabelsFromString = (str) => {
    if (!str) return;
    const parts = str
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length) setLabels((prev) => Array.from(new Set([...prev, ...parts])));
  };

  const handleLabelKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value) addLabelsFromString(value);
      e.target.value = "";
    } else if (e.key === "Escape") e.target.blur();
  };

  const handleLabelBlur = (e) => {
    const value = (e.target.value || "").trim();
    if (value) {
      addLabelsFromString(value);
      e.target.value = "";
    }
  };

  const handleRemoveLabel = (l) => setLabels((s) => s.filter((x) => x !== l));

  const handleSave = () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    const payload = {
      id: card?.id || `card-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      labels: labels.filter(Boolean),
      priority: priority || "",
      status: status || "todo",
      due: due || null,
    };
    onSave && onSave(payload);
    onClose && onClose();
  };

  return (
    <Dialog open={Boolean(open)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 22, bgcolor: "primary.main", color: "white", px: 3, py: 1.5, borderRadius: "8px 8px 0 0" }}>
        {card ? "Edit Card" : "Add Card"}
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2 }}>
        <Stack spacing={2}>
          {/* Title */}
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            autoFocus
            required
            size="medium"
            sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }}
          />

          {/* Description */}
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={4}
            size="medium"
            sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }}
          />

          {/* Labels */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Labels — press Enter or comma to add. Click chip to remove.
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
              {labels.map((l) => (
                <Chip key={l} label={l} color="primary" onDelete={() => handleRemoveLabel(l)} />
              ))}
            </Box>
            <TextField
              placeholder="Add label..."
              inputRef={labelInputRef}
              onKeyDown={handleLabelKeyDown}
              onBlur={handleLabelBlur}
              fullWidth
              size="small"
              sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }}
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Priority & Status */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {priorityOptions.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ width: "100%" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Status
              </Typography>
              <ToggleButtonGroup
                value={status}
                exclusive
                onChange={(e, v) => v && setStatus(v)}
                size="small"
                sx={{
                  "& .MuiToggleButton-root": { textTransform: "none", px: 3, borderRadius: 2 },
                  "& .Mui-selected": {
                    color: "white",
                    background: (theme) =>
                      status === "todo"
                        ? theme.palette.info.main
                        : status === "inprogress"
                        ? theme.palette.warning.main
                        : theme.palette.success.main,
                  },
                }}
              >
                <ToggleButton value="todo">To Do</ToggleButton>
                <ToggleButton value="inprogress">In Progress</ToggleButton>
                <ToggleButton value="done">Completed</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>

          {/* Due Date */}
          <TextField
            label="Due date"
            type="date"
            value={due || ""}
            onChange={(e) => setDue(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
            sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ borderRadius: 2 }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
