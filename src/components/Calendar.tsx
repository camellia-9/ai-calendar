'use client';

import { useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCalendarStore } from '@/store/calendarStore';

export function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const { events, currentView, currentDate, setDate } = useCalendarStore();

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(currentView);
      calendarApi.gotoDate(currentDate);
    }
  }, [currentView, currentDate]);

  return (
    <div className="h-full bg-slate-900 rounded-lg overflow-hidden">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={currentView}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events.map((e) => ({
          id: e.id,
          title: e.title,
          start: e.start,
          end: e.end,
          allDay: e.allDay,
          backgroundColor: '#3B82F6',
          borderColor: '#3B82F6',
        }))}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        datesSet={(dateInfo) => {
          setDate(dateInfo.view.currentStart);
        }}
        themeSystem="slate"
        height="100%"
      />
    </div>
  );
}
