import React from 'react';
import { View } from 'react-big-calendar';

export type CalendarProps = {
  date: Date;
  onChange: (date: Date) => void;
  view: 'day' | 'week';
  onViewChange: (view: View) => void;
  events: any[];
  members: any[];
  onRenderHeader: (item: any) => JSX.Element;
  showHeader?: boolean;
  myUtc?: string | number;
  eventBgColors?: Record<string, string>;
  onSelectEvent?: any;
  onSelectSlot?: any;
  onExtraHeaderRender?: (...args: any[]) => JSX.Element;
  scrollToTime?: Date;
  style?: React.CSSProperties;
  className?: string;
};

export type CalendarComponent = React.FC<CalendarProps>;

declare const MyCalendar: CalendarComponent;

export { MyCalendar };
