import React, { useEffect, useState, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
import { initialBoard } from "../mock/mockData";
import useLocalStorage from "../utils/useLocalStorage";
import AddColumnDialog from "./dialogs/AddColumnDialog";
import BoardTopBar from "./BoardTopBar";
import CardModal from "./CardModal";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";

function isValidBoard(b) {
  return (
    b &&
    typeof b === "object" &&
    Array.isArray(b.columnOrder) &&
    typeof b.columns === "object" &&
    typeof b.cards === "object"
  );
}

export default function Board({ searchQuery = "" }) {
  const [board, setBoard] = useLocalStorage("kanban-board", initialBoard);
  const [openAdd, setOpenAdd] = useState(false);
  const [isValid, setIsValid] = useState(() => isValidBoard(board));

  const [viewMode, setViewMode] = useState("board");
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ labels: [], priorities: [] });

  useEffect(() => {
    setIsValid(isValidBoard(board));
  }, [board]);

  useEffect(() => {
    if (typeof searchQuery === "string") setSearchTerm(searchQuery);
  }, [searchQuery]);

  function openCard(card) {
    setActiveCard(card);
    setModalOpen(true);
  }

  function saveCard(updated) {
    const existing = board.cards?.[updated.id] || null;
    const newCards = { ...board.cards, [updated.id]: { ...(existing || {}), ...updated } };

    const statusKey = (updated.status || (existing && existing.status) || "todo").toLowerCase();

    const aliases = {
      todo: ["todo", "to do", "backlog"],
      inprogress: ["in progress", "inprogress", "doing"],
      done: ["done", "completed", "complete"],
    };

    let targetColId = null;
    for (const [colId, col] of Object.entries(board.columns)) {
      const title = (col.title || "").toLowerCase();
      if (aliases.todo.some((a) => title.includes(a)) && statusKey === "todo") { targetColId = colId; break; }
      if (aliases.inprogress.some((a) => title.includes(a)) && statusKey === "inprogress") { targetColId = colId; break; }
      if (aliases.done.some((a) => title.includes(a)) && statusKey === "done") { targetColId = colId; break; }
    }

    if (!targetColId) {
      const order = board.columnOrder || [];
      if (statusKey === "inprogress") targetColId = order[1] || order[0];
      else if (statusKey === "done") targetColId = order[2] || order[order.length - 1] || order[0];
      else targetColId = order[0] || Object.keys(board.columns)[0];
    }

    const newColumns = Object.fromEntries(
      Object.entries(board.columns).map(([colId, col]) => [colId, { ...col, cardIds: col.cardIds.filter((cid) => cid !== updated.id) }])
    );

    if (!newColumns[targetColId].cardIds.includes(updated.id)) {
      newColumns[targetColId] = { ...newColumns[targetColId], cardIds: [...newColumns[targetColId].cardIds, updated.id] };
    }

    setBoard({ ...board, cards: newCards, columns: newColumns });
  }

  function onDragEnd(result) {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;

    try {
      if (type === "column") {
        const newColOrder = Array.from(board.columnOrder);
        newColOrder.splice(source.index, 1);
        newColOrder.splice(destination.index, 0, draggableId);
        setBoard({ ...board, columnOrder: newColOrder });
        return;
      }

      const startCol = board.columns[source.droppableId];
      const finishCol = board.columns[destination.droppableId];
      if (!startCol || !finishCol) return;

      if (startCol === finishCol) {
        const newCardIds = Array.from(startCol.cardIds);
        newCardIds.splice(source.index, 1);
        newCardIds.splice(destination.index, 0, draggableId);
        const newCol = { ...startCol, cardIds: newCardIds };
        setBoard({ ...board, columns: { ...board.columns, [newCol.id]: newCol } });
        return;
      }

      const startCardIds = Array.from(startCol.cardIds);
      startCardIds.splice(source.index, 1);
      const newStart = { ...startCol, cardIds: startCardIds };

      const finishCardIds = Array.from(finishCol.cardIds);
      finishCardIds.splice(destination.index, 0, draggableId);
      const newFinish = { ...finishCol, cardIds: finishCardIds };

      setBoard({ ...board, columns: { ...board.columns, [newStart.id]: newStart, [newFinish.id]: newFinish } });
    } catch (err) {
      console.error("onDragEnd error:", err);
    }
  }

  const knownLabels = useMemo(() => {
    const set = new Set();
    Object.values(board.cards || {}).forEach((c) => (c.labels || []).forEach((l) => set.add(l)));
    return Array.from(set);
  }, [board.cards]);

  const filteredCardsMap = useMemo(() => {
    const cards = { ...board.cards };
    const q = (searchTerm || "").trim().toLowerCase();
    const selLabels = (activeFilters.labels || []).map((x) => String(x).toLowerCase());
    const selPriorities = (activeFilters.priorities || []).map((x) => String(x).toLowerCase());
    const keep = {};

    Object.values(cards).forEach((c) => {
      if (!c) return;
      const status = (c.status || "").toLowerCase();
      if (statusFilter && status !== statusFilter) return;
      if (selPriorities.length) {
        const p = (c.priority || "").toLowerCase();
        if (!selPriorities.includes(p)) return;
      }
      if (selLabels.length) {
        const cardLabels = (c.labels || []).map((x) => String(x).toLowerCase());
        const has = selLabels.some((sl) => cardLabels.includes(sl));
        if (!has) return;
      }
      const text = `${c.title || ""} ${c.description || ""} ${(c.labels || []).join(" ")} ${(c.assignees || []).join(" ")}`.toLowerCase();
      if (q && !text.includes(q)) return;
      keep[c.id] = c;
    });

    return keep;
  }, [board.cards, statusFilter, searchTerm, activeFilters]);

  const filteredBoard = useMemo(() => {
    const newColumns = Object.fromEntries(
      Object.entries(board.columns).map(([colId, col]) => [
        colId,
        { ...col, cardIds: (col.cardIds || []).filter((cid) => Boolean(filteredCardsMap[cid])) },
      ])
    );
    return { ...board, columns: newColumns };
  }, [board, filteredCardsMap]);

  if (!isValid) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Board data missing or corrupted
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          Reset to demo board to continue.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" onClick={() => setBoard(initialBoard)}>
            Reset demo
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <BoardTopBar
        viewMode={viewMode}
        setViewMode={setViewMode}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onSearchChange={(q) => setSearchTerm(q)}
        onFilterChange={(f) => setActiveFilters(f)}
        labels={knownLabels}
        priorityOptions={["High", "Medium", "Low"]}
      />

      <Box sx={{ display: viewMode === "board" ? "block" : "none" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <IconButton color="primary" onClick={() => setOpenAdd(true)}>
            <AddIcon />
          </IconButton>
        </Box>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" direction="horizontal" type="column">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ display: "block", width: "100%" }}
              >
                <Grid container spacing={2} sx={{ overflowX: "auto", pb: 2 }}>
                  {filteredBoard.columnOrder.map((colId, index) => {
                    const column = filteredBoard.columns[colId];
                    const cards = (column?.cardIds || []).map((id) => board.cards?.[id]).filter(Boolean);
                    return (
                      <Column
                        key={column.id}
                        column={column}
                        cards={cards}
                        index={index}
                        board={board}
                        setBoard={setBoard}
                        onCardClick={(card) => openCard(card)}
                      />
                    );
                  })}
                </Grid>

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Box>

      {viewMode === "grid" && (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 2 }}>
          {Object.values(filteredCardsMap).map((card) => (
            <Paper
              key={card.id}
              elevation={3}
              onClick={() => openCard(card)}
              sx={{
                p: 2,
                borderRadius: 2,
                cursor: "pointer",
                transition: "transform 180ms, box-shadow 180ms",
                "&:hover": { transform: "translateY(-6px)", boxShadow: "0 18px 40px rgba(2,6,23,0.12)" },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {card.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75, mb: 1 }}>
                {card.description}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                  {(card.labels || []).slice(0, 3).map((l, i) => (
                    <Chip key={i} label={l} size="small" sx={{ borderRadius: 1 }} />
                  ))}
                </Box>

                <Chip
                  label={card.status ? card.status.toUpperCase() : "TODO"}
                  size="small"
                  sx={{
                    px: 1,
                    fontWeight: 800,
                    borderRadius: 1.5,
                    bgcolor:
                      card.status === "done" ? "success.main" : card.status === "inprogress" ? "warning.main" : "primary.main",
                    color: "white",
                  }}
                />
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {viewMode === "list" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {Object.values(filteredCardsMap).map((card) => (
            <Paper
              key={card.id}
              elevation={1}
              onClick={() => openCard(card)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": { boxShadow: "0 12px 30px rgba(2,6,23,0.08)" },
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {card.description}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>{(card.labels || []).map((l, i) => <Chip key={i} label={l} size="small" />)}</Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {(card.due || "")}
                </Typography>

                <Chip
                  label={card.status ? card.status.toUpperCase() : "TODO"}
                  size="small"
                  sx={{
                    px: 1,
                    fontWeight: 800,
                    borderRadius: 1.5,
                    bgcolor:
                      card.status === "done" ? "success.main" : card.status === "inprogress" ? "warning.main" : "primary.main",
                    color: "white",
                  }}
                />
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <AddColumnDialog open={openAdd} onClose={() => setOpenAdd(false)} board={board} setBoard={setBoard} />
      <CardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        card={activeCard}
        onSave={(updated) => {
          saveCard(updated);
          setModalOpen(false);
        }}
        labelOptions={[].concat(...Object.values(board.cards).map((c) => c.labels || [])).filter(Boolean)}
      />
    </Box>
  );
}
