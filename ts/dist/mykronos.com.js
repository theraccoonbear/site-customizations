"use strict";

// src/lib/SipHash.ts
var SipHash = function() {
  "use strict";
  function r(r2, n2) {
    var t2 = r2.l + n2.l, h2 = { h: r2.h + n2.h + (t2 / 2 >>> 31) >>> 0, l: t2 >>> 0 };
    r2.h = h2.h, r2.l = h2.l;
  }
  function n(r2, n2) {
    r2.h ^= n2.h, r2.h >>>= 0, r2.l ^= n2.l, r2.l >>>= 0;
  }
  function t(r2, n2) {
    var t2 = { h: r2.h << n2 | r2.l >>> 32 - n2, l: r2.l << n2 | r2.h >>> 32 - n2 };
    r2.h = t2.h, r2.l = t2.l;
  }
  function h(r2) {
    var n2 = r2.l;
    r2.l = r2.h, r2.h = n2;
  }
  function e(e2, l2, o2, u2) {
    r(e2, l2), r(o2, u2), t(l2, 13), t(u2, 16), n(l2, e2), n(u2, o2), h(e2), r(o2, l2), r(e2, u2), t(l2, 17), t(u2, 21), n(l2, o2), n(u2, e2), h(o2);
  }
  function l(r2, n2) {
    return r2[n2 + 3] << 24 | r2[n2 + 2] << 16 | r2[n2 + 1] << 8 | r2[n2];
  }
  function o(r2, t2) {
    "string" == typeof t2 && (t2 = u(t2));
    var h2 = { h: r2[1] >>> 0, l: r2[0] >>> 0 }, o2 = { h: r2[3] >>> 0, l: r2[2] >>> 0 }, i = { h: h2.h, l: h2.l }, a = h2, f = { h: o2.h, l: o2.l }, c = o2, s = t2.length, v = s - 7, g = new Uint8Array(new ArrayBuffer(8));
    n(i, { h: 1936682341, l: 1886610805 }), n(f, { h: 1685025377, l: 1852075885 }), n(a, { h: 1819895653, l: 1852142177 }), n(c, { h: 1952801890, l: 2037671283 });
    for (var y = 0; y < v; ) {
      var d = { h: l(t2, y + 4), l: l(t2, y) };
      n(c, d), e(i, f, a, c), e(i, f, a, c), n(i, d), y += 8;
    }
    g[7] = s;
    for (var p = 0; y < s; )
      g[p++] = t2[y++];
    for (; p < 7; )
      g[p++] = 0;
    var w = { h: g[7] << 24 | g[6] << 16 | g[5] << 8 | g[4], l: g[3] << 24 | g[2] << 16 | g[1] << 8 | g[0] };
    n(c, w), e(i, f, a, c), e(i, f, a, c), n(i, w), n(a, { h: 0, l: 255 }), e(i, f, a, c), e(i, f, a, c), e(i, f, a, c), e(i, f, a, c);
    var _ = i;
    return n(_, f), n(_, a), n(_, c), _;
  }
  function u(r2) {
    if ("function" == typeof TextEncoder)
      return new TextEncoder().encode(r2);
    r2 = unescape(encodeURIComponent(r2));
    for (var n2 = new Uint8Array(r2.length), t2 = 0, h2 = r2.length; t2 < h2; t2++)
      n2[t2] = r2.charCodeAt(t2);
    return n2;
  }
  return { hash: o, hash_hex: function(r2, n2) {
    var t2 = o(r2, n2);
    return ("0000000" + t2.h.toString(16)).substr(-8) + ("0000000" + t2.l.toString(16)).substr(-8);
  }, hash_uint: function(r2, n2) {
    var t2 = o(r2, n2);
    return 4294967296 * (2097151 & t2.h) + t2.l;
  }, string16_to_key: function(r2) {
    var n2 = u(r2);
    if (16 !== n2.length)
      throw Error("Key length must be 16 bytes");
    var t2 = new Uint32Array(4);
    return t2[0] = l(n2, 0), t2[1] = l(n2, 4), t2[2] = l(n2, 8), t2[3] = l(n2, 12), t2;
  }, string_to_u8: u };
}();

// src/lib/standard.ts
var ready = (fn) => {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};
window.ready = ready;
var MAX_TRIES = 100;
var retrySelector = async (query, cnt) => {
  cnt = typeof cnt === "number" ? cnt : 1;
  const elem = document.querySelectorAll(query);
  if (elem && elem.length > 0) {
    return elem;
  } else if (cnt > MAX_TRIES) {
    throw new Error(`Unable to find '${query}'; giving up.`);
  }
  console.debug(`#${cnt} selector miss on '${query}'`);
  await sleep(100);
  return retrySelector(query, cnt + 1);
};
var runForPath = async (path, func) => {
  const rgx = new RegExp(path, "i");
  if (rgx.test(document.location.pathname)) {
    console.log(`Conditional path match for "${path}"`);
    ready(() => {
      console.log(`Executing for "${path}"`);
      func();
    });
  }
};
var makeDataURI = (mimeType, data) => `data:${mimeType};charset=utf-8;base64,${btoa(data)}`;
var downloadURI = (uri, name) => {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
};
var hash = (m) => stringToUUID(SipHash.hash_hex("calendarFoo", m));
var minutesDiff = (s, e) => ((typeof e === "string" ? new Date(e) : e).getTime() - (typeof s === "string" ? new Date(s) : s).getTime()) / 1e3 / 60;
var hoursDiff = (s, e) => minutesDiff(s, e) / 60;
var sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var dateAdd = (date2, days) => {
  const d = new Date(date2);
  d.setDate(date2.getDate() + days);
  return d.toISOString().split("T")[0];
};
var iCalDate = (dt) => {
  const d = new Date(dt);
  const year = d.getFullYear();
  const mon = `${d.getMonth() + 1 < 10 ? "0" : ""}${d.getMonth() + 1}`;
  const dom = (d.getDate() < 10 ? "0" : "") + d.getDate();
  const hr = (d.getHours() < 10 ? "0" : "") + d.getHours();
  const min = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
  const sec = (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();
  return `${year}${mon}${dom}T${hr}${min}${sec}`;
};
var time = (dt) => (typeof dt === "string" ? new Date(dt) : dt).toLocaleTimeString(
  "en-US",
  { hour12: true, hour: "numeric", minute: "2-digit", second: "2-digit" }
).replace(/:\d{2}\s+/, " ");
var date = (dt) => dt.toLocaleDateString(
  "en-US",
  { weekday: "short", month: "short", day: "numeric" }
);
var stringToUUID = (str) => {
  str = str.replace("-", "");
  return "xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx".replace(/[x]/g, (c, p) => str[p % str.length]);
};
var srt = (m) => m.toLowerCase().replace(/[a-z]/gi, (letter) => String.fromCharCode(letter.charCodeAt(0) + (letter.toLowerCase() <= "m" ? 13 : -13)));
var makeRequest = async (method, uri, payload, headers, respType) => {
  method = method.trim().toUpperCase();
  payload = typeof payload === "undefined" || payload === null ? null : payload.toString();
  headers = typeof headers === "undefined" ? {} : { ...headers };
  respType = typeof respType === "string" && respType.toLowerCase() === "text" ? "text" : "json";
  let body, contentType;
  if (method != "get" && method != "head") {
    body = { body: payload };
    contentType = { "content-type": "application/json" };
  }
  const resp = await fetch(uri, {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      ...contentType,
      "cache-control": "no-cache",
      "device-type": "desktop",
      "page": "home",
      "pragma": "no-cache",
      "sec-ch-ua": `"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"`,
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      ...headers
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    ...body,
    "method": method,
    "mode": "cors",
    "credentials": "include"
  });
  if (!resp.ok) {
    console.warn("Failed request:", uri, resp);
    throw new Error(`Error performing ${method} for ${uri}`);
  }
  if (resp.status.toString().indexOf("2") !== 0) {
    throw new Error(`Received ${resp.status} ${resp.statusText}. ${method.trim().toUpperCase()} ${uri}`);
  }
  return respType == "text" ? resp.text() : resp.json();
};
var postREST = (uri, payload, headers) => makeRequest("post", uri, payload, headers);
console.log("your script debugging entry point here...");

// src/mykronos.com.ts
var KRO_HOSTNAME = srt(atob("ZXJwZXJuZ3ZiYW55cmRodmMtZmYzLmNlcS56bHhlYmFiZi5wYno="));
var EMPLOYER = atob("UkVJ");
var iCalWrapping = (s) => {
  let c = 1;
  const matches = s.match(/.{1,75}/g) ?? [];
  return matches.map((p) => (
    // Indent each block of text
    `${p}\r
 ${" ".repeat(c++)}`
  )).join("").trim();
};
var iCalEvent = (e, name, email) => {
  const start = new Date(e.orderedSegments[0].startDateTimeUTC);
  const end = new Date(e.orderedSegments[e.orderedSegments.length - 1].endDateTimeUTC);
  const breaks = e.orderedSegments.filter((s) => s.segmentType.symbolicId === "break_segment");
  const breakTime = breaks.map((b) => minutesDiff(b.startDateTimeUTC, b.endDateTimeUTC)).reduce((p, c) => p + c, 0);
  const breakTimes = breaks.map((b) => time(b.startDateTimeUTC)).join(", ");
  const breakDisplay = breakTime > 0 ? `${breakTime} minutes break at ${breakTimes}` : "no breaks";
  const elapsed = hoursDiff(start, end);
  const dispElapsed = elapsed.toPrecision(3).replace(/0+$/, "0");
  const paidElapsed = (elapsed - breakTime / 60).toPrecision(3).replace(/0+$/, "0");
  const job = e.job;
  const summary = `${EMPLOYER} from ${time(start)} to ${time(end)} (${dispElapsed} [${paidElapsed}] hours)`;
  const description = `Shift in ${job} at ${EMPLOYER} from ${time(start)} to ${time(end)} on ${date(start)}. ${dispElapsed} hours with ${breakDisplay}`;
  const TZ = "America/Chicago";
  const tzid = `;TZID=${TZ}`;
  const iCal = [
    `BEGIN:VEVENT`,
    `UID: ${hash(iCalDate(start) + iCalDate(end))}`,
    `DTSTAMP${tzid}:${iCalDate(start)}`,
    `ORGANIZER;CN=${name}:MAILTO:${email}`,
    `DTSTART${tzid}:${iCalDate(start)}`,
    `DTEND${tzid}:${iCalDate(end)}`,
    `${iCalWrapping(`SUMMARY:${summary}`)}`,
    `${iCalWrapping(`DESCRIPTION:${description}`)}`,
    `END:VEVENT`
  ].join("\r\n");
  return {
    ...e,
    iCal
  };
};
var apiUri = (path) => `https://${KRO_HOSTNAME}${path}`;
var getXSRFToken = () => document.cookie.split(/;\s*/).map((s) => s.split(/=/)).filter((p) => p[0] == "XSRF-TOKEN").reduce((_, c) => c[1], "");
var gengerateCalendarRequest = () => {
  const now = /* @__PURE__ */ new Date();
  const startDate = dateAdd(now, -14);
  const endDate = dateAdd(now, 14);
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
};
var fetchCalendar = async (name, email) => {
  const xsrfToken = await getXSRFToken();
  const calendarRequest = gengerateCalendarRequest();
  const body = await postREST(
    apiUri("/myschedule/eventDispatcher"),
    JSON.stringify(calendarRequest),
    { "x-xsrf-token": xsrfToken }
  );
  return body.filter((e) => e && e.orderedSegments && Array.isArray(e.orderedSegments) && e.orderedSegments.length >= 1 && e.orderedSegments[0].startDateTimeUTC).map((e) => {
    const ice = iCalEvent(e, name, email);
    return ice;
  });
};
var generateCalendar = async (name, email) => {
  const cal = await fetchCalendar(name, email);
  const iCalEvents = cal.map((c) => c.iCal).join("\n");
  const iCalFull = [
    `BEGIN:VCALENDAR`,
    `VERSION:2.0`,
    `PRODID:-//hacksw/handcal//NONSGML v1.0//EN`,
    `${iCalEvents}`,
    `END:VCALENDAR`
  ].join("\r\n");
  downloadURI(
    makeDataURI("text/calendar", iCalFull),
    "schedule.vcs"
  );
};
var getEmpHead = async (c) => {
  try {
    const el = await retrySelector("#employeeProfileImage_");
    return el[0];
  } catch (err) {
    return null;
  }
};
var begin = async () => {
  const header = await getEmpHead();
  if (header == null || header.parentElement == null) {
    console.error(`Couldn't find the header`);
    return;
  }
  const button = document.createElement("button");
  button.setAttribute("value", "Download vCal");
  button.innerHTML = "Download vCal";
  button.addEventListener("click", () => generateCalendar("Me", "me@host.com"));
  header.parentElement.appendChild(button);
};
runForPath("/wfd/home", begin);
