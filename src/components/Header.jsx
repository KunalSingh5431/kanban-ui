import React, { useRef, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const SearchWrapper = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "700px",
  padding: "8px 14px",
  borderRadius: 22,
  background: "rgba(255,255,255,0.95)",
  boxShadow: "0 6px 20px rgba(13, 24, 35, 0.08)",
  transition: "box-shadow 200ms ease, transform 200ms ease",
  "&:focus-within": {
    boxShadow: "0 10px 32px rgba(13,24,35,0.14)",
    transform: "translateY(-1px)",
  },
}));

export default function Header({
  onToggleDrawer,
  onExport,
  onImport,
  onSearchChange,
  onProfile,
}) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    function handleKey(e) {
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function handleChange(v) {
    setQuery(v);
    onSearchChange && onSearchChange(v);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSearchChange && onSearchChange(query);
  }

  function clearSearch() {
    setQuery("");
    onSearchChange && onSearchChange("");
    inputRef.current?.focus();
  }

  function openAccountMenu(e) {
    setAnchorEl(e.currentTarget);
  }
  function closeAccountMenu() {
    setAnchorEl(null);
  }

  function handleProfileClick() {
    closeAccountMenu();
    onProfile && onProfile("profile");
  }

  function handleSettingsClick() {
    closeAccountMenu();
    onProfile && onProfile("settings");
  }

  function handleExportClick() {
    alert("Export: Downloading board JSON (demo).");
    onExport && onExport();
  }

  function handleImportClick() {
    alert("Import: Upload JSON (demo).");
    onImport && onImport();
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(90deg, rgba(255,255,255,0.36), rgba(255,255,255,0.26))",
        borderBottom: "1px solid rgba(18,18,18,0.04)",
        backdropFilter: "blur(6px)",
        py: 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box sx={{ flex: 1 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2.2,
            mr: 3,
          }}
        >
          <SearchWrapper component="form" onSubmit={handleSubmit}>
            <SearchIcon sx={{ opacity: 0.6, mr: 1 }} />
            <InputBase
              inputRef={inputRef}
              placeholder="Search cards, labels... (press /)"
              sx={{
                ml: 0.5,
                flex: 1,
                fontSize: "0.95rem",
              }}
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              inputProps={{ "aria-label": "search cards" }}
            />
            {query ? (
              <IconButton aria-label="clear search" onClick={clearSearch} size="small" sx={{ ml: 0.5 }}>
                <ClearIcon fontSize="small" />
              </IconButton>
            ) : null}
          </SearchWrapper>

          <Tooltip title="Export board (Download JSON)">
            <Button
              onClick={handleExportClick}
              startIcon={<FileDownloadIcon />}
              variant="contained"
              size="medium"
              sx={{
                bgcolor: "#059669",
                color: "white",
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "0 8px 30px rgba(5,153,105,0.12)",
                "&:hover": { bgcolor: "#047857" },
                px: 2,
              }}
            >
              Export
            </Button>
          </Tooltip>

          <Tooltip title="Import board (Upload JSON)">
            <Button
              onClick={handleImportClick}
              startIcon={<FileUploadIcon />}
              variant="contained"
              size="medium"
              sx={{
                bgcolor: "#2563EB",
                color: "white",
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "0 8px 30px rgba(37,99,235,0.12)",
                "&:hover": { bgcolor: "#1E40AF" },
                px: 2,
              }}
            >
              Import
            </Button>
          </Tooltip>

          <Tooltip title="Account">
            <IconButton onClick={openAccountMenu} sx={{ ml: 0.5 }}>
              <Avatar sx={{ width: 38, height: 38, bgcolor: "#6D28D9" }}>KS</Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeAccountMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>My account</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                closeAccountMenu();
                alert("Signed out (demo)");
              }}
            >
              <ListItemText>Sign out</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
