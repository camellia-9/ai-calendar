import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalendarEvent, UserSettings } from '@/types/calendar';

interface CalendarState {
  events: CalendarEvent[];
  settings: UserSettings;
  currentView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
  currentDate: Date;
  
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setView: (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => void;
  setDate: (date: Date) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      events: [],
      settings: {
        theme: 'dark',
        defaultReminder: 15,
      },
      currentView: 'dayGridMonth',
      currentDate: new Date(),

      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),
      
      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updatedEvent } : e
          ),
        })),
      
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),
      
      setView: (view) => set({ currentView: view }),
      setDate: (date) => set({ currentDate: date }),
    }),
    {
      name: 'ai-calendar-storage',
    }
  )
);
