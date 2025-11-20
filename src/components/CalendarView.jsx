// src/components/CalendarView.jsx
import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // for clicks
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/**
 * CalendarView
 * Props:
 *  - cardsMap: object of cards (id -> card)
 *  - onEventClick(card) : callback when clicking an event (open modal)
 */
export default function CalendarView({ cardsMap = {}, onEventClick }) {
  // Convert cards map to FullCalendar events
  const events = useMemo(() => {
    return Object.values(cardsMap || {})
      .map((c) => {
        // expect due to be in yyyy-mm-dd format or ISO string; ignore if no due
        const due = c?.due || c?.dueDate || null;
        if (!due) return null;
        // FullCalendar wants an all-day date string for dayGrid ("YYYY-MM-DD")
        // ensure it's trimmed to yyyy-mm-dd
        const dateStr = String(due).slice(0, 10);
        return {
          id: String(c.id),
          title: c.title || "Untitled",
          start: dateStr,
          allDay: true,
          extendedProps: { cardId: c.id },
        };
      })
      .filter(Boolean);
  }, [cardsMap]);

  function handleEventClick(info) {
    info.jsEvent.preventDefault();
    const cardId = info.event.extendedProps?.cardId || info.event.id;
    const card = cardsMap[cardId];
    if (card && onEventClick) onEventClick(card);
  }

  return (
    <Box sx={{ bgcolor: "background.paper", borderRadius: 2, p: 2, boxShadow: 1 }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
        Calendar
      </Typography>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
        dayMaxEventRows={3}
        showNonCurrentDates={false}
        locale="en"
      />
    </Box>
  );
}
