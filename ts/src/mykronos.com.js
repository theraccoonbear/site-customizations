"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// @include standard.js
const std = __importStar(require("./lib/standard"));
const debugging = false;
const dbg = (...stuff) => debugging ? console.log(...stuff) : null;
const MAX_TRIES = 100;
const KRO_HOSTNAME = std.srt(atob('ZXJwZXJuZ3ZiYW55cmRodmM' + 'tZmYzLmNlcS56bHhlYmFiZi5wY' + 'no='));
const EMPLOYER = atob('Uk' + 'VJ');
const iCalWrapping = (s) => {
    var _a;
    let c = 1;
    const matches = (_a = s.match(/.{1,75}/g)) !== null && _a !== void 0 ? _a : [];
    return matches
        .map((p) => // Indent each block of text
     `${p}\r\n ${" ".repeat(c++)}`)
        .join('')
        .trim();
};
const iCalEvent = (e, name, email) => {
    const start = new Date(e.orderedSegments[0].startDateTimeUTC);
    const end = new Date(e.orderedSegments[e.orderedSegments.length - 1].endDateTimeUTC);
    const breaks = e.orderedSegments.filter((s) => s.segmentType.symbolicId === 'break_segment');
    const breakTime = breaks
        .map((b) => std.minutesDiff(b.startDateTimeUTC, b.endDateTimeUTC))
        .reduce((p, c) => p + c, 0);
    const breakTimes = breaks.map((b) => std.time(b.startDateTimeUTC))
        .join(', ');
    const breakDisplay = breakTime > 0 ? `${breakTime} minutes break at ${breakTimes}` : 'no breaks';
    const elapsed = std.hoursDiff(start, end);
    const dispElapsed = elapsed.toPrecision(3).replace(/0+$/, '0');
    const paidElapsed = (elapsed - (breakTime / 60)).toPrecision(3).replace(/0+$/, '0');
    const job = e.job;
    const summary = `${EMPLOYER} from ${std.time(start)} to ${std.time(end)} (${dispElapsed} [${paidElapsed}] hours)`;
    const description = `Shift in ${job} at ${EMPLOYER} from ${std.time(start)} to ${std.time(end)} on ${std.date(start)}. ${dispElapsed} hours with ${breakDisplay}`;
    const TZ = 'America/Chicago';
    const tzid = `;TZID=${TZ}`;
    const iCal = [
        `BEGIN:VEVENT`,
        `UID: ${std.hash(std.iCalDate(start) + std.iCalDate(end))}`,
        `DTSTAMP${tzid}:${std.iCalDate(start)}`,
        `ORGANIZER;CN=${name}:MAILTO:${email}`,
        `DTSTART${tzid}:${std.iCalDate(start)}`,
        `DTEND${tzid}:${std.iCalDate(end)}`,
        `${iCalWrapping(`SUMMARY:${summary}`)}`,
        `${iCalWrapping(`DESCRIPTION:${description}`)}`,
        `END:VEVENT`
    ].join("\r\n");
    return Object.assign(Object.assign({}, e), { iCal });
};
const apiUri = (path) => `https://${KRO_HOSTNAME}${path}`;
const getEmployee = () => __awaiter(void 0, void 0, void 0, function* () {
    const resp = yield fetch(apiUri('/get/userFeatures'));
    if (!resp.ok) {
        throw new Error("Employee lookup error!");
    }
    if (resp.status.toString().indexOf('2') !== 0) {
        throw new Error(`Employee lookup failed: ${resp.status} ${resp.statusText}`);
    }
    return resp.json();
});
const getXSRFToken = () => document.cookie
    .split(/;\s*/)
    .map(s => s.split(/=/))
    .filter(p => p[0] == 'XSRF-TOKEN')
    .reduce((_, c) => c[1], "");
const gengerateCalendarRequest = () => {
    const now = new Date();
    const startDate = std.dateAdd(now, -14);
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
};
const getUserInfo = () => __awaiter(void 0, void 0, void 0, function* () { return std.getREST(apiUri('/get/UserInfo')); });
const fetchCalendar = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = await getUserInfo();
    // console.log('USER:', user);
    const xsrfToken = yield getXSRFToken();
    const calendarRequest = gengerateCalendarRequest();
    const body = yield std.postREST(apiUri('/myschedule/eventDispatcher'), JSON.stringify(calendarRequest), { "x-xsrf-token": xsrfToken });
    return body
        .filter((e) => e &&
        e.orderedSegments &&
        Array.isArray(e.orderedSegments) &&
        e.orderedSegments.length >= 1 &&
        e.orderedSegments[0].startDateTimeUTC)
        .map((e) => {
        // console.log(e);
        const ice = iCalEvent(e, name, email);
        return ice;
    });
});
const generateCalendar = (name, email, filename) => __awaiter(void 0, void 0, void 0, function* () {
    const cal = yield fetchCalendar(name, email);
    // console.log("Calendar:", cal);
    const iCalEvents = cal
        .map((c) => c.iCal).join("\n");
    const iCalFull = [
        `BEGIN:VCALENDAR`,
        `VERSION:2.0`,
        `PRODID:-//hacksw/handcal//NONSGML v1.0//EN`,
        `${iCalEvents}`,
        `END:VCALENDAR`
    ].join("\r\n");
    const data = std.makeDataURI("text/calendar", iCalFull);
    std.downloadURI(data, filename);
});
const getEmpHead = (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const el = yield std.retrySelector('#employeeProfileImage_');
        return el[0];
    }
    catch (err) {
        return null;
    }
});
const mkButton = (label, action) => {
    const button = document.createElement('button');
    button.setAttribute('value', label);
    button.innerHTML = label;
    button.addEventListener('click', action);
    return button;
};
const getToolbar = (c) => __awaiter(void 0, void 0, void 0, function* () {
    const cnt = typeof c === 'undefined' ? 1 : c;
    dbg(`tb/inv=${cnt}`);
    const toolbar = document.getElementById('firstElement');
    if (toolbar !== null) {
        dbg(`retrieved toolbar on try ${cnt}`);
        return toolbar.parentElement;
    }
    else {
        dbg(`tb/miss=${cnt}`);
    }
    if (cnt >= MAX_TRIES) {
        dbg(`giving up on toolbar after ${cnt}!`);
        return null;
    }
    yield std.sleep(250);
    if (toolbar === null) {
        dbg(`tb/recinv=${cnt}`);
        return getToolbar(cnt + 1);
    }
    return null;
});
const begin = () => __awaiter(void 0, void 0, void 0, function* () {
    const header = yield getEmpHead();
    if (header == null || header.parentElement == null) {
        console.error(`Couldn't find the header`);
        return;
    }
    const butVCal = mkButton('vCal (Google)', () => generateCalendar('Me', 'me@host.com', 'schedule.vcs'));
    const butICal = mkButton('iCal (Outlook)', () => generateCalendar('Me', 'me@host.com', 'schedule.ics'));
    header.parentElement.appendChild(butVCal);
    header.parentElement.appendChild(butICal);
    debugger;
});
std.runForPath('/wfd/home', begin);
