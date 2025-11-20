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
import CardItem from "./CardItem";
import AddCardDialog from "./dialogs/AddCardDialog";

export default function Column({ column, cards = [], index, board, setBoard, onCardClick }) {
  const [openAddCard, setOpenAddCard] = useState(false);

  function handleDeleteColumn() {
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
  }

  return (
    <Draggable draggableId={String(column.id)} index={index}>
      {(provided) => (
        <Grid
          item
          sx={{ width: 320 }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {column.title}
              </Typography>

              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={() => setOpenAddCard(true)}
                  aria-label={`Add card to ${column.title}`}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => {}}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>

           
            <Droppable droppableId={String(column.id)} type="card">
              {(providedDrop, snapshotDrop) => (
                <div
                  ref={providedDrop.innerRef}
                  {...providedDrop.droppableProps}
                  style={{
                    marginTop: 8,
                    minHeight: 60,
                    maxHeight: "60vh",
                    overflowY: "auto",
                  }}
                >
                  
                  {cards.map((card, idx) => (
                    <CardItem
                      key={card?.id || `missing-${idx}`}
                      card={card}
                      index={idx}
                      board={board}
                      setBoard={setBoard}
                      onCardClick={onCardClick}
                    />
                  ))}

                  {providedDrop.placeholder}
                </div>
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
