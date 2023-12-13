import React from 'react';

type CalendarRef = {
  setDate: any;
  setCurrentView: (view: 'day' | 'week') => any;
};

type CalendarProps = {
  events: any[];
  members: any[];
  onRenderHeader: (item: any) => JSX.Element;
  showHeader?: boolean;
  myInfo: {
    myID: string;
    name: string;
    utcOffset: number;
  };
  eventBgColors: any[];
  onSelectEvent?: any;
  onSelectSlot?: any;
};

type CalendarComponent = React.ForwardRefExoticComponent<
  CalendarProps & React.RefAttributes<CalendarRef>
>;

declare const MyCalendar: CalendarComponent;

export { MyCalendar };
