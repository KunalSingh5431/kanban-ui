import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import SideDrawer from "./components/SideDrawer";
import Header from "./components/Header";
import Board from "./components/Board";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function Home() {
  return (
    <Box sx={{ p: 2 }}>
      <h2>Welcome</h2>
      <p>Overview / Quick stats here.</p>
    </Box>
  );
}
function Activity() {
  return (
    <Box sx={{ p: 2 }}>
      <h2>Activity</h2>
      <p>Activity feed & logs.</p>
    </Box>
  );
}
function Settings() {
  return (
    <Box sx={{ p: 2 }}>
      <h2>Settings</h2>
      <p>Workspace and user settings.</p>
    </Box>
  );
}
function Profile() {
  return (
    <Box sx={{ p: 2 }}>
      <h2>My Profile</h2>
      <p>Profile details, avatar, contact info, etc.</p>
    </Box>
  );
}

const DRAWER_WIDTH = 270;

export default function App() {
  const [drawerOpen] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const handleExport = () => {
    try {
      const board = JSON.parse(localStorage.getItem("kanban-board") || "{}");
      const blob = new Blob([JSON.stringify(board, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kanban-board.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed: invalid board data");
      console.error(err);
    }
  };

  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!data || typeof data !== "object" || !Array.isArray(data.columnOrder) || !data.columns || !data.cards) {
          throw new Error("Invalid board JSON structure");
        }
        localStorage.setItem("kanban-board", JSON.stringify(data));
        window.location.replace(window.location.pathname);
      } catch (err) {
        alert("Invalid JSON file — import failed.");
        console.error(err);
      }
    };
    input.click();
  };

  const handleProfile = (which) => {
    if (which === "profile") {
      window.location.href = "/profile";
    } else if (which === "settings") {
      window.location.href = "/settings";
    } else {
      console.log("profile action:", which);
    }
  };

  return (
    <BrowserRouter>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <SideDrawer activity={["Created card: Design hero", "Moved payment card"]} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: `${DRAWER_WIDTH}px`,
            bgcolor: "#f6f8fb",
            minHeight: "100vh",
          }}
        >
          <Header
            onExport={() => {
              alert("Exporting board (demo) — actual download will start.");
              handleExport();
            }}
            onImport={() => {
              alert("Importing board (demo) — select a JSON file.");
              handleImport();
            }}
            onSearchChange={(q) => setSearchQuery(q)}
            onProfile={handleProfile}
          />

          <Container maxWidth="lg" sx={{ mt: 3 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/board" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/board" element={<Board searchQuery={searchQuery} />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="*" element={<Box sx={{ p: 4 }}>Page not found</Box>} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </BrowserRouter>
  );
}
