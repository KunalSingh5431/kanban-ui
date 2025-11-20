import React, { useEffect, useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Divider from "@mui/material/Divider";

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

  function addLabelsFromString(str) {
    if (!str) return;
    const parts = str
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length) {
      setLabels((prev) => Array.from(new Set([...prev, ...parts])));
    }
  }

  function handleLabelKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value) {
        addLabelsFromString(value);
        e.target.value = "";
      }
    } else if (e.key === "Escape") {
      e.target.blur();
    }
  }

  function handleLabelBlur(e) {
    const value = (e.target.value || "").trim();
    if (value) {
      addLabelsFromString(value);
      e.target.value = "";
    }
  }

  function handleRemoveLabel(l) {
    setLabels((s) => s.filter((x) => x !== l));
  }

  function handleSave() {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    const normStatus = (status || "todo").toLowerCase();
    const payload = {
      id: card?.id || `card-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      labels: labels.filter(Boolean),
      priority: priority || "",
      status: normStatus,
      due: due || null,
    };

    onSave && onSave(payload);
    onClose && onClose();
  }

  return (
    <Dialog open={Boolean(open)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>{card ? "Edit card" : "Add card"}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            autoFocus
            required
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />

          <Box>
            <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
              Labels — press Enter or comma (, ) to add. Click chip to remove.
            </Typography>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap", mb: 1 }}>
              {labels.map((l) => (
                <Chip key={l} label={l} onDelete={() => handleRemoveLabel(l)} />
              ))}
            </Box>

            <TextField
              placeholder="Type label and press Enter"
              inputRef={labelInputRef}
              onKeyDown={handleLabelKeyDown}
              onBlur={handleLabelBlur}
              fullWidth
              size="small"
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value)}
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
              <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
                Status
              </Typography>

              <ToggleButtonGroup
                value={status}
                exclusive
                onChange={(e, v) => v && setStatus(v)}
                size="small"
                sx={{
                  borderRadius: 9999,
                  "& .MuiToggleButton-root": {
                    textTransform: "none",
                    borderRadius: 9999,
                    px: 2,
                  },
                  "& .Mui-selected": {
                    boxShadow: "0 8px 30px rgba(59,130,246,0.08)",
                    color: "white",
                    background: (theme) =>
                      status === "todo"
                        ? "linear-gradient(90deg,#7c3aed,#60a5fa)"
                        : status === "inprogress"
                        ? "linear-gradient(90deg,#f59e0b,#fb923c)"
                        : "linear-gradient(90deg,#10b981,#059669)",
                  },
                }}
              >
                <ToggleButton value="todo">To Do</ToggleButton>
                <ToggleButton value="inprogress">In Progress</ToggleButton>
                <ToggleButton value="done">Completed</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>

          <TextField
            label="Due date"
            type="date"
            value={due || ""}
            onChange={(e) => setDue(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
