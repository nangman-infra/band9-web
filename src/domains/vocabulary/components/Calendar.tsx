/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const calendarContainerStyle = css`
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;

  @media (min-width: 640px) {
    margin-bottom: 1.5rem;
    gap: 0;
  }
`;

const monthYearStyle = css`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  text-align: center;
  flex: 1;

  @media (min-width: 640px) {
    font-size: 1.5rem;
    flex: none;
  }
`;

const navButtonStyle = css`
  background: #004C97;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.2s;
  min-width: 40px;
  flex-shrink: 0;

  @media (min-width: 640px) {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    min-width: auto;
  }

  &:hover {
    background: #0066CC;
  }
`;

const weekdaysStyle = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.5rem;

  @media (min-width: 640px) {
    gap: 0.5rem;
  }
`;

const weekdayStyle = css`
  text-align: center;
  font-weight: 600;
  color: #666;
  font-size: 0.75rem;
  padding: 0.25rem;

  @media (min-width: 640px) {
    font-size: 0.875rem;
    padding: 0.5rem;
  }
`;

const daysGridStyle = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;

  @media (min-width: 640px) {
    gap: 0.5rem;
  }
`;

const dayButtonStyle = (
  isCurrentMonth: boolean,
  isToday: boolean,
  isSelected: boolean,
) => css`
  background: ${isSelected
    ? '#004C97'
    : isToday
      ? '#E6F2FF'
      : isCurrentMonth
        ? 'white'
        : '#f5f5f5'};
  border: ${isSelected
    ? '2px solid #0066CC'
    : isToday
      ? '2px solid #004C97'
      : '1px solid #e0e0e0'};
  border-radius: 8px;
  padding: 0.5rem 0.25rem;
  cursor: pointer;
  color: ${isSelected
    ? 'white'
    : isToday
      ? '#004C97'
      : isCurrentMonth
        ? '#333'
        : '#999'};
  font-size: 0.75rem;
  font-weight: ${isSelected || isToday ? '600' : '400'};
  transition: all 0.2s;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;

  @media (min-width: 640px) {
    padding: 1rem;
    font-size: 1rem;
  }

  &:hover {
    background: ${isSelected
      ? '#0066CC'
      : isToday
        ? '#D0E0FF'
        : '#f0f0f0'};
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 76, 151, 0.1);
  }

  @media (hover: none) {
    &:hover {
      transform: none;
    }
  }
`;

const emptyDayStyle = css`
  padding: 0.5rem 0.25rem;
  aspect-ratio: 1;

  @media (min-width: 640px) {
    padding: 1rem;
  }
`;

const actionButtonsStyle = css`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (min-width: 640px) {
    gap: 1rem;
    margin-top: 1.5rem;
  }
`;

const actionButtonStyle = css`
  background: #004C97;
  border: none;
  border-radius: 8px;
  padding: 0.625rem 1rem;
  cursor: pointer;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.2s;
  flex: 1;
  min-width: 100px;

  @media (min-width: 640px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    flex: none;
    min-width: auto;
  }

  &:hover {
    background: #0066CC;
  }
`;

interface CalendarProps {
  onDateSelect: (date: string, mode: 'input' | 'practice' | 'view') => void;
}

function Calendar({ onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const handleInputClick = () => {
    if (selectedDate) {
      onDateSelect(selectedDate, 'input');
      navigate(`/vocabulary/${selectedDate}/input`);
    }
  };

  const handlePracticeClick = () => {
    if (selectedDate) {
      onDateSelect(selectedDate, 'practice');
      navigate(`/vocabulary/${selectedDate}/practice/mode`);
    }
  };

  const handleViewClick = () => {
    if (selectedDate) {
      onDateSelect(selectedDate, 'view');
      navigate(`/vocabulary/${selectedDate}/view`);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
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
          const isTodayDate = isToday(day);
          return (
            <motion.button
              key={day}
              css={dayButtonStyle(true, isTodayDate, isSelected)}
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
          <button css={actionButtonStyle} onClick={handleInputClick} type="button">
            Input Words
          </button>
          <button css={actionButtonStyle} onClick={handleViewClick} type="button">
            View Words
          </button>
          <button css={actionButtonStyle} onClick={handlePracticeClick} type="button">
            Practice
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Calendar;

