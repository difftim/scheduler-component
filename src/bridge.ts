import { myEvents } from './events';

export class Bridge {
  private events: Record<string, any[]> = {};

  showAvatar(id: string): void {
    console.log('[from bridge showAvatar]', id);
  }
  async getEvents(date: number) {
    console.log('[from bridge getEventList]', date);

    return myEvents;
  }

  async getMembers(memberIds: any[]) {
    console.log('[from bridge getSubscribeMembers]', memberIds);

    return [
      { name: 'Ethan', id: '+8888', utc: 8 },
      { name: 'Wayne', id: '+6666', utc: 8 },
      { name: 'Allen', id: '+9999', utc: 3 },
    ];
  }

  async showMeetingDetail(info: any) {
    console.log('[from bridge showMeetingDetail]', info);
  }

  async createNewMeeting(info: any) {
    console.log('[from bridge createNewMeeting]', info);
  }

  on(eventName: string, callback: (...args: any) => void) {
    if (!this.events[eventName]) {
      this.events = {
        [eventName]: [callback],
      };
    } else {
      this.events[eventName].push(callback);
    }
  }

  emit(name: string, payload: any) {
    console.log(name, payload);
    this.events[name].forEach(fn => {
      fn(payload);
    });
  }
}
