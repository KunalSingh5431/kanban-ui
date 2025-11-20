import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import MuiCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditCardDrawer from "./dialogs/EditCardDrawer";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import dayjs from "dayjs";

export default function CardItem({
  card,
  index,
  board,
  setBoard,
  onCardClick,
}) {
  const [openEdit, setOpenEdit] = useState(false);

  if (!card) return null;

  const priorityColor = (p) => {
    if (!p) return "#E5E7EB"; 
    if (String(p).toLowerCase() === "high") return "#F97316";
    if (String(p).toLowerCase() === "medium") return "#F59E0B";
    if (String(p).toLowerCase() === "low") return "#10B981";
    return "#E5E7EB";
  };

  const handleCardClick = () => {
    if (onCardClick) return onCardClick(card);
    setOpenEdit(true);
  };

  const dueRaw = card.due ?? card.dueDate ?? null;
  const dueText = dueRaw ? dayjs(dueRaw).format("MMM D") : null;

  const draggableId = String(card.id);

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => {
        const providedStyle = provided?.draggableProps?.style || {};
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              marginBottom: 10,
              ...providedStyle,
            }}
          >
            <MuiCard
              variant="outlined"
              onClick={handleCardClick}
              sx={{
                cursor: "pointer",
                borderRadius: 2,
                overflow: "visible",
                transition: "transform 160ms ease, box-shadow 160ms ease",
                boxShadow: snapshot.isDragging
                  ? "0 14px 40px rgba(2,6,23,0.12)"
                  : "0 6px 18px rgba(2,6,23,0.06)",
                "&:hover": { transform: "translateY(-6px)" },
                display: "block",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 6,
                  bgcolor: priorityColor(card.priority),
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                }}
              />

              <CardContent sx={{ p: 1.25, pl: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ pr: 1, flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                      {card.title}
                    </Typography>

                    {card.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          mt: 0.5,
                          fontSize: 13,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {card.description}
                      </Typography>
                    )}

                    <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: "wrap", gap: 0.5 }}>
                      {(card.labels || []).slice(0, 3).map((l, i) => (
                        <Chip
                          key={i}
                          label={l}
                          size="small"
                          sx={{
                            height: 22,
                            fontWeight: 700,
                            bgcolor: "rgba(0,0,0,0.06)",
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenEdit(true);
                    }}
                    aria-label="edit card"
                    sx={{ ml: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {dueText && (
                      <Tooltip title={String(dueRaw)}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {dueText}
                          </Typography>
                        </Box>
                      </Tooltip>
                    )}
                  </Stack>

                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {(card.assignees || []).slice(0, 3).map((a, i) => (
                      <Tooltip key={i} title={a}>
                        <Avatar sx={{ width: 22, height: 22, fontSize: 12 }}>{String(a)[0]}</Avatar>
                      </Tooltip>
                    ))}
                    {(card.assignees || []).length > 3 && (
                      <Avatar sx={{ width: 22, height: 22, fontSize: 12 }}>
                        +{(card.assignees || []).length - 3}
                      </Avatar>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </MuiCard>

            <EditCardDrawer
              open={openEdit}
              onClose={() => setOpenEdit(false)}
              card={card}
              board={board}
              setBoard={setBoard}
            />
          </div>
        );
      }}
    </Draggable>
  );
}
