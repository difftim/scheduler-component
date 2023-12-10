import { useEffect, useState } from 'react';
import { MyCalendar } from './Scheduler.tsx';
import { Avatar } from './Avatar';
import { Bridge } from './bridge';
import './scss/app.scss';

const App: React.FC = () => {
  const [members, setMembers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any>([]);
  const [bridge] = useState(() => {
    const bridge = new Bridge();
    (window as any).bridge = bridge;
    // TODO
    return bridge;
  });

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
      <MyCalendar
        events={events}
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
