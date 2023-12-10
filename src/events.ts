const myEvents = [
  {
    id: '+6666',
    title: 'Meeting',
    start: new Date('2023-12-07 12:00:00'),
    end: new Date('2023-12-07 13:00:00'),
    desc: 'Pre-meeting meeting, to prepare for the meeting',
  },
  {
    id: '+6666',
    title: 'Meeting',
    start: new Date(2023, 11, 7, 10, 30, 0, 0),
    end: new Date(2023, 11, 7, 12, 30, 0, 0),
    desc: 'Pre-meeting meeting, to prepare for the meeting',
  },
  {
    id: '+6666',
    title: 'Lunch',
    start: new Date(2023, 11, 7, 11, 0, 0, 0),
    end: new Date(2023, 11, 7, 13, 0, 0, 0),
    desc: 'Power lunch',
  },
  {
    id: '+6666',
    title: 'Meeting',
    start: new Date(2023, 11, 11, 14, 0, 0, 0),
    end: new Date(2023, 11, 11, 15, 0, 0, 0),
  },
  {
    id: '+8888',
    title: 'Happy Hour',
    start: new Date(2023, 11, 5, 0, 0, 0, 0),
    end: new Date(2023, 11, 5, 1, 0, 0, 0),
    desc: 'Most important meal of the day',
  },
  {
    id: '+8888',
    title: 'Dinner',
    start: new Date(2023, 11, 7, 5, 0, 0),
    end: new Date(2023, 11, 7, 5, 30, 0),
  },
  {
    id: '+8888',
    title: 'Planning Meeting with Paige',
    start: new Date(2023, 11, 13, 8, 0, 0),
    end: new Date(2023, 11, 13, 10, 30, 0),
  },
  {
    id: '+0000',
    title: 'Inconvenient Conference Call',
    start: new Date(2023, 11, 13, 9, 30, 0),
    end: new Date(2023, 11, 13, 11, 0, 0),
  },
  {
    id: '+0000',
    title: "Project Kickoff - Lou's Shoes",
    start: new Date(2023, 11, 13, 11, 30, 0),
    end: new Date(2023, 11, 13, 14, 0, 0),
  },
  {
    id: '+9999',
    title: 'Quote Follow-up - Tea by Tina',
    start: new Date(2023, 11, 13, 15, 30, 0),
    end: new Date(2023, 11, 13, 16, 0, 0),
  },
  {
    id: '+9999',
    title: 'Late Night Event',
    start: new Date(2023, 11, 17, 19, 30, 0),
    end: new Date(2023, 11, 18, 2, 0, 0),
  },
  {
    id: '+9999',
    title: 'Late Same Night Event',
    start: new Date(2023, 11, 17, 19, 30, 0),
    end: new Date(2023, 11, 17, 23, 30, 0),
  },
  {
    id: '+8888',
    title: 'Multi-day Event',
    start: new Date(2023, 11, 20, 19, 30, 0),
    end: new Date(2023, 11, 22, 2, 0, 0),
  },
  // {
  //   id: 14,
  //   title: 'Today',
  //   start: new Date(new Date().setHours(new Date().getHours() - 3)),
  //   end: new Date(new Date().setHours(new Date().getHours() + 3)),
  // },
  {
    id: '+6666',
    title: 'Point in Time Event',
    start: new Date(),
    end: new Date(),
  },
  {
    id: '+9999',
    title: 'Video Record',
    start: new Date(2023, 11, 7, 15, 30, 0),
    end: new Date(2023, 11, 7, 19, 0, 0),
  },
  {
    id: '+8888',
    title: 'Dutch Song Producing',
    start: new Date(2023, 11, 7, 16, 30, 0),
    end: new Date(2023, 11, 7, 20, 0, 0),
  },
  {
    id: '+9999',
    title: 'Itaewon Meeting',
    start: new Date(2023, 11, 7, 16, 30, 0),
    end: new Date(2023, 11, 7, 17, 30, 0),
  },
  {
    id: '+9999',
    title: 'Online Coding Test',
    start: new Date(2023, 11, 7, 17, 30, 0),
    end: new Date(2023, 11, 7, 20, 30, 0),
  },
  {
    id: '+9999',
    title: 'An overlapped Event',
    start: new Date(2023, 11, 7, 17, 0, 0),
    end: new Date(2023, 11, 7, 18, 30, 0),
  },
  {
    id: '+9999',
    title: 'Phone Interview',
    start: new Date(2023, 11, 7, 17, 0, 0),
    end: new Date(2023, 11, 7, 18, 30, 0),
  },
  {
    id: '+9999',
    title: 'Cooking Class',
    start: new Date(2023, 11, 7, 17, 30, 0),
    end: new Date(2023, 11, 7, 19, 0, 0),
  },
  {
    id: 23,
    title: 'Go to the gym',
    start: new Date(2023, 11, 10, 18, 30, 0),
    end: new Date(2023, 11, 10, 20, 0, 0),
  },
  {
    id: 24,
    title: 'DST ends on this day (Europe)',
    start: new Date(2023, 11, 8, 0, 0, 0),
    end: new Date(2023, 11, 8, 4, 30, 0),
  },
  {
    id: 25,
    title: 'DST ends on this day (America)',
    start: new Date(2023, 11, 6, 0, 0, 0),
    end: new Date(2023, 11, 6, 4, 30, 0),
  },
  {
    id: '+9999',
    title: 'DST starts on this day (America)',
    start: new Date(2023, 11, 11, 0, 0, 0),
    end: new Date(2023, 11, 11, 4, 30, 0),
  },
  {
    id: '+9999',
    title: 'DST starts on this day (Europe)',
    start: new Date(2023, 11, 8, 0, 0, 0),
    end: new Date(2023, 11, 8, 4, 30, 0),
  },
];

export { myEvents };
