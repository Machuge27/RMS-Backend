import React, { useState } from "react"; 
import '../../css/admin/Calendar.css';
import CalendarSection from '../boxes/Calendar';

const Calendar = () => {
  const [events, setEvents] = useState([
      { id: 1, title: "Rent Due", date: "2024-02-01", type: "payment" },
      { id: 2, title: "Maintenance Inspection", date: "2024-02-15", type: "maintenance" },
      {
        id: 2,
        title: 'Monthly meeting',
        date: '2024-02-15',
        type: 'meeting'
      },
    ]);

  return (
    <div>
      <CalendarSection events={events} />      
    </div>
  );
};

export default Calendar;
