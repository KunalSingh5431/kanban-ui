import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import AppsIcon from "@mui/icons-material/Apps";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";

const STATUS = [
  { id: "todo", label: "To Do", color: "primary" },
  { id: "inprogress", label: "In Progress", color: "warning" },
  { id: "done", label: "Completed", color: "success" },
];

export default function BoardTopBar({
  viewMode,
  setViewMode,
  statusFilter,
  setStatusFilter,
  onSearchChange,
  onFilterChange, 
  labels = [],
  priorityOptions = ["High", "Medium", "Low"],
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus && inputRef.current.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const normalize = (s) => String(s || "").trim();

  useEffect(() => {
    const payload = {
      labels: selectedLabels.map(normalize),
      priorities: selectedPriorities.map(normalize),
    };

    console.debug("BoardTopBar: applyFilters auto ->", payload);
    onFilterChange && onFilterChange(payload);
  }, [selectedLabels, selectedPriorities, onFilterChange]);

  function openMenu(e) {
    setAnchorEl(e.currentTarget);
  }
  function closeMenu() {
    setAnchorEl(null);
  }

  function toggleLabel(label) {
    setSelectedLabels((s) => (s.includes(label) ? s.filter((x) => x !== label) : [...s, label]));
  }
  function togglePriority(pr) {
    setSelectedPriorities((s) => (s.includes(pr) ? s.filter((x) => x !== pr) : [...s, pr]));
  }

  function clearFilters() {
    setSelectedLabels([]);
    setSelectedPriorities([]);
    closeMenu();
  }

  function applyFilters() {
    const payload = { labels: selectedLabels.map(normalize), priorities: selectedPriorities.map(normalize) };
    onFilterChange && onFilterChange(payload);
    console.debug("BoardTopBar: applyFilters ->", payload);
    closeMenu();
  }

  return (
    <Box
      sx={{
        mb: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, v) => v && setViewMode(v)}
          size="small"
          aria-label="view mode"
          sx={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 9999,
            boxShadow: "0 6px 18px rgba(13,24,35,0.06)",
            overflow: "hidden",
            "& .MuiToggleButton-root": {
              border: "none",
              borderRadius: 9999,
              px: 1.75,
              textTransform: "none",
            },
            "& .Mui-selected": {
              background: "linear-gradient(90deg,#6366F1,#3B82F6) !important",
              color: "white !important",
              boxShadow: "0 8px 30px rgba(59,130,246,0.12)",
            },
          }}
        >
          <ToggleButton value="board" aria-label="board view">
            <AppsIcon sx={{ mr: 0.5 }} />
            <Typography variant="button" sx={{ fontSize: 13 }}>
              Board
            </Typography>
          </ToggleButton>

          <ToggleButton value="grid" aria-label="grid view">
            <ViewModuleIcon sx={{ mr: 0.5 }} />
            <Typography variant="button" sx={{ fontSize: 13 }}>
              Grid
            </Typography>
          </ToggleButton>

          <ToggleButton value="list" aria-label="list view">
            <ViewListIcon sx={{ mr: 0.5 }} />
            <Typography variant="button" sx={{ fontSize: 13 }}>
              List
            </Typography>
          </ToggleButton>
        </ToggleButtonGroup>

        <Stack direction="row" spacing={1} sx={{ ml: 1 }}>
          {STATUS.map((s) => {
            const active = statusFilter === s.id;
            const bg =
              s.id === "todo"
                ? "linear-gradient(90deg,#7c3aed,#60a5fa)"
                : s.id === "inprogress"
                ? "linear-gradient(90deg,#f59e0b,#fb923c)"
                : "linear-gradient(90deg,#10b981,#059669)";
            return (
              <Chip
                key={s.id}
                label={s.label}
                clickable
                onClick={() => setStatusFilter(active ? null : s.id)}
                variant={active ? "filled" : "outlined"}
                sx={{
                  borderRadius: 9999,
                  px: 1.25,
                  fontWeight: 800,
                  color: active ? "white" : "text.primary",
                  background: active ? bg : undefined,
                  boxShadow: active ? "0 10px 30px rgba(15,23,42,0.08)" : "none",
                }}
              />
            );
          })}
        </Stack>
      </Box>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Tooltip title="Open filters">
          <IconButton onClick={openMenu} sx={{ bgcolor: "rgba(13,24,35,0.03)" }}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
          <Box sx={{ p: 2, minWidth: 320 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 800 }}>
              Filters
            </Typography>

            <Typography variant="caption" sx={{ display: "block", mb: 1, color: "text.secondary" }}>
              Labels
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
              {labels.length ? (
                labels.map((l) => (
                  <Chip
                    key={l}
                    label={l}
                    onClick={() => toggleLabel(l)}
                    color={selectedLabels.includes(l) ? "primary" : "default"}
                    variant={selectedLabels.includes(l) ? "filled" : "outlined"}
                    sx={{ cursor: "pointer", borderRadius: 9999 }}
                  />
                ))
              ) : (
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  No labels
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 1 }} />

            <Typography variant="caption" sx={{ display: "block", mb: 1, color: "text.secondary" }}>
              Priority
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {priorityOptions.map((p) => (
                <FormControlLabel
                  key={p}
                  control={<Checkbox checked={selectedPriorities.includes(p)} onChange={() => togglePriority(p)} />}
                  label={p}
                />
              ))}
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button size="small" onClick={clearFilters}>
                Clear
              </Button>
              <Button variant="contained" size="small" onClick={applyFilters}>
                Apply
              </Button>
            </Box>
          </Box>
        </Menu>
      </Box>
    </Box>
  );
}
