// @include standard.js
// @include SipHash.js

const stringToUUID = (str) => {
  str = str.replace('-', '');
  return 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, (c, p) => str[p % str.length]);
};

const MAX_TRIES = 100;

const getToolbar = async (c) => {
  const cnt = typeof c === 'undefined' ? 1 : c;
  // console.info(`tb/inv=${cnt}`);
  const toolbar = document.getElementById('html.employeecalendar.toolbar');
  if (toolbar !== null) {
    // console.info(`retrieved toolbar on try ${cnt}`);
    return toolbar.parentElement;
  } else {
    // console.info(`tb/miss=${cnt}`);
  }
  if (cnt >= MAX_TRIES) {
    // console.warn(`giving up on toolbar after ${cnt}!`);
    return null;
  }
  await sleep(250);
  if (toolbar === null) { 
    // console.info(`tb/recinv=${cnt}`);
    return getToolbar(cnt + 1);
  }
  return null;
};

const err = (message, payload) => {
  console.error(message);
  return typeof payload === 'undefined' ? [] : payload;
};

const dateAdd = (date, days) => {
  const d = new Date(date);
  d.setDate(date.getDate() + days);
  return d.toISOString().split('T')[0];
};

const isoDate = (dt) => dt.toISOString().replace(/[:-]+/g, '').replace(/\..*$/, '');

const iCalDate = (dt) => {
  const d = new Date(dt);
  const year = d.getFullYear();
  const mon = `${(d.getMonth() + 1 < 10 ? '0' : '')}${d.getMonth() + 1}`;
  const dom = (d.getDate() < 10 ? '0' : '') + d.getDate();
  const hr = (d.getHours() < 10 ? '0' : '') + d.getHours();
  const min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  const sec = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
  return `${year}${mon}${dom}T${hr}${min}${sec}`;
}

const time = dt => dt
  .toLocaleTimeString('en-US', 
    { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }
  )
  .replace(/:\d{2}\s+/, ' ');

const date = dt => dt
  .toLocaleDateString('en-US',
    { weekday: 'short', month: 'short', day: 'numeric' }
  );

const hash = (m) => stringToUUID(SipHash.hash_hex("calendarFoo", m))

const iCalEvent = (event, name, email) => {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const iCal = `BEGIN:VEVENT
UID: ${ hash(iCalDate(start) + iCalDate(end)) }
DTSTAMP;TZID=America/Chicago:${iCalDate(start)}
ORGANIZER;CN=${name}:MAILTO:${email}
DTSTART;TZID=America/Chicago:${iCalDate(start)}
DTEND;TZID=America/Chicago:${iCalDate(end)}
SUMMARY:REI from ${time(start)} to ${time(end)} on ${date(start)}
END:VEVENT`
  return {
  ...event,
  iCal
  };
};

const makeReqHeaders = (csrfToken) => ({
  "accept": "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.9",
  "content-type": "application/json",
  "csrf_tok": csrfToken,
  "krn-functional-area": "SCHEDULING",
  "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"macOS\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-requested-with": "true",
  "x-rest-api": "true",
  "Referrer-Policy": "strict-origin-when-cross-origin"
});

const getCSRFToken = async () => {
  const resp = await fetch("https://rei.kronos.net/wfc/bridge/datapreparation/rest/1.0/getCSRFTokenValue", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      "x-rest-api": "true",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
  });

  if (!resp.ok) { return err(`Bad HTTP response on CSRF ${resp.status} ${resp.statusText}`); }
  return await resp.text();
};

const getModel = async (csrfToken) => {
  const resp = await fetch("https://rei.kronos.net/wfc/bridge/navigator/model", {
    "headers": makeReqHeaders(csrfToken),
    "referrer": "https://rei.kronos.net/wfcstatic/applications/navigator/html5/dist/container/index.html?version=8.1.14.1062",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });

  if (!resp.ok || resp.status.toString().indexOf('4') === 0 || resp.status.toString().indexOf('5') === 0) {
    console.error("Error getting model", resp.status, resp.statusText);
    return null;
  }

  return resp.json();
};

const getToken = (model, which) => {
  if (!model || 
      !model.constraintData ||
      !Array.isArray(model.constraintData)
  ) {
    throw new Error("Bad model (no constraintData array):", model);
  }

  const constraint = [...model.constraintData.filter(c => c.widgetLabel && c.widgetLabel == which), null][0];
  if (constraint === null) {
    throw new Error(`Couldn't find "${which}" token in constraintData:`, model.constraintData);
  }
  return constraint.token;
}

const fetchCalendar = async (name, email) => {
  const now = new Date();
  const startDate = dateAdd(now, -14)
  const endDate = dateAdd(now, 14);

  const csrfToken = await getCSRFToken();
  const model = await getModel(csrfToken);
  const urlToken = await getToken(model, "My Calendar");
  
  const resp = await fetch(`https://rei.kronos.net/wfc/bridge/ngui/employeecalendar/rest/1.0/calendarContent?end=${endDate}&start=${startDate}&token=${urlToken}`, {
    "headers": makeReqHeaders(csrfToken),
    "body": "{}",
    "method": "POST"
  });
  if (!resp.ok) { return err(`Bad HTTP response ${resp.status} ${resp.statusText}`); }
  const body = await resp.json();
  if (!body.events || !Array.isArray(body.events)) { return err("No events!"); }
  return body
    .events
    .filter(e =>
      typeof e.eventType !== 'undefined' && 
      e.eventType === 'SHIFT'
    )
    // .map(e => { console.log(e); return e; })
    .map(e => iCalEvent(e, name, email));
};

const generateCalendar = async (name, email) => {
  const cal = await fetchCalendar(name, email);
  // console.log("Calendar:", cal);
  const iCalEvents = cal
    .map(c => c.iCal).join("\n");
  const iCalFull = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
${iCalEvents}
END:VCALENDAR`;

  console.log("\n\n");
  console.log(iCalFull);

  downloadURI(makeDataURI("text/calendar", iCalFull), "schedule.vcs");
};


const cloneButton = (srcBtn, label, icon) => {
  const text = srcBtn
    .getInnerHTML()
    .replace(/id="([^"]+)"/g, 'id="$1_foo"');
  const container = document.createElement('div');
  container.innerHTML = text;

  const iconElem = container.querySelector('button i');
  iconElem.classList = "";
  iconElem.classList.add(`icon-k-${icon}`);

  const lblElem = container.querySelector('.icon-label span');
  lblElem.innerHTML = label;

  return container.children.item(0);
}

const begin = async () => {
  if (document.location.pathname.indexOf('/navigator/html5/dist/container/index.html') !== -1) {
    return;
  }

  console.log('loading calendar thingy');
  const toolbar = await getToolbar();
  if (toolbar === null) {
    console.error(`Couldn't find toolbar`);
    return;
  }

  // @toto: make dynamic
  const name = 'My Name';
  const email = 'myemail@hostname.com';


  const tmpl = toolbar.children.item(0);
  const btn = cloneButton(tmpl, 'iCal', 'document');
  toolbar.children.item(0).appendChild(btn);
  btn.addEventListener('click', () => generateCalendar(name, email));
};

ready(begin);
