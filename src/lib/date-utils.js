import { format, startOfWeek, addDays, isToday, parseISO } from 'date-fns';

export function getTodayKey() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getWeekDays() {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    return {
      key: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEE'),
      shortDate: format(date, 'MMM d'),
      isToday: isToday(date),
    };
  });
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export function isWithinActiveHours(startTime, endTime) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

export function parseDate(dateStr) {
  return parseISO(dateStr);
}
