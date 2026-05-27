"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentItem } from "../pages/Content";

interface CalendarViewProps {
  contents: ContentItem[];
  onOpenDetail: (content: ContentItem) => void;
}

export default function CalendarView({ contents, onOpenDetail }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // First day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Previous month days to show (fill grid from Sunday)
  const prevMonthDays = firstDayOfMonth;

  // Total cells = prev month filler + days in month + next month filler
  // Round up to 35 or 42 for consistent grid
  const totalCells = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7;

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  // Format date string for matching (YYYY-MM-DD)
  const formatDateKey = (day: number) => {
    return `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-zinc-400" />
            <CardTitle className="text-base sm:text-lg">
              {monthNames[month]} {year} Content Calendar
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={goToPrevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={goToToday}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={goToNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-px bg-zinc-200 rounded-t-2xl overflow-hidden border-b border-zinc-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="bg-zinc-50 py-2 text-center text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="grid grid-cols-7 gap-px bg-zinc-200 rounded-b-2xl overflow-hidden min-w-[640px]">
            {Array.from({ length: totalCells }).map((_, i) => {
              const dayOffset = i - prevMonthDays;
              const day = dayOffset + 1;
              const isCurrentMonth = dayOffset >= 0 && dayOffset < daysInMonth;
              const dateKey = isCurrentMonth ? formatDateKey(day) : "";
              const dayContent = isCurrentMonth
                ? contents.filter((c) => c.publishDate.includes(dateKey))
                : [];

              return (
                <div
                  key={i}
                  className={`bg-white min-h-[100px] sm:min-h-[140px] p-2 sm:p-3 transition-colors ${
                    isCurrentMonth ? "hover:bg-zinc-50" : "bg-zinc-50/50"
                  }`}
                >
                  {isCurrentMonth && (
                    <div
                      className={`text-[10px] sm:text-xs font-mono mb-1 sm:mb-2 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full ${
                        isToday(day)
                          ? "bg-violet-600 text-white font-bold"
                          : "text-zinc-400"
                      }`}
                    >
                      {day}
                    </div>
                  )}
                  <div className="space-y-1 sm:space-y-2">
                    {dayContent.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onOpenDetail(item)}
                        className="text-[10px] sm:text-xs p-1.5 sm:p-2 bg-zinc-50 rounded-md sm:rounded-lg cursor-pointer hover:bg-white border border-transparent hover:border-zinc-200 transition-all"
                      >
                        <div className="font-medium line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          {item.platform}
                        </div>
                      </div>
                    ))}
                    {dayContent.length > 2 && (
                      <div className="text-[10px] text-zinc-400 text-center">
                        +{dayContent.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
