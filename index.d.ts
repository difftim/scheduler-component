import React from 'react';
import { View, Components } from 'react-big-calendar';

type ViewGroupProps = {
  views: any[];
  view: any;
  messages: string[];
  onView: any;
};

export type Events = {
  id: string;
  eid: string;
  title: string;
  start: Date;
  end: Date;
  desc: string;
  isBusy: boolean;
  utc: Number;
};

export type CalendarProps = {
  date: Date;
  onChange: (date: Date) => void;
  view: 'day' | 'week';
  onViewChange: (view: View) => void;
  events: any[];
  members: any[];
  onRenderHeader: (item: any) => JSX.Element;
  showHeader?: boolean;
  timeZone?: string;
  eventColors?: Record<
    string,
    {
      bgColor: string;
      color: string;
    }
  >;
  onSelectEvent?: any;
  onSelectSlot?: any;
  onExtraHeaderRender?: (...args: any[]) => JSX.Element;
  scrollToTime?: Date;
  style?: React.CSSProperties;
  className?: string;
  renderCustomViewGroup?: (viewGroupProps: ViewGroupProps) => JSX.Element;
  isDisabled?: (date: any, view: 'day' | 'week') => boolean;
  components?: Components<Events>;
};

export type CalendarComponent = React.FC<CalendarProps>;

declare const MyCalendar: CalendarComponent;

export { MyCalendar };
