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
  );
};

export default App;
