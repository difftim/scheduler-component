import { useCallback, useEffect, useMemo } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { Calendar, momentLocalizer, Navigate, Views } from 'react-big-calendar';
import noOverlap from './no-overlap';

import type { CalendarComponent } from '..';

function ViewNamesGroup({ views: viewNames, view, messages, onView }: any) {
  console.log(viewNames, messages, view);
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

const CustomToolbar = ({
  date,
  localizer: { messages },
  onNavigate,
  onView,
  view,
  views,
  onExtraHeaderRender,
  isDisabled,
  renderCustomViewGroup = null,
  timeZone,
}: any) => {
  if (!isDisabled) {
    isDisabled = (date: any, view: 'day' | 'week') => {
      if (view === Views.DAY) {
        return moment(date) <= moment.tz(timeZone).startOf('week');
      }

      return moment(date).startOf('week') < moment().startOf('week');
    };
  }

  const dateStr = useMemo(() => {
    const d = moment(date);
    if (view === Views.DAY) {
      return d.locale('en').format('ddd, MMM D');
    }

    const a = d.startOf('week');
    const b = d.endOf('week');
    return [a, b].map(o => o.locale('en').format('MMM D')).join(' - ');
  }, [view, date, timeZone]);

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
        {renderCustomViewGroup ? (
          renderCustomViewGroup({ view, views, messages, onView })
        ) : (
          <ViewNamesGroup
            view={view}
            views={views}
            messages={messages}
            onView={onView}
          />
        )}
      </span>
      {extraElement}
    </div>
  );
};

function TimeGutter() {
  const myUtc = moment().utcOffset() / 60;
  const utcStr = myUtc >= 0 ? `UTC+${myUtc}` : `UTC-${Math.abs(Number(myUtc))}`;

  return <div className="time-gutter">{utcStr}</div>;
}

function CustomHeader({ date }: any) {
  const d = moment(date).locale('en');
  const isToday = moment().format('YYYY-MM-DD') === d.format('YYYY-MM-DD');

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
  onSelectEvent,
  onSelectSlot,
  eventColors,
  showHeader = true,
  date,
  onChange,
  view,
  onViewChange,
  onExtraHeaderRender = () => null,
  renderCustomViewGroup = null,
  scrollToTime: _scrollToTime = new Date(),
  style = {},
  className = '',
  isDisabled,
  timeZone,
  ...rest
}) => {
  useEffect(() => {
    const slots = document.querySelectorAll('.rbc-day-slot.rbc-today');
    if (slots?.length) {
      const firstElement = slots[0];
      firstElement.classList.remove('redpoint');
      firstElement.classList.add('redpoint');
    }
  }, [date, view]);

  useEffect(() => {
    return () => {
      moment.tz.setDefault(); // reset to browser TZ on unmount
    };
  }, []);

  const _events = useMemo(
    () => events.map(item => ({ ...item, resourceId: item.id })),
    [view, events]
  );

  const { getNow, myEvents, scrollToTime, localizer } = useMemo(() => {
    moment.tz.setDefault(timeZone);
    const now = moment().toDate();
    return {
      getNow: () => now,
      localizer: momentLocalizer(moment),
      myEvents: [..._events],
      scrollToTime: _scrollToTime || now,
    };
  }, [timeZone, _scrollToTime, _events]);

  const resources = useMemo(() => {
    if (view == Views.WEEK || !members.length) {
      return;
    }

    return members.map(m => ({
      ...m,
      title: onRenderHeader(m),
    }));
  }, [view, onRenderHeader, members]);

  const colorMap = useMemo(() => {
    if (!eventColors || members.length === 0) {
      return {};
    }

    const _colorMap = members.reduce((sum, item) => {
      sum[item.id] = eventColors[item.id];

      return sum;
    }, {});

    return _colorMap;
  }, [eventColors, members]);

  const eventPropGetter = useCallback(
    (event: any) => {
      if (!colorMap[event.id]) {
        return {};
      }

      const item = colorMap[event.id];

      return {
        style: {
          backgroundColor: item.bgColor,
          color: item.color,
        },
      };
    },
    [colorMap]
  );

  const components = useMemo(() => {
    const toolbar = (props: any) =>
      showHeader ? (
        <CustomToolbar
          onExtraHeaderRender={onExtraHeaderRender}
          renderCustomViewGroup={renderCustomViewGroup}
          isDisabled={isDisabled}
          timeZone={timeZone}
          {...props}
        />
      ) : null;

    const timeSlotWrapper = ({ value, children }: any) => {
      if (!children?.props?.children) {
        return null;
      }

      const hAStr = moment(value).locale('en').format('h A');
      let extra = '';

      if (hAStr === '12 AM') {
        extra = `Night`;
      } else if (hAStr === '12 PM') {
        extra = `Noon`;
      }

      return (
        <div className="rbc-time-slot">
          <span className="rbc-label">{hAStr}</span>
          <div className="rbc-label">{extra}</div>
        </div>
      );
    };

    return {
      toolbar,
      timeGutterHeader: TimeGutter,
      header: CustomHeader,
      timeSlotWrapper,
    };
  }, [showHeader, timeZone, isDisabled]);

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
      events={myEvents}
      getNow={getNow}
      startAccessor="start"
      scrollToTime={scrollToTime}
      endAccessor="end"
      tooltipAccessor={null}
      view={view}
      style={{ height: '100vh', ...style }}
      views={{
        day: true,
        week: true,
      }}
      className={className}
      selectable
      showAllEvents
      onView={onViewChange}
      onSelectSlot={e => {
        const start = moment(e.start).unix();
        const end = moment(e.end).unix();

        return onSelectSlot?.({
          ...e,
          start,
          end,
        });
      }}
      onSelectEvent={e => {
        const start = moment(e.start).unix();
        const end = moment(e.end).unix();

        return onSelectEvent?.({
          ...e,
          start,
          end,
        });
      }}
      {...rest}
    />
  );
};
