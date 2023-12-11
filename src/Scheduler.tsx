import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  Calendar,
  Navigate,
  View,
  Views,
  dayjsLocalizer,
} from 'react-big-calendar';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import noOverlap from './no-overlap.ts';

dayjs.extend(isToday);
dayjs.extend(isBetween);
dayjs.extend(utc);

const localizer = dayjsLocalizer(dayjs);

function ViewNamesGroup({ views: viewNames, view, messages, onView }: any) {
  return viewNames.map((name: any) => (
    <button
      type="button"
      key={name}
      className={view === name ? 'rbc-active' : ''}
      onClick={() => onView(name)}
    >
      {messages[name]}
    </button>
  ));
}

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

function CustomToolbar({
  date,
  // label, // available, but not used here
  localizer: { messages },
  onNavigate,
  onView,
  view,
  views,
}: any) {
  const dateStr = useMemo(() => {
    const d = dayjs(date).locale('en');
    if (view === Views.DAY) {
      return d.format('ddd, MMM D');
    }

    const a = d.startOf('week');
    const b = d.endOf('week');

    return [a, b].map(o => o.format('ddd, MMM D')).join(' - ');
  }, [view, date]);

  return (
    <div className="rbc-toolbar toolbar-header">
      <div>
        <div
          className="today-btn"
          onClick={() => {
            onNavigate(Navigate.TODAY);
            onView(Views.DAY);
          }}
          aria-label={messages.today}
        >
          Today
        </div>

        <div className="date-str">{dateStr}</div>

        <div className="pre-next-btn-wrapper">
          <span
            onClick={() => onNavigate(Navigate.PREVIOUS)}
            aria-label={messages.previous}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M12.5 5L7.5 10L12.5 15"
                stroke="#474D57"
                strokeWidth="1.67016"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span
            onClick={() => onNavigate(Navigate.NEXT)}
            aria-label={messages.next}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M7.5 5L12.5 10L7.5 15"
                stroke="currentColor"
                strokeWidth="1.67016"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      <span className="rbc-btn-group">
        <ViewNamesGroup
          view={view}
          views={views}
          messages={messages}
          onView={onView}
        />
      </span>
    </div>
  );
}

function TimeGutter({ myInfo }: any) {
  return <div className="time-gutter">UTC+{myInfo.utcOffset}</div>;
}

function CustomHeader({ date }: any) {
  const isToday = dayjs(date).isToday();

  return (
    <div
      className={isToday ? 'custom-header-date today' : 'custom-header-date'}
    >
      <div className="date">{dayjs(date).format('DD')}</div>
      <div className="week">{dayjs(date).format('ddd')}</div>
    </div>
  );
}

type CalendarRef = {
  setDate: any;
  setCurrentView: (view: 'day' | 'week') => any;
};

export const MyCalendar = React.forwardRef<CalendarRef, CalendarProps>(
  (
    {
      events,
      members,
      onRenderHeader,
      myInfo,
      onSelectEvent,
      onSelectSlot,
      eventBgColors,
      showHeader = true,
    },
    ref
  ) => {
    const [currentView, setCurrentView] = useState<View>(Views.DAY);
    const [date, setDate] = useState(new Date('2023-12-7'));

    useImperativeHandle(ref, () => ({
      setDate,
      setCurrentView,
    }));

    useEffect(() => {
      const slots = document.querySelectorAll('.rbc-day-slot.rbc-today');
      if (slots?.length) {
        const firstElement = slots[0];
        firstElement.classList.remove('redpoint');
        firstElement.classList.add('redpoint');
      }
    }, [date, currentView]);

    const _events = useMemo(
      () => events.map(item => ({ ...item, resourceId: item.id })),
      [currentView]
    );

    const resources = useMemo(() => {
      if (currentView == Views.WEEK) {
        return;
      }

      return members.map(m => ({
        ...m,
        title: onRenderHeader(m),
      }));
    }, [currentView, onRenderHeader, members]);

    const colorMap = useMemo(() => {
      const _colorMap = members.reduce((sum, item, index) => {
        sum[item.id] = eventBgColors[index];

        return sum;
      }, {});

      return _colorMap;
    }, [eventBgColors, members]);

    const eventPropGetter = useCallback(
      (event: any) => {
        return {
          style: {
            backgroundColor: colorMap[event.id],
          },
        };
      },
      [colorMap]
    );

    const components = useMemo(() => {
      const toolbar = showHeader ? CustomToolbar : () => null;
      return {
        toolbar,
        timeGutterHeader: (props: any) => (
          <TimeGutter {...props} myInfo={myInfo} />
        ),
        header: CustomHeader,
      };
    }, [showHeader, myInfo]);

    return (
      <Calendar<{
        id: string;
        eid: string;
        title: string;
        start: Date;
        end: Date;
        desc: string;
        isBusy: boolean;
        utc: Number;
      }>
        resources={resources}
        dayLayoutAlgorithm={noOverlap}
        eventPropGetter={eventPropGetter}
        components={components}
        date={date}
        onNavigate={date => {
          setDate(date);
        }}
        localizer={localizer}
        events={_events}
        startAccessor="start"
        endAccessor="end"
        view={currentView}
        formats={{
          timeGutterFormat: date => dayjs(date).locale('en').format('h A'),
        }}
        style={{ height: '100vh' }}
        views={{
          day: true,
          week: true,
        }}
        selectable
        onView={setCurrentView}
        onSelectSlot={e => {
          const start = dayjs(e.start).unix();
          const end = dayjs(e.end).unix();

          return onSelectSlot?.({
            ...e,
            start,
            end,
          });
        }}
        onSelectEvent={e => {
          const start = dayjs(e.start).unix();
          const end = dayjs(e.end).unix();

          return onSelectEvent?.({
            ...e,
            start,
            end,
          });
        }}
      />
    );
  }
);
