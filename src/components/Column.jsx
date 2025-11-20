import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";

import CardItem from "./CardItem";
import AddCardDialog from "./dialogs/AddCardDialog";

export default function Column({ column, cards = [], index, board, setBoard, onCardClick }) {
  const [openAddCard, setOpenAddCard] = useState(false);

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
            {/* Column Header */}
            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              {...provided.dragHandleProps}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {column.title}
              </Typography>

              {/* Add Card Button */}
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
              </Stack>
            </Box>

            {/* Cards List */}
            <Droppable
              droppableId={String(column.id)}
              type="card"
              isDropDisabled={false}
              isCombineEnabled={false}
            >
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

          {/* Add Card Dialog */}
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
