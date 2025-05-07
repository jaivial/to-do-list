"use client";

import React, { useState, useMemo } from "react";
import { useTodoContext } from "../context/TodoContext";
import { CalendarDay } from "../lib/types";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

const Calendar: React.FC = () => {
  const { todos, selectedDate, setSelectedDate } = useTodoContext();
  const { t, language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationDirection, setAnimationDirection] = useState<"left" | "right">("right");

  // Get current locale based on language
  const currentLocale = useMemo(() => {
    return language === "en" ? "en-US" : "es-ES";
  }, [language]);

  // Get days for the current month view
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Create array of days for the calendar grid
    const daysArray: CalendarDay[] = [];

    // Add days from previous month to fill the first row
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      daysArray.push({
        date,
        isCurrentMonth: false,
        hasTasks: hasTasks(date),
        hasPendingTasks: hasPendingTasks(date),
        isToday: isToday(date),
        isSelected: isSelectedDate(date),
      });
    }

    // Add days from current month
    const daysInMonth = lastDay.getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      daysArray.push({
        date,
        isCurrentMonth: true,
        hasTasks: hasTasks(date),
        hasPendingTasks: hasPendingTasks(date),
        isToday: isToday(date),
        isSelected: isSelectedDate(date),
      });
    }

    // Add days from next month to fill the last row
    const totalDaysToShow = 42; // 6 rows of 7 days
    const daysFromNextMonth = totalDaysToShow - daysArray.length;

    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(year, month + 1, i);
      daysArray.push({
        date,
        isCurrentMonth: false,
        hasTasks: hasTasks(date),
        hasPendingTasks: hasPendingTasks(date),
        isToday: isToday(date),
        isSelected: isSelectedDate(date),
      });
    }

    return daysArray;
  }, [currentMonth, todos, selectedDate]);

  // Check if a date has any tasks
  function hasTasks(date: Date): boolean {
    return todos.some((todo) => {
      const todoDate = new Date(todo.createdAt);
      return todoDate.getFullYear() === date.getFullYear() && todoDate.getMonth() === date.getMonth() && todoDate.getDate() === date.getDate();
    });
  }

  // Check if a date has pending tasks
  function hasPendingTasks(date: Date): boolean {
    return todos.some((todo) => {
      const todoDate = new Date(todo.createdAt);
      return todoDate.getFullYear() === date.getFullYear() && todoDate.getMonth() === date.getMonth() && todoDate.getDate() === date.getDate() && !todo.completed;
    });
  }

  // Check if a date is today
  function isToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
  }

  // Check if a date is the selected date
  function isSelectedDate(date: Date): boolean {
    if (!selectedDate) return false;

    return date.getFullYear() === selectedDate.getFullYear() && date.getMonth() === selectedDate.getMonth() && date.getDate() === selectedDate.getDate();
  }

  // Navigate to previous month
  const goToPrevMonth = () => {
    setAnimationDirection("left");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
      setIsAnimating(false);
    }, 300);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setAnimationDirection("right");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
      setIsAnimating(false);
    }, 300);
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    // Set time to noon to avoid timezone issues
    const normalizedDate = new Date(date);
    normalizedDate.setHours(12, 0, 0, 0);

    if (selectedDate && normalizedDate.getFullYear() === selectedDate.getFullYear() && normalizedDate.getMonth() === selectedDate.getMonth() && normalizedDate.getDate() === selectedDate.getDate()) {
      // Toggle selection off if clicking the same date
      setSelectedDate(null);
    } else {
      setSelectedDate(normalizedDate);
    }
  };

  // Get month and year for display
  const monthYearDisplay = useMemo(() => {
    return currentMonth.toLocaleDateString(currentLocale, { month: "long", year: "numeric" });
  }, [currentMonth, currentLocale]);

  // Day names for the calendar header
  const dayNames = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(2023, 0, i + 1); // January 1st, 2023 was a Sunday
      days.push(date.toLocaleDateString(currentLocale, { weekday: "short" }));
    }
    return days;
  }, [currentLocale]);

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-4 shadow-lg">
        <div className="flex justify-between items-center text-white">
          <button onClick={goToPrevMonth} className="p-2 hover:bg-white/20 rounded-full transition-colors" aria-label={t("Calendar.previousMonth")}>
            <FiChevronLeft size={24} />
          </button>

          <div className="flex items-center space-x-2">
            <FiCalendar size={20} />
            <h2 className="text-xl font-bold">{monthYearDisplay}</h2>
          </div>

          <button onClick={goToNextMonth} className="p-2 hover:bg-white/20 rounded-full transition-colors" aria-label={t("Calendar.nextMonth")}>
            <FiChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-b-xl overflow-hidden shadow-lg border border-gray-200 border-t-0">
        {/* Day names header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {dayNames.map((day, index) => (
            <div key={index} className="py-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className={`grid grid-cols-7 gap-px bg-gray-200 p-px transition-transform duration-300 ${isAnimating ? (animationDirection === "right" ? "translate-x-[-5%] opacity-0" : "translate-x-[5%] opacity-0") : "translate-x-0 opacity-100"}`}>
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day.date)}
              className={`
                relative aspect-square flex flex-col items-center justify-center bg-white
                cursor-pointer transition-all duration-200 group
                ${!day.isCurrentMonth ? "opacity-40" : ""}
                ${day.isSelected ? "bg-blue-50" : "hover:bg-gray-50"}
              `}
            >
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  ${day.isToday ? "bg-blue-100 text-blue-700 font-bold" : ""}
                  ${day.isSelected ? "bg-blue-600 text-white" : ""}
                  group-hover:${!day.isSelected ? "bg-gray-200" : ""}
                `}
              >
                {day.date.getDate()}
              </div>

              {/* Task indicators */}
              {day.hasTasks && (
                <div className="absolute bottom-1 flex space-x-1">
                  {day.hasPendingTasks && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                  {!day.hasPendingTasks && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selected date info */}
        {selectedDate && (
          <div className="p-4 bg-blue-50 border-t border-blue-200">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-blue-800">{selectedDate.toLocaleDateString(currentLocale, { weekday: "long", month: "long", day: "numeric" })}</h3>
              <button onClick={() => setSelectedDate(null)} className="text-blue-600 hover:text-blue-800 text-sm">
                {t("Calendar.showAllTasks")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
