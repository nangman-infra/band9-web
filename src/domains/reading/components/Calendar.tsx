/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const calendarContainerStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
`;

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const monthYearStyle = css`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const navButtonStyle = css`
  background: #004C97;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #0066CC;
  }
`;

const weekdaysStyle = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const weekdayStyle = css`
  text-align: center;
  font-weight: 600;
  color: #666;
  font-size: 0.875rem;
  padding: 0.5rem;
`;

const daysGridStyle = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const dayButtonStyle = (isCurrentMonth: boolean, isToday: boolean) => css`
  background: ${isToday ? '#E6F2FF' : isCurrentMonth ? 'white' : '#f5f5f5'};
  border: ${isToday ? '2px solid #004C97' : '1px solid #e0e0e0'};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  color: ${isToday ? '#004C97' : isCurrentMonth ? '#333' : '#999'};
  font-size: 1rem;
  font-weight: ${isToday ? '600' : '400'};
  transition: all 0.2s;

  &:hover {
    background: ${isToday ? '#D0E0FF' : '#f0f0f0'};
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 76, 151, 0.1);
  }
`;

const emptyDayStyle = css`
  padding: 1rem;
`;

const actionButtonsStyle = css`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const actionButtonStyle = css`
  background: #004C97;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  transition: background 0.2s;

  &:hover {
    background: #0066CC;
  }
`;

interface CalendarProps {
  onDateSelect: (date: string) => void;
}

function Calendar({ onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const formatDateToString = (year: number, month: number, day: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  };

  const handleDateClick = (day: number) => {
    const dateString = formatDateToString(year, month, day);
    setSelectedDate(dateString);
  };

  const handleGenerateClick = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
      navigate(`/reading/${selectedDate}`);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthYearString = `${new Date(year, month).toLocaleString('en-US', { month: 'long' })} ${year}`;

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i += 1) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(day);
  }

  return (
    <motion.div
      css={calendarContainerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div css={headerStyle}>
        <button css={navButtonStyle} onClick={goToPreviousMonth} type="button">
          ←
        </button>
        <div css={monthYearStyle}>{monthYearString}</div>
        <button css={navButtonStyle} onClick={goToNextMonth} type="button">
          →
        </button>
      </div>
      <div css={weekdaysStyle}>
        {weekdays.map((day) => (
          <div key={day} css={weekdayStyle}>
            {day}
          </div>
        ))}
      </div>
      <div css={daysGridStyle}>
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} css={emptyDayStyle} />;
          }
          const dateString = formatDateToString(year, month, day);
          const isSelected = selectedDate === dateString;
          return (
            <motion.button
              key={day}
              css={dayButtonStyle(true, isToday(day) || isSelected)}
              onClick={() => handleDateClick(day)}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {day}
            </motion.button>
          );
        })}
      </div>
      {selectedDate && (
        <motion.div
          css={actionButtonsStyle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button css={actionButtonStyle} onClick={handleGenerateClick} type="button">
            Generate Passage
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Calendar;


