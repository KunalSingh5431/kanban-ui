import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function SidebarTitle({ collapsed = false }) {
  if (!collapsed) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        pl: 2,
        pr: 2,
        mt:2.1,
        ml:15,
        height: 64,
        borderBottom: "1px solid rgba(0,0,0,0.04)",
        background: "transparent",
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Kanban — Material UI
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Workspace
        </Typography>
      </Box>
    </Box>
  );
}
