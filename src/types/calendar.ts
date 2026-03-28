export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  allDay: boolean;
  repeatRule?: string;
  location?: string;
  reminders: number[];
  tags: string[];
  aiSummary?: string;
  source: string;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  defaultReminder: number;
}
