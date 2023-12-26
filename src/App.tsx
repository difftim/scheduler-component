import { useEffect, useMemo, useRef, useState } from 'react';
import { MyCalendar } from './Calendar.tsx';
import { Avatar } from './Avatar';
import { Bridge } from './bridge';
import { getColors } from './colors.ts';
import './scss/app.scss';
import { View } from 'react-big-calendar';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    return document.body.classList.contains('dark-theme');
  });
  const [members, setMembers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any>([]);
  const [bridge] = useState(() => {
    const bridge = new Bridge();
    (window as any).bridge = bridge;
    bridge.on('changeTheme', (theme: 'dark' | 'light') => {
      setIsDark(theme === 'dark');
    });

    bridge.on('changeDate', date => {
      const d = new Date(date);
      setDate(d);
    });

    bridge.on('changeView', view => {
      if (calendarRef.current) {
        calendarRef.current.setCurrentView(view);
      }
    });

    return bridge;
  });
  const calendarRef = useRef<any>(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<any>('day');

  const eventBgColors = useMemo(
    () => getColors(isDark ? 'dark' : 'light'),
    [isDark]
  );

  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams;
    const members = searchParams.get('members') || '';
    // const theme = searchParams.get('theme') || '';
    const timestamp = Number(
      searchParams.get('timestamp') || Date.now() / 1000
    );

    Promise.all([
      bridge.getMembers(members.split(',')),
      bridge.getEvents(timestamp),
    ]).then(([members, events]) => {
      setMembers(members);
      setEvents(events);
      setLoading(false);
    });

    return () => {
      bridge.clear?.();
    };
  }, []);

  const onRenderHeader = (item: any) => (
    <div className="avtar-header">
      <Avatar
        conversationType="direct"
        size={36}
        name={item.cname || item.name}
        id={item.id}
        onClickAvatar={() => bridge.showAvatar(item.id)}
      />
      <div className="name">{item.name || item.id}</div>
      <div className="utc">{`UTC+${Number.parseInt(item.utc)}`}</div>
    </div>
  );

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <MyCalendar
      date={date}
      view={view}
      onViewChange={view => setView(view as unknown as View)}
      onChange={setDate}
      events={events}
      eventBgColors={eventBgColors}
      members={members}
      onRenderHeader={onRenderHeader}
      // showHeader={false}
      onExtraHeaderRender={() => {
        return (
          <svg
            style={{
              color: 'var(--dsw-color-icon)',
              cursor: 'pointer',
              marginLeft: 8,
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            onClick={() => console.log(111111)}
          >
            <path
              d="M8.60417 3.59652C8.95917 2.13319 11.0408 2.13319 11.3958 3.59652C11.4491 3.81636 11.5535 4.02051 11.7006 4.19236C11.8477 4.36421 12.0332 4.4989 12.2422 4.58548C12.4512 4.67205 12.6776 4.70807 12.9032 4.69058C13.1287 4.6731 13.3469 4.60261 13.54 4.48486C14.8258 3.70152 16.2983 5.17319 15.515 6.45986C15.3974 6.6529 15.327 6.87097 15.3096 7.09633C15.2922 7.3217 15.3281 7.548 15.4146 7.75684C15.5011 7.96568 15.6356 8.15117 15.8073 8.29823C15.9789 8.4453 16.1829 8.54978 16.4025 8.60319C17.8658 8.95819 17.8658 11.0399 16.4025 11.3949C16.1827 11.4481 15.9785 11.5525 15.8067 11.6996C15.6348 11.8467 15.5001 12.0323 15.4135 12.2412C15.327 12.4502 15.291 12.6767 15.3084 12.9022C15.3259 13.1277 15.3964 13.3459 15.5142 13.539C16.2975 14.8249 14.8258 16.2974 13.5392 15.514C13.3461 15.3964 13.1281 15.3261 12.9027 15.3086C12.6773 15.2912 12.451 15.3272 12.2422 15.4136C12.0333 15.5001 11.8479 15.6346 11.7008 15.8063C11.5537 15.978 11.4492 16.1819 11.3958 16.4015C11.0408 17.8649 8.95917 17.8649 8.60417 16.4015C8.5509 16.1817 8.44648 15.9775 8.29941 15.8057C8.15233 15.6338 7.96676 15.4991 7.75779 15.4126C7.54882 15.326 7.32236 15.29 7.09685 15.3075C6.87133 15.325 6.65313 15.3954 6.46 15.5132C5.17417 16.2965 3.70167 14.8249 4.485 13.5382C4.60258 13.3451 4.67296 13.1271 4.6904 12.9017C4.70785 12.6763 4.67187 12.45 4.58539 12.2412C4.49892 12.0324 4.36438 11.8469 4.19273 11.6998C4.02107 11.5528 3.81714 11.4483 3.5975 11.3949C2.13417 11.0399 2.13417 8.95819 3.5975 8.60319C3.81733 8.54993 4.02148 8.44551 4.19333 8.29843C4.36518 8.15136 4.49988 7.96578 4.58645 7.75681C4.67303 7.54784 4.70904 7.32139 4.69156 7.09587C4.67407 6.87035 4.60359 6.65215 4.48583 6.45902C3.7025 5.17319 5.17417 3.70069 6.46083 4.48402C7.29417 4.99069 8.37417 4.54236 8.60417 3.59652Z"
              stroke="currentColor"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7.5 9.99902C7.5 10.6621 7.76339 11.2979 8.23223 11.7668C8.70107 12.2356 9.33696 12.499 10 12.499C10.663 12.499 11.2989 12.2356 11.7678 11.7668C12.2366 11.2979 12.5 10.6621 12.5 9.99902C12.5 9.33598 12.2366 8.7001 11.7678 8.23126C11.2989 7.76242 10.663 7.49902 10 7.49902C9.33696 7.49902 8.70107 7.76242 8.23223 8.23126C7.76339 8.7001 7.5 9.33598 7.5 9.99902Z"
              stroke="currentColor"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        );
      }}
      myUtc={8}
      onSelectEvent={(e: any) => {
        bridge.showMeetingDetail(e);
      }}
      onSelectSlot={(range: any) => {
        bridge.createNewMeeting(range);
      }}
    />
  );
};

export default App;
