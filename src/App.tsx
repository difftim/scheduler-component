import { useEffect, useMemo, useRef, useState } from 'react';
import { MyCalendar } from './Scheduler.tsx';
import { Avatar } from './Avatar';
import { Bridge } from './bridge';
import './scss/app.scss';
import { getColors } from './colors.ts';

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
      if (calendarRef.current) {
        calendarRef.current.setDate(d);
      }
    });

    bridge.on('changeView', view => {
      if (calendarRef.current) {
        calendarRef.current.setCurrentView(view);
      }
    });

    return bridge;
  });
  const calendarRef = useRef<any>(null);

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
        name={item.name}
        id={item.id}
        onClickAvatar={() => bridge.showAvatar(item.id)}
      />
      <div className="name">{item.name || item.id}</div>
      <div className="utc">{`UTC+${item.utc}`}</div>
    </div>
  );

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {/*
      <div style={{ display: 'flex' }}>
        <button onClick={() => bridge.emit('changeDate', '2023-12-11')}>
          test_______2023-12-11
        </button>
        <button onClick={() => bridge.emit('changeView', 'week')}>
          change_view_to_week
        </button>
      </div> */}
      <MyCalendar
        ref={calendarRef}
        events={events}
        eventBgColors={eventBgColors}
        members={members}
        onRenderHeader={onRenderHeader}
        myInfo={{
          myID: '3333',
          name: 'baye',
          utcOffset: 8,
        }}
        onSelectEvent={(e: any) => {
          bridge.showMeetingDetail(e);
        }}
        onSelectSlot={(range: any) => {
          bridge.createNewMeeting(range);
        }}
      />
    </div>
  );
};

export default App;
