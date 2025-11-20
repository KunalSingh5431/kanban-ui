import React, { useMemo } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";

import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TimelineIcon from "@mui/icons-material/Timeline";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import LabelIcon from "@mui/icons-material/Label";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExtensionIcon from "@mui/icons-material/Extension";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { NavLink } from "react-router-dom";

const DRAWER_WIDTH = 270;

export default function SideDrawer({ activity = [] }) {
  const items = useMemo(
    () => [
      { id: "home", label: "Home", icon: <HomeIcon />, to: "/" },
      { id: "board", label: "Board", icon: <DashboardIcon />, to: "/board" },
    ],
    [activity]
  );

  return (
    <Drawer
      variant="permanent"
      open
      PaperProps={{
        sx: {
          width: DRAWER_WIDTH,
          background:
            "linear-gradient(180deg, rgba(45, 0, 255, 0.95) 0%, rgba(59,130,246,0.95) 60%)",
          bgcolor: "#3B82F6",
          color: "white",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 12px 40px rgba(2,6,23,0.18)",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column", px: 2, py: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Avatar
            sx={{
              bgcolor: "#fff",
              color: "#3B82F6",
              width: 52,
              height: 52,
              fontWeight: 900,
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
            }}
          >
            KS
          </Avatar>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1, color: "rgba(255,255,255,0.98)" }}>
              Kanban-Board
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.95, color: "rgba(255,255,255,0.9)" }}>
              Creative workspace
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mb: 1 }} />

        <List disablePadding>
          {items.map((it) => (
            <ListItem key={it.id} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                component={NavLink}
                to={it.to}
                sx={{
                  px: 1.25,
                  borderRadius: 1.25,
                  color: "rgba(255,255,255,0.95)",
                  "& .MuiListItemIcon-root": { color: "rgba(255,255,255,0.9)" },
                  "&.active": {
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
                    "& .MuiListItemIcon-root": { color: "#fff" },
                    "& .MuiListItemText-primary": { fontWeight: 900, color: "white" },
                    transform: "translateX(2px)",
                    boxShadow: "inset 4px 0 0 rgba(255,255,255,0.08)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {it.badge ? <Badge badgeContent={it.badge} color="secondary">{it.icon}</Badge> : it.icon}
                </ListItemIcon>

                <ListItemText
                  primary={it.label}
                  sx={{
                    "& .MuiListItemText-primary": { color: "white", fontWeight: 700 },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ flex: 1 }} />

        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.95)", mb: 1, fontWeight: 800 }}>
            Recent activity
          </Typography>

          <Box sx={{ display: "grid", gap: 0.5 }}>
            {activity.slice(0, 6).map((a, i) => (
              <Typography
                key={i}
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.92)",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "white", opacity: 0.9 }} />
                {a}
              </Typography>
            ))}

            {!activity.length && (
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
                No recent activity
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: "auto", pt: 2 }}>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
            Kunal Singh
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
