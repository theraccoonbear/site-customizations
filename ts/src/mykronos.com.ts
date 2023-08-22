// @include standard.js
import * as std from './lib/standard';

const debugging = false;

const dbg = (...stuff: any) => debugging ? console.log(...stuff) : null;

const MAX_TRIES = 100;
const KRO_HOSTNAME = std.srt(atob('ZXJwZXJuZ3ZiYW55cmRodmM' + 'tZmYzLmNlcS56bHhlYmFiZi5wY' + 'no='));
const EMPLOYER = atob('Uk' + 'VJ');

const iCalWrapping = (s: string): string => {
  let c = 1;
  const matches = s.match(/.{1,75}/g) ?? [];
  return matches
    .map((p: string) => // Indent each block of text
      `${p}\r\n ${" ".repeat(c++)}`)
    .join('')
    .trim();
}
const iCalEvent = (e: any, name: string, email: string) => {
  const start = new Date(e.orderedSegments[0].startDateTimeUTC);
  const end = new Date(e.orderedSegments[e.orderedSegments.length - 1].endDateTimeUTC);

  const breaks = e.orderedSegments.filter((s: any) => 
    s.segmentType.symbolicId === 'break_segment');

  const breakTime = breaks
    .map((b: any) => 
      std.minutesDiff(b.startDateTimeUTC, b.endDateTimeUTC))
    .reduce((p: number, c: number) => 
      p + c, 0);

  const breakTimes = breaks.map((b: any) => 
    std.time(b.startDateTimeUTC))
    .join(', ');

  const breakDisplay = breakTime > 0 ? `${breakTime} minutes break at ${breakTimes}`: 'no breaks';
  const elapsed = std.hoursDiff(start, end);
  const dispElapsed = elapsed.toPrecision(3).replace(/0+$/, '0');
  const paidElapsed = (elapsed - (breakTime / 60)).toPrecision(3).replace(/0+$/, '0');
  const job  = e.job;

  const summary = `${EMPLOYER} from ${std.time(start)} to ${std.time(end)} (${dispElapsed} [${paidElapsed}] hours)`;
  const description = `Shift in ${job} at ${EMPLOYER} from ${std.time(start)} to ${std.time(end)} on ${std.date(start)}. ${dispElapsed} hours with ${breakDisplay}`;
  const TZ = 'America/Chicago';
  const tzid = `;TZID=${TZ}`;

  const iCal = [
    `BEGIN:VEVENT`,
    `UID: ${ std.hash(std.iCalDate(start) + std.iCalDate(end)) }`,
    `DTSTAMP${tzid}:${std.iCalDate(start)}`,
    `ORGANIZER;CN=${name}:MAILTO:${email}`,
    `DTSTART${tzid}:${std.iCalDate(start)}`,
    `DTEND${tzid}:${std.iCalDate(end)}`,
    `${iCalWrapping(`SUMMARY:${summary}`)}`,
    `${iCalWrapping(`DESCRIPTION:${description}`)}`,
    `END:VEVENT`
  ].join("\r\n")

  return {
  ...e,
  iCal
  };
};

const apiUri = (path: string) => `https://${KRO_HOSTNAME}${path}`;

const getEmployee = async () => {
  const resp = await fetch(apiUri('/get/userFeatures'));
  if (!resp.ok) {
    throw new Error("Employee lookup error!");
  }
  if (resp.status.toString().indexOf('2') !== 0) {
    throw new Error(`Employee lookup failed: ${resp.status} ${resp.statusText}`);
  }
  return resp.json();
}

const getXSRFToken = (): string => document.cookie
  .split(/;\s*/)
  .map(s => s.split(/=/))
  .filter(p => p[0]=='XSRF-TOKEN')
  .reduce((_, c) => c[1], "");

const gengerateCalendarRequest = () => {
  const now = new Date();
  const startDate = std.dateAdd(now, -14)
  const endDate = std.dateAdd(now, 14);

  return {
    "startDate": startDate,
    "endDate": endDate,
    "types": [{
      "name": "approvedtimeoffrequest"
    }, {
      "name": "holiday"
    }, {
      "name": "inprogresstimeoffrequest"
    }, {
      "name": "openshift"
    }, {
      "name": "paycodeedit"
    }, {
      "name": "regularshift"
    }, {
      "name": "scheduletag"
    }, {
      "name": "transfershift"
    }]
  };
}

const getUserInfo = async () => std.getREST(apiUri('/get/UserInfo'))

const fetchCalendar = async (name: string, email: string) => {
  // const user = await getUserInfo();
  // console.log('USER:', user);
  const xsrfToken = await getXSRFToken();
  const calendarRequest = gengerateCalendarRequest();

  const body = await std.postREST(
    apiUri('/myschedule/eventDispatcher'),
    JSON.stringify(calendarRequest),
    { "x-xsrf-token": xsrfToken },
  );

  return body
    .filter((e: any) => 
      e && 
      e.orderedSegments &&
      Array.isArray(e.orderedSegments) &&
      e.orderedSegments.length >= 1 &&
      e.orderedSegments[0].startDateTimeUTC)
    .map((e: any) => {
      // console.log(e);
      const ice = iCalEvent(e, name, email);
      return ice;
    });
};

const generateCalendar = async (name: string, email: string) => {
  const cal = await fetchCalendar(name, email);
  // console.log("Calendar:", cal);
  const iCalEvents = cal
    .map((c: any) => c.iCal).join("\n");
  const iCalFull = [
    `BEGIN:VCALENDAR`,
    `VERSION:2.0`,
    `PRODID:-//hacksw/handcal//NONSGML v1.0//EN`,
    `${iCalEvents}`,
    `END:VCALENDAR`
  ].join("\r\n");

  // console.log("\n\n");
  // console.log(iCalFull);

  std.downloadURI(
    std.makeDataURI("text/calendar", iCalFull),
  "schedule.vcs");
};


const getEmpHead = async (c?: number): Promise<Element | null> => {
  try {
    const el = await std.retrySelector('#employeeProfileImage_');
    return el[0];
  } catch (err) {
    return null;
  }
};

const getToolbar = async (c?: number): Promise<HTMLElement | null> => {
  const cnt = typeof c === 'undefined' ? 1 : c;
  dbg(`tb/inv=${cnt}`);
  const toolbar = document.getElementById('firstElement');
  if (toolbar !== null) {
    dbg(`retrieved toolbar on try ${cnt}`);
    return toolbar.parentElement;
  } else {
    dbg(`tb/miss=${cnt}`);
  }
  if (cnt >= MAX_TRIES) {
    dbg(`giving up on toolbar after ${cnt}!`);
    return null;
  }
  await std.sleep(250);
  if (toolbar === null) { 
    dbg(`tb/recinv=${cnt}`);
    return getToolbar(cnt + 1);
  }
  return null;
};

const begin = async () => {
  // const schedHead = await getToolbar();
  // if (schedHead == null || schedHead.parentElement == null) {
  //   console.error(`Couldn't finmd the schedule header`)
  //   return;
  // }

  const header = await getEmpHead();
  if (header == null || header.parentElement == null) {
    console.error(`Couldn't find the header`)
    return;
  }
  const button = document.createElement('button');
  button.setAttribute('value', 'Download vCal');
  button.innerHTML = 'Download vCal';
  button.addEventListener('click', () => generateCalendar('Me', 'me@host.com'));
  header.parentElement.appendChild(button);
};

std.runForPath('/wfd/home', begin);
