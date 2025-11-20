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

function getStatusFromColumnTitle(title = "", columnIndex = 0) {
  const t = String(title || "").toLowerCase();
  if (!t) {
    if (columnIndex === 0) return "todo";
    if (columnIndex === 1) return "inprogress";
    return "done";
  }

  if (["todo", "to do", "backlog"].some(a => t.includes(a))) return "todo";
  if (["in progress", "inprogress", "doing"].some(a => t.includes(a))) return "inprogress";
  if (["done", "completed", "complete"].some(a => t.includes(a))) return "done";

  if (t.includes("todo") || t.includes("to-do")) return "todo";
  if (t.includes("progress") || t.includes("inprogress") || t.includes("doing")) return "inprogress";
  if (t.includes("done") || t.includes("complete") || t.includes("finished")) return "done";

  if (columnIndex === 0) return "todo";
  if (columnIndex === 1) return "inprogress";
  return "done";
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
      Object.entries(board.columns).map(([colId, col]) => [colId, { ...col, cardIds: (col.cardIds || []).filter((cid) => cid !== updated.id) }])
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
        const newColOrder = Array.from(board.columnOrder || []);
        newColOrder.splice(source.index, 1);
        newColOrder.splice(destination.index, 0, draggableId);
        setBoard({ ...board, columnOrder: newColOrder });
        return;
      }

      const startCol = board.columns?.[source?.droppableId];
      const finishCol = board.columns?.[destination?.droppableId];
      if (!startCol || !finishCol) return;

      if (startCol === finishCol) {
        const newCardIds = Array.from(startCol.cardIds || []);
        newCardIds.splice(source.index, 1);
        newCardIds.splice(destination.index, 0, draggableId);
        const newCol = { ...startCol, cardIds: newCardIds };
        setBoard({ ...board, columns: { ...(board.columns || {}), [newCol.id]: newCol } });
        return;
      }

      const startCardIds = Array.from(startCol.cardIds || []);
      startCardIds.splice(source.index, 1);
      const newStart = { ...startCol, cardIds: startCardIds };

      const finishCardIds = Array.from(finishCol.cardIds || []);
      finishCardIds.splice(destination.index, 0, draggableId);
      const newFinish = { ...finishCol, cardIds: finishCardIds };

      const colOrder = board.columnOrder || Object.keys(board.columns || {});
      const destIndex = colOrder.indexOf(finishCol.id);
      const newStatus = getStatusFromColumnTitle(finishCol.title, destIndex);

      const updatedCard = { ...(board.cards?.[draggableId] || {}), status: newStatus };

      setBoard({
        ...board,
        cards: { ...(board.cards || {}), [draggableId]: updatedCard },
        columns: { ...(board.columns || {}), [newStart.id]: newStart, [newFinish.id]: newFinish },
      });
    } catch (err) {
      console.error("onDragEnd error:", err);
    }
  }

  const knownLabels = useMemo(() => {
    const set = new Set();
    Object.values(board.cards || {}).forEach((c) => (c?.labels || []).forEach((l) => set.add(l)));
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
      Object.entries(board.columns || {}).map(([colId, col]) => [
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
  <IconButton
  onClick={() => setOpenAdd(true)}
  sx={{
    bgcolor: 'primary.light',
    color: 'white', 
    '&:hover': {
      bgcolor: 'primary.main',
      color: 'white',
    },
  }}
>
  <AddIcon />
</IconButton>
  </Box>

  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="board" direction="horizontal" type="column">
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}
        >
          {filteredBoard.columnOrder.map((colId, index) => {
            const column = filteredBoard.columns[colId];
            const cards = (column?.cardIds || [])
              .map((id) => board.cards?.[id])
              .filter(Boolean);

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

          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  </DragDropContext>
</Box>

      {/* grid view */}
      {viewMode === "grid" && (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: 3,
      p: 1,
    }}
  >
    {Object.values(filteredCardsMap).map((card) => (
      <Paper
        key={card.id}
        elevation={4}
        onClick={() => openCard(card)}
        sx={{
          p: 2.5,
          borderRadius: 3,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
          },
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "text.primary",
            lineHeight: 1.3,
            wordBreak: "break-word",
          }}
        >
          {card.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 2,
            minHeight: "50px",
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {card.description || "No description provided."}
        </Typography>

        {/* Labels and Status */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "auto",
          }}
        >
          {/* Labels */}
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {(card.labels || []).slice(0, 3).map((l, i) => (
              <Chip
                key={i}
                label={l}
                size="small"
                sx={{ borderRadius: 1.5, fontWeight: 500 }}
              />
            ))}
            {(card.labels || []).length > 3 && (
              <Chip
                label={`+${card.labels.length - 3}`}
                size="small"
                sx={{ borderRadius: 1.5, fontWeight: 500 }}
              />
            )}
          </Box>

          {/* Status */}
          <Chip
            label={card.status ? card.status.toUpperCase() : "TODO"}
            size="small"
            sx={{
              px: 2,
              fontWeight: 700,
              borderRadius: "50px",
              bgcolor:
                card.status === "done"
                  ? "success.main"
                  : card.status === "inprogress"
                  ? "warning.main"
                  : "primary.main",
              color: "white",
              textTransform: "uppercase",
              fontSize: "0.75rem",
            }}
          />
        </Box>
      </Paper>
    ))}
  </Box>
)}


      {/* list view */}
      {viewMode === "list" && (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
    {Object.values(filteredCardsMap).map((card) => (
      <Paper
        key={card.id}
        elevation={3}
        onClick={() => openCard(card)}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          p: 2.5,
          borderRadius: 3,
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
          },
        }}
      >
        {/* Left side: title, description, labels */}
        <Box sx={{ flex: 1, pr: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: "text.primary",
              lineHeight: 1.3,
              wordBreak: "break-word",
            }}
          >
            {card.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 1.5,
              lineHeight: 1.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {card.description || "No description provided."}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {(card.labels || []).map((label, i) => (
              <Chip
                key={i}
                label={label}
                size="small"
                sx={{ borderRadius: 1.5, fontWeight: 500 }}
              />
            ))}
          </Box>
        </Box>

        {/* Right side: due date & status */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
            minWidth: "80px",
          }}
        >
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {card.due || ""}
          </Typography>

          <Chip
            label={card.status ? card.status.toUpperCase() : "TODO"}
            size="small"
            sx={{
              px: 2,
              fontWeight: 700,
              borderRadius: "50px",
              bgcolor:
                card.status === "done"
                  ? "success.main"
                  : card.status === "inprogress"
                  ? "warning.main"
                  : "primary.main",
              color: "white",
              textTransform: "uppercase",
              fontSize: "0.75rem",
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


