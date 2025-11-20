import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import CardItem from "./CardItem";
import AddCardDialog from "./dialogs/AddCardDialog";

export default function Column({ column, cards = [], index, board, setBoard, onCardClick }) {
  const [openAddCard, setOpenAddCard] = useState(false);

  // For menu
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteColumn = () => {
    handleMenuClose(); // close the menu first
    const newColumns = { ...board.columns };
    delete newColumns[column.id];
    const newColumnOrder = board.columnOrder.filter((id) => id !== column.id);
    const newCards = { ...board.cards };
    (column.cardIds || []).forEach((cid) => delete newCards[cid]);
    setBoard({
      ...board,
      columns: newColumns,
      columnOrder: newColumnOrder,
      cards: newCards,
    });
  };

  const handleRenameColumn = () => {
    handleMenuClose(); // close the menu first
    const newTitle = prompt("Enter new column name", column.title);
    if (newTitle) {
      setBoard({
        ...board,
        columns: {
          ...board.columns,
          [column.id]: {
            ...column,
            title: newTitle,
          },
        },
      });
    }
  };

  return (
    <Draggable draggableId={String(column.id)} index={index} isDragDisabled={false}>
      {(provided) => (
        <Grid
          item
          sx={{ width: 320, flexShrink: 0 }}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              {...provided.dragHandleProps} // Only header is draggable
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {column.title}
              </Typography>

              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={() => setOpenAddCard(true)}
                  aria-label={`Add card to ${column.title}`}
                  sx={{
                    bgcolor: "primary.light",
                    color: "white",
                    "&:hover": { bgcolor: "primary.main", color: "white" },
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>

                {/* Three-dot menu */}
                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleRenameColumn}>Rename</MenuItem>
                  <MenuItem onClick={handleDeleteColumn}>Delete</MenuItem>
                </Menu>
              </Stack>
            </Box>

            <Droppable droppableId={String(column.id)} type="card" isDropDisabled={false} isCombineEnabled={false}>
              {(providedDrop) => (
                <Box
                  ref={providedDrop.innerRef}
                  {...providedDrop.droppableProps}
                  sx={{ marginTop: 1, minHeight: 60, maxHeight: "60vh", overflowY: "auto" }}
                >
                  {cards.map((card, idx) => (
                    <CardItem
                      key={String(card?.id || `missing-${idx}`)}
                      card={card}
                      index={idx}
                      board={board}
                      setBoard={setBoard}
                      onCardClick={onCardClick}
                    />
                  ))}
                  {providedDrop.placeholder}
                </Box>
              )}
            </Droppable>
          </Paper>

          <AddCardDialog
            open={openAddCard}
            onClose={() => setOpenAddCard(false)}
            columnId={column.id}
            board={board}
            setBoard={setBoard}
          />
        </Grid>
      )}
    </Draggable>
  );
}
