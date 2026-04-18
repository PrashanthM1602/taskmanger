import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./MyCalendar.scss";

import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

/* ---------- Localizer Setup ---------- */

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

/* ---------- Component ---------- */

const MyCalendar = () => {
  const [events, setEvents] = useState([
    {
      title: "Design Meeting",
      start: new Date(),
      end: addDays(new Date(), 1),
      allDay: true,
    },
    {
      title: "Demo Presentation",
      start: addDays(new Date(), 2),
      end: addDays(new Date(), 2),
      allDay: true,
    },
  ]);

  const [date, setDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH);

  const handleSelectSlot = ({ start }) => {
    const title = prompt("Enter event title");
    if (!title) return;

    const newEvent = {
      title,
      start,
      end: addDays(start, 1),
      allDay: true,
    };

    setEvents((prev) => [...prev, newEvent]);
  };

  const handleSelectEvent = (event) => {
    alert(`Event: ${event.title}`);
  };

  return (
    <div className="calendarLayout">
      
      {/* Sidebar */}
      <div className="sidebarSection">
        <Sidebar />
      </div>

      {/* Calendar Content */}
      <div className="contentSection">
        <h1 className="pageTitle">Calendar</h1>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          style={{ height: "85vh" }}
          views={["month", "week", "day", "agenda"]}
          view={currentView}
          onView={setCurrentView}
          onNavigate={setDate}
          date={date}
        />
      </div>

    </div>
  );
};

export default MyCalendar;