import { useCallback, useEffect, useMemo } from 'react';
import { Calendar, Navigate, Views, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import noOverlap from './no-overlap';
import type { CalendarComponent } from '..';

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

function CustomToolbar({
  date,
  // label, // available, but not used here
  localizer: { messages },
  onNavigate,
  onView,
  view,
  views,
  onExtraHeaderRender,
}: any) {
  const dateStr = useMemo(() => {
    const d = dayjs(date);
    if (view === Views.DAY) {
      return d.locale('en').format('ddd, MMM D');
    }

    const a = d.startOf('week');
    const b = d.endOf('week');

    // if (a.startOf('month') < b.startOf('month')) {
    return [a, b].map(o => o.locale('en').format('MMM D')).join(' - ');
    // }

    // return `${a.locale('en').format('MMM D')} - ${b.locale('en').format('D')}`;
  }, [view, date]);

  const isDisabled = (date: any, view: 'day' | 'week') => {
    if (view === Views.DAY) {
      return dayjs(date) <= dayjs().startOf('week');
    }

    return dayjs(date).startOf('weeks') <= dayjs().startOf('week');
  };
  const extraElement = onExtraHeaderRender?.() || null;

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

        <div
          className="date-str"
          style={view === Views.DAY ? { width: '125px' } : {}}
        >
          {dateStr}
        </div>

        <div className="pre-next-btn-wrapper">
          <span
            onClick={() => {
              if (isDisabled(date, view)) {
                return;
              }
              onNavigate(Navigate.PREVIOUS);
            }}
            aria-label={messages.previous}
            className={isDisabled(date, view) ? 'disabled' : ''}
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
                stroke="currentColor"
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
      <span className="rbc-btn-group rbc-btn-group-override">
        <ViewNamesGroup
          view={view}
          views={views}
          messages={messages}
          onView={onView}
        />
      </span>
      {extraElement}
    </div>
  );
}

function TimeGutter({ myUtc }: any) {
  return <div className="time-gutter">UTC+{myUtc}</div>;
}

function CustomHeader({ date }: any) {
  const isToday = dayjs(date).isToday();
  const d = dayjs(date).locale('en');

  return (
    <div
      className={isToday ? 'custom-header-date today' : 'custom-header-date'}
    >
      <div className="date">{d.format('DD')}</div>
      <div className="week">{d.format('ddd')}</div>
    </div>
  );
}

export const MyCalendar: CalendarComponent = ({
  events,
  members,
  onRenderHeader,
  myUtc,
  onSelectEvent,
  onSelectSlot,
  eventBgColors,
  showHeader = true,
  date,
  onChange,
  view,
  onViewChange,
  onExtraHeaderRender = () => null,
}) => {
  useEffect(() => {
    const slots = document.querySelectorAll('.rbc-day-slot.rbc-today');
    if (slots?.length) {
      const firstElement = slots[0];
      firstElement.classList.remove('redpoint');
      firstElement.classList.add('redpoint');
    }
  }, [date, view]);

  const _events = useMemo(
    () => events.map(item => ({ ...item, resourceId: item.id })),
    [view, events]
  );

  const resources = useMemo(() => {
    if (view == Views.WEEK) {
      return;
    }

    return members.map(m => ({
      ...m,
      title: onRenderHeader(m),
    }));
  }, [view, onRenderHeader, members]);

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
    const toolbar = (props: any) =>
      showHeader ? (
        <CustomToolbar onExtraHeaderRender={onExtraHeaderRender} {...props} />
      ) : null;

    return {
      toolbar,
      timeGutterHeader: (props: any) => <TimeGutter {...props} myUtc={myUtc} />,
      header: CustomHeader,
    };
  }, [showHeader, myUtc]);

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
      culture="en"
      resources={resources}
      dayLayoutAlgorithm={noOverlap}
      eventPropGetter={eventPropGetter}
      components={components}
      date={date}
      onNavigate={onChange}
      localizer={localizer}
      events={_events}
      startAccessor="start"
      endAccessor="end"
      view={view}
      formats={{
        timeGutterFormat: date => dayjs(date).locale('en').format('h A'),
      }}
      style={{ height: '100vh' }}
      views={{
        day: true,
        week: true,
      }}
      selectable
      showAllEvents
      onView={onViewChange}
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
};
