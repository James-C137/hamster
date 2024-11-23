import React from 'react';

interface CalendarProps {
  date?: Date;
  highlightedDates?: Date[];
  style?: React.CSSProperties;
  className?: string;
  title?: string;
}

const baseStyles = {
  calendar: {
    width: '256px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '8px',
    fontWeight: 600,
    fontSize: '1.1rem',
    color: '#333',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '16px',
    fontWeight: 500,
    color: '#666',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  },
  dayName: {
    textAlign: 'center' as const,
    fontSize: '0.875rem',
    color: '#666',
    fontWeight: 500,
  },
  prevMonthDay: {
    textAlign: 'center' as const,
    padding: '4px 0',
    color: '#ccc',
  },
  currentDay: {
    textAlign: 'center' as const,
    padding: '4px 0',
    position: 'relative' as const,
  },
  highlightedDay: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
  }
} as const;

const MinimalCalendar: React.FC<CalendarProps> = ({ 
  date = new Date(),
  highlightedDates = [], 
  style = {},
  className = '',
  title
}) => {
  const monthNames: readonly string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ] as const;

  const dayNames: readonly string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

  const getMonthData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const prevMonthDays: number[] = [];
    for (let i = 0; i < startingDay; i++) {
      const day = new Date(year, month, -i);
      prevMonthDays.unshift(day.getDate());
    }
    
    const days: number[] = Array.from(
      { length: daysInMonth }, 
      (_, i): number => i + 1
    );
    
    return { prevMonthDays, days };
  };

  const isDateHighlighted = (day: number): boolean => {
    return highlightedDates.some((highlightedDate: Date): boolean => 
      highlightedDate.getDate() === day &&
      highlightedDate.getMonth() === date.getMonth() &&
      highlightedDate.getFullYear() === date.getFullYear()
    );
  };

  const { prevMonthDays, days } = getMonthData(date);

  return (
    <div style={{ ...baseStyles.calendar, ...style }} className={className}>
      {title && <div style={baseStyles.title}>{title}</div>}
      <div style={baseStyles.header}>
        {`${monthNames[date.getMonth()]} ${date.getFullYear()}`}
      </div>
      
      <div style={baseStyles.grid}>
        {/* Day names */}
        {dayNames.map((day: string) => (
          <div key={day} style={baseStyles.dayName}>
            {day}
          </div>
        ))}
        
        {/* Previous month days */}
        {prevMonthDays.map((day: number, index: number) => (
          <div key={`prev-${index}`} style={baseStyles.prevMonthDay}>
            {day}
          </div>
        ))}
        
        {/* Current month days */}
        {days.map((day: number) => (
          <div key={`current-${day}`} style={baseStyles.currentDay}>
            <span style={isDateHighlighted(day) ? baseStyles.highlightedDay : undefined}>
              {day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MinimalCalendar;