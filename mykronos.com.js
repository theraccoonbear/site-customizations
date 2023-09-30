"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/lib/SipHash.js
var require_SipHash = __commonJS({
  "src/lib/SipHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SipHash = void 0;
    exports.SipHash = function() {
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
  }
});

// src/lib/standard.ts
var import_SipHash = __toESM(require_SipHash());
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
var mkButton = (label, action, classes = []) => {
  const button = document.createElement("button");
  button.setAttribute("value", label);
  button.innerHTML = label;
  button.addEventListener("click", action);
  button.classList.add(...classes);
  return button;
};
var makeDataURI = (mimeType, data) => `data:${mimeType};charset=utf-8;base64,${btoa(unescape(encodeURIComponent(data)))}`;
var downloadURI = (uri, name) => {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
};
var hash = (m) => stringToUUID(import_SipHash.SipHash.hash_hex("calendarFoo", m));
var minutesDiff = (s, e) => ((typeof e === "string" ? new Date(e) : e).getTime() - (typeof s === "string" ? new Date(s) : s).getTime()) / 1e3 / 60;
var hoursDiff = (s, e) => minutesDiff(s, e) / 60;
var sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var addDays = (date2, days) => {
  const d = new Date(date2);
  d.setDate(new Date(date2).getDate() + days);
  return d;
};
var simpleDate = (d) => d.toISOString().split("T")[0];
var getDateRange = (range, now = /* @__PURE__ */ new Date()) => [
  addDays(now, -Math.abs(range || 14)),
  addDays(now, Math.abs(range || 14))
];
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
).replace(/:\d{2}\s+/, " ").toLowerCase();
var date = (dt) => dt.toLocaleDateString(
  "en-US",
  { weekday: "short", month: "short", day: "numeric" }
);
var stringToUUID = (str) => {
  str = str.replace("-", "");
  return "xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx".replace(/[x]/g, (_, p) => str[p % str.length]);
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
var JOB_FUNCTION = {
  "Footwear": "\u{1F45E}",
  "Stocking": "\u{1F6D2}",
  "Customer Service": "\u{1F4B3}",
  "Camp": "\u{1F3D5}\uFE0F",
  "Hardgoods": "\u{1F9BE}",
  "Action Sports": "\u{1F6F6}",
  "Shipping": "\u{1F4E6}",
  "New Hire Onboarding": "\u{1F9D1}\u200D\u{1F393}",
  "Operations-TRN": "\u{1F9D1}\u200D\u{1F393}",
  "Guided Shift Cross-Training": "\u{1F9D1}\u200D\u{1F393}",
  "Clothing": "\u{1F455}",
  "Softgoods": "\u{1F9E3}",
  "Shop": "\u{1F527}",
  "Shop Management": "\u{1F9D1}\u200D\u{1F527}",
  "Order Fulfillment": "\u{1F4E6}",
  "Visual": "\u{1F9D1}\u200D\u{1F3A8}",
  "Banker": "\u{1F3E6}",
  "Management": "\u{1F4CB}",
  "Price Changes": "\u{1F3F7}\uFE0F"
};
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
var prepEvent = (ev) => {
  const e = { ...ev };
  e.startTime = new Date(e.orderedSegments[0].startDateTimeUTC);
  e.endTime = new Date(e.orderedSegments[e.orderedSegments.length - 1].endDateTimeUTC);
  e.timeByJob = {};
  let max = 0;
  e.primaryShiftJob = "?";
  e.work = e.orderedSegments.filter((s) => s.segmentType.symbolicId !== "break_segment").map((s) => {
    const idParts = s.orgNode.path.split(/\//g);
    e.id = idParts.pop() || "foo";
    if (typeof e.timeByJob[e.id] === "undefined") {
      e.timeByJob[e.id] = 0;
    }
    e.timeByJob[e.id] += minutesDiff(s.startDateTimeUTC, s.endDateTimeUTC);
    if (e.timeByJob[e.id] >= max) {
      max = e.timeByJob[e.id];
      e.primaryShiftJob = e.id;
    }
    return e;
  });
  e.breaks = e.orderedSegments.filter((s) => s.segmentType.symbolicId === "break_segment");
  e.breakTime = e.breaks.map((b) => minutesDiff(b.startDateTimeUTC, b.endDateTimeUTC)).reduce((p, c) => p + c, 0);
  e.breakTimes = e.breaks.map((b) => time(b.startDateTimeUTC)).join(", ");
  e.breakDisplay = e.breakTime > 0 ? `${e.breakTime} minutes break at ${e.breakTimes}` : "no breaks";
  e.elapsed = hoursDiff(e.startTime, e.endTime);
  e.dispElapsed = e.elapsed.toPrecision(3).replace(/0+$/, "0");
  e.paidElapsed = (e.elapsed - e.breakTime / 60).toPrecision(3).replace(/0+$/, "0");
  return e;
};
var summaryLine = (e) => `${EMPLOYER} ${jobLine(e.primaryShiftJob)} from ${time(e.startTime)} to ${time(e.endTime)} (${e.dispElapsed} [${e.paidElapsed}] hours)`;
var descriptionLine = (e) => `Shift in ${jobLine(e.primaryShiftJob)} at ${EMPLOYER} from ${time(e.startTime)} to ${time(e.endTime)} on ${date(e.startTime)}. ${e.dispElapsed} hours with ${e.breakDisplay}`;
var iCalEvent = (ev, name, email) => {
  const e = prepEvent(ev);
  const summary = summaryLine(e);
  const description = descriptionLine(e);
  const TZ = "America/Chicago";
  const tzid = `;TZID=${TZ}`;
  const iCal = [
    `BEGIN:VEVENT`,
    `UID: ${hash(iCalDate(e.startTime) + iCalDate(e.endTime))}`,
    `DTSTAMP${tzid}:${iCalDate(e.startTime)}`,
    `ORGANIZER;CN=${name}:MAILTO:${email}`,
    `DTSTART${tzid}:${iCalDate(e.startTime)}`,
    `DTEND${tzid}:${iCalDate(e.endTime)}`,
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
var jobLine = (job) => `${job}${typeof JOB_FUNCTION[job] !== "undefined" ? ` ${JOB_FUNCTION[job]}` : ""}`;
var gengerateCalendarRequest = () => {
  const range = getDateRange();
  const startDate = simpleDate(range[0]);
  const endDate = simpleDate(range[1]);
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
var calendarEventFilter = (e) => {
  const retVal = e && e.orderedSegments && Array.isArray(e.orderedSegments) && e.orderedSegments.length >= 1 && e.orderedSegments[0].startDateTimeUTC;
  return retVal;
};
var fetchCalendar = async (name = "", email = "") => {
  const xsrfToken = await getXSRFToken();
  const calendarRequest = gengerateCalendarRequest();
  const body = await postREST(
    apiUri("/myschedule/eventDispatcher"),
    JSON.stringify(calendarRequest),
    { "x-xsrf-token": xsrfToken }
  );
  return body.filter(calendarEventFilter).map((e) => iCalEvent(e, name, email));
};
var simpleEntry = (ev) => prepEvent(ev) && [
  ` *`,
  date(ev.startTime),
  time(ev.startTime),
  "to",
  time(ev.endTime),
  "in",
  jobLine(ev.primaryShiftJob)
].join(" ");
var generateSimpleCalendar = async () => {
  const cal = await fetchCalendar();
  const now = /* @__PURE__ */ new Date();
  const text = cal.map(prepEvent).filter((e) => e.startTime >= now).map(simpleEntry).join("\n");
  console.log(text);
  const data = makeDataURI("text/plain", text);
  const range = getDateRange();
  const filename = `schedule.txt`;
  downloadURI(data, filename);
};
var generateCalendar = async (name, email, extension) => {
  const cal = await fetchCalendar(name, email);
  const iCalEvents = cal.map((c) => c.iCal).join("\n");
  const iCalFull = [
    `BEGIN:VCALENDAR`,
    `VERSION:2.0`,
    `PRODID:-//hacksw/handcal//NONSGML v1.0//EN`,
    `${iCalEvents}`,
    `END:VCALENDAR`
  ].join("\r\n");
  const data = makeDataURI("text/calendar", iCalFull);
  const filename = `schedule.${extension}`;
  downloadURI(data, filename);
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
  const butVCal = mkButton("vCal (Google)", () => generateCalendar("Me", "me@host.com", "vcs"));
  const butICal = mkButton("iCal (Outlook)", () => generateCalendar("Me", "me@host.com", "ics"));
  const butTxtCal = mkButton("Text", () => generateSimpleCalendar());
  header.parentElement.appendChild(butVCal);
  header.parentElement.appendChild(butICal);
  header.parentElement.appendChild(butTxtCal);
};
runForPath("/wfd/home", begin);
