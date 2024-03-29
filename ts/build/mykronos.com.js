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
const std = __importStar(require("./lib/standard"));
const debugging = false;
const JOB_FUNCTION = {
    "Footwear": "👞",
    "Stocking": "🛒",
    "Customer Service": "💳",
    "Camp": "🏕️",
    "Hardgoods": "🦾",
    "Action Sports": "🛶",
    "Shipping": "📦",
    "New Hire Onboarding": "🧑‍🎓",
    "Operations-TRN": "🧑‍🎓",
    "Guided Shift Cross-Training": "🧑‍🎓",
    "Clothing": "👕",
    "Softgoods": "🧣",
    "Shop": "🔧",
    "Shop Management": "🧑‍🔧",
    "Order Fulfillment": "📦",
    "Visual": "🧑‍🎨",
    "Banker": "🏦",
    "Management": "📋",
    "Price Changes": "🏷️",
};
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
const prepEvent = (ev) => {
    const e = Object.assign({}, ev);
    e.startTime = new Date(e.orderedSegments[0].startDateTimeUTC);
    e.endTime = new Date(e.orderedSegments[e.orderedSegments.length - 1].endDateTimeUTC);
    e.timeByJob = {};
    let max = 0;
    e.primaryShiftJob = '?';
    e.work = e.orderedSegments
        .filter((s) => s.segmentType.symbolicId !== 'break_segment')
        .map((s) => {
        const idParts = s.orgNode.path.split(/\//g);
        e.id = idParts.pop() || 'foo';
        if (typeof e.timeByJob[e.id] === 'undefined') {
            e.timeByJob[e.id] = 0;
        }
        e.timeByJob[e.id] += std.minutesDiff(s.startDateTimeUTC, s.endDateTimeUTC);
        if (e.timeByJob[e.id] >= max) {
            max = e.timeByJob[e.id];
            e.primaryShiftJob = e.id;
        }
        return e;
    });
    e.breaks = e.orderedSegments.filter((s) => s.segmentType.symbolicId === 'break_segment');
    e.breakTime = e.breaks
        .map((b) => std.minutesDiff(b.startDateTimeUTC, b.endDateTimeUTC))
        .reduce((p, c) => p + c, 0);
    e.breakTimes = e.breaks.map((b) => std.time(b.startDateTimeUTC))
        .join(', ');
    e.breakDisplay = e.breakTime > 0 ? `${e.breakTime} minutes break at ${e.breakTimes}` : 'no breaks';
    e.elapsed = std.hoursDiff(e.startTime, e.endTime);
    e.dispElapsed = e.elapsed.toPrecision(3).replace(/0+$/, '0');
    e.paidElapsed = (e.elapsed - (e.breakTime / 60)).toPrecision(3).replace(/0+$/, '0');
    return e;
};
const summaryLine = (e) => `${EMPLOYER} ${jobLine(e.primaryShiftJob)} from ${std.time(e.startTime)} to ${std.time(e.endTime)} (${e.dispElapsed} ` +
    `[${e.paidElapsed}] hours)`;
const descriptionLine = (e) => `Shift in ${jobLine(e.primaryShiftJob)} at ${EMPLOYER} from ${std.time(e.startTime)} to ${std.time(e.endTime)} on ` +
    `${std.date(e.startTime)}. ${e.dispElapsed} hours with ${e.breakDisplay}`;
const iCalEvent = (ev, name, email) => {
    const e = prepEvent(ev);
    const summary = summaryLine(e);
    const description = descriptionLine(e);
    const TZ = 'America/Chicago';
    const tzid = `;TZID=${TZ}`;
    const iCal = [
        `BEGIN:VEVENT`,
        `UID: ${std.hash(std.iCalDate(e.startTime) + std.iCalDate(e.endTime))}`,
        `DTSTAMP${tzid}:${std.iCalDate(e.startTime)}`,
        `ORGANIZER;CN=${name}:MAILTO:${email}`,
        `DTSTART${tzid}:${std.iCalDate(e.startTime)}`,
        `DTEND${tzid}:${std.iCalDate(e.endTime)}`,
        `${iCalWrapping(`SUMMARY:${summary}`)}`,
        `${iCalWrapping(`DESCRIPTION:${description}`)}`,
        `END:VEVENT`
    ].join("\r\n");
    return Object.assign(Object.assign({}, e), { iCal });
};
const apiUri = (path) => `https://${KRO_HOSTNAME}${path}`;
const getXSRFToken = () => document.cookie
    .split(/;\s*/)
    .map(s => s.split(/=/))
    .filter(p => p[0] == 'XSRF-TOKEN')
    .reduce((_, c) => c[1], "");
const jobLine = (job) => `${job}${typeof JOB_FUNCTION[job] !== 'undefined' ? ` ${JOB_FUNCTION[job]}` : ''}`;
const gengerateCalendarRequest = () => {
    const range = std.getDateRange();
    const startDate = std.simpleDate(range[0]);
    const endDate = std.simpleDate(range[1]);
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
const calendarEventFilter = (e) => {
    const retVal = e &&
        e.orderedSegments &&
        Array.isArray(e.orderedSegments) &&
        e.orderedSegments.length >= 1 &&
        e.orderedSegments[0].startDateTimeUTC;
    return retVal;
};
const fetchCalendar = (name = '', email = '') => __awaiter(void 0, void 0, void 0, function* () {
    const xsrfToken = yield getXSRFToken();
    const calendarRequest = gengerateCalendarRequest();
    const body = yield std.postREST(apiUri('/myschedule/eventDispatcher'), JSON.stringify(calendarRequest), { "x-xsrf-token": xsrfToken });
    return body
        .filter(calendarEventFilter)
        .map((e) => iCalEvent(e, name, email));
});
const simpleEntry = (ev) => prepEvent(ev) &&
    [` *`,
        std.date(ev.startTime),
        std.time(ev.startTime),
        'to',
        std.time(ev.endTime),
        'in',
        jobLine(ev.primaryShiftJob)
    ].join(' ');
const generateSimpleCalendar = () => __awaiter(void 0, void 0, void 0, function* () {
    const cal = yield fetchCalendar();
    const now = new Date();
    const text = cal
        .map(prepEvent)
        .filter((e) => e.startTime >= now)
        .map(simpleEntry)
        .join("\n");
    console.log(text);
    const data = std.makeDataURI("text/plain", text);
    const range = std.getDateRange();
    const filename = `schedule.txt`;
    std.downloadURI(data, filename);
});
const generateCalendar = (name, email, extension) => __awaiter(void 0, void 0, void 0, function* () {
    const cal = yield fetchCalendar(name, email);
    const iCalEvents = cal
        .map((c) => c.iCal)
        .join("\n");
    const iCalFull = [
        `BEGIN:VCALENDAR`,
        `VERSION:2.0`,
        `PRODID:-//hacksw/handcal//NONSGML v1.0//EN`,
        `${iCalEvents}`,
        `END:VCALENDAR`
    ].join("\r\n");
    const data = std.makeDataURI("text/calendar", iCalFull);
    const filename = `schedule.${extension}`;
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
    const butVCal = std.mkButton('vCal (Google)', () => generateCalendar('Me', 'me@host.com', 'vcs'));
    const butICal = std.mkButton('iCal (Outlook)', () => generateCalendar('Me', 'me@host.com', 'ics'));
    const butTxtCal = std.mkButton('Text', () => generateSimpleCalendar());
    header.parentElement.appendChild(butVCal);
    header.parentElement.appendChild(butICal);
    header.parentElement.appendChild(butTxtCal);
});
std.runForPath('/wfd/home', begin);
