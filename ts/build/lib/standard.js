"use strict";
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
exports.deleteREST = exports.patchREST = exports.putREST = exports.postREST = exports.getREST = exports.headREST = exports.makeRequest = exports.srt = exports.fwc = exports.fwcc = exports.fwcr = exports.fwcl = exports.stringToUUID = exports.date = exports.time = exports.iCalDate = exports.getDateRange = exports.dateAdd = exports.dateFmt = exports.sDate = exports.simpleDate = exports.addDays = exports.sleep = exports.hoursDiff = exports.minutesDiff = exports.hash = exports.downloadURI = exports.makeDataURI = exports.mkButton = exports.runForPath = exports.decodeHtml = exports.retrySelector = exports.ready = void 0;
const SipHash_js_1 = require("./SipHash.js");
const ready = (fn) => {
    if (document.readyState !== 'loading') {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};
exports.ready = ready;
window.ready = exports.ready;
const MAX_TRIES = 100; // 10 seconds
const retrySelector = (query, cnt) => __awaiter(void 0, void 0, void 0, function* () {
    cnt = typeof cnt === 'number' ? cnt : 1;
    const elem = document.querySelectorAll(query);
    if (elem && elem.length > 0) {
        return elem;
    }
    else if (cnt > MAX_TRIES) {
        throw new Error(`Unable to find '${query}'; giving up.`);
    }
    console.debug(`#${cnt} selector miss on '${query}'`);
    yield (0, exports.sleep)(100);
    return (0, exports.retrySelector)(query, cnt + 1);
});
exports.retrySelector = retrySelector;
const decodeHtml = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};
exports.decodeHtml = decodeHtml;
const runForPath = (path, func) => __awaiter(void 0, void 0, void 0, function* () {
    const rgx = new RegExp(path, 'i');
    if (rgx.test(document.location.pathname)) {
        console.log(`Conditional path match for "${path}"`);
        (0, exports.ready)(() => {
            console.log(`Executing for "${path}"`);
            func();
        });
    }
});
exports.runForPath = runForPath;
const mkButton = (label, action, classes = []) => {
    const button = document.createElement('button');
    button.setAttribute('value', label);
    button.innerHTML = label;
    button.addEventListener('click', action);
    button.classList.add(...classes);
    return button;
};
exports.mkButton = mkButton;
const makeDataURI = (mimeType, data) => `data:${mimeType};charset=utf-8;base64,${btoa(unescape(encodeURIComponent(data)))}`;
exports.makeDataURI = makeDataURI;
const downloadURI = (uri, name) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
};
exports.downloadURI = downloadURI;
const hash = (m) => (0, exports.stringToUUID)(SipHash_js_1.SipHash.hash_hex("calendarFoo", m));
exports.hash = hash;
const minutesDiff = (s, e) => ((typeof e === 'string' ? new Date(e) : e).getTime() -
    (typeof s === 'string' ? new Date(s) : s).getTime()) / 1000 / 60;
exports.minutesDiff = minutesDiff;
const hoursDiff = (s, e) => (0, exports.minutesDiff)(s, e) / 60;
exports.hoursDiff = hoursDiff;
const sleep = (ms) => __awaiter(void 0, void 0, void 0, function* () { return new Promise(resolve => setTimeout(resolve, ms)); });
exports.sleep = sleep;
const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(new Date(date).getDate() + days);
    return d;
};
exports.addDays = addDays;
const simpleDate = (d) => d.toISOString().split('T')[0];
exports.simpleDate = simpleDate;
const sDate = (d) => (0, exports.simpleDate)(d)
    .split(/-/)
    .filter((_, i) => i > 0)
    .join('-');
exports.sDate = sDate;
// @todo make it use the template XD
const dateFmt = (d, format = '') => {
    const year = d.getFullYear();
    const mon = `${(d.getMonth() + 1 < 10 ? '0' : '')}${d.getMonth() + 1}`;
    const dom = (d.getDate() < 10 ? '0' : '') + d.getDate();
    return `${mon}/${dom}/${year}`;
};
exports.dateFmt = dateFmt;
const dateAdd = (date, days) => (0, exports.simpleDate)((0, exports.addDays)(date, days));
exports.dateAdd = dateAdd;
const getDateRange = (range, now = new Date()) => [
    (0, exports.addDays)(now, -Math.abs(range || 14)),
    (0, exports.addDays)(now, Math.abs(range || 14))
];
exports.getDateRange = getDateRange;
const iCalDate = (dt) => {
    const d = new Date(dt);
    const year = d.getFullYear();
    const mon = `${(d.getMonth() + 1 < 10 ? '0' : '')}${d.getMonth() + 1}`;
    const dom = (d.getDate() < 10 ? '0' : '') + d.getDate();
    const hr = (d.getHours() < 10 ? '0' : '') + d.getHours();
    const min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    const sec = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
    return `${year}${mon}${dom}T${hr}${min}${sec}`;
};
exports.iCalDate = iCalDate;
const time = (dt) => (typeof dt === 'string' ? new Date(dt) : dt)
    .toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' })
    .replace(/:\d{2}\s+/, ' ')
    .toLowerCase();
exports.time = time;
const date = (dt) => dt
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
exports.date = date;
const stringToUUID = (str) => {
    str = str.replace('-', '');
    return 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, (_, p) => str[p % str.length]);
};
exports.stringToUUID = stringToUUID;
const fwcl = (text, width) => (0, exports.fwc)(text, width, 'L', true);
exports.fwcl = fwcl;
const fwcr = (text, width) => (0, exports.fwc)(text, width, 'R', true);
exports.fwcr = fwcr;
const fwcc = (text, width) => (0, exports.fwc)(text, width, 'C', true);
exports.fwcc = fwcc;
const fwc = (text, width, alignment = 'L', truncate = true) => text.length > width ?
    (truncate ? text.slice(0, width) : text) :
    (alignment === 'L' ?
        (text + ' '.repeat(width - text.length))
        :
            (alignment === 'R' ?
                (' '.repeat(width - text.length) + text)
                :
                    (' '.repeat(Math.floor((width - text.length) / 2)) +
                        text +
                        ' '.repeat(Math.ceil((width - text.length) / 2)))));
exports.fwc = fwc;
const srt = (m) => m.toLowerCase()
    .replace(/[a-z]/gi, letter => String.fromCharCode(letter.charCodeAt(0) + (letter.toLowerCase() <= 'm' ? 13 : -13)));
exports.srt = srt;
const makeRequest = (method, uri, payload, headers, respType) => __awaiter(void 0, void 0, void 0, function* () {
    method = method.trim().toUpperCase();
    payload = typeof payload === 'undefined' || payload === null ? null : payload.toString();
    headers = typeof headers === 'undefined' ? {} : Object.assign({}, headers);
    respType = typeof respType === 'string' && respType.toLowerCase() === 'text' ? 'text' : 'json';
    let body, contentType;
    if (method != 'get' && method != 'head') {
        body = { body: payload };
        contentType = { "content-type": "application/json" };
    }
    const resp = yield fetch(uri, Object.assign(Object.assign({ "headers": Object.assign(Object.assign(Object.assign({ "accept": "application/json, text/plain, */*", "accept-language": "en-US,en;q=0.9" }, contentType), { "cache-control": "no-cache", "device-type": "desktop", "page": "home", "pragma": "no-cache", "sec-ch-ua": `"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"`, "sec-ch-ua-mobile": "?0", "sec-ch-ua-platform": "\"macOS\"", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "sec-gpc": "1" }), headers), "referrerPolicy": "strict-origin-when-cross-origin" }, body), { "method": method, "mode": "cors", "credentials": "include" }));
    if (!resp.ok) {
        console.warn('Failed request:', uri, resp);
        throw new Error(`Error performing ${method} for ${uri}`);
    }
    if (resp.status.toString().indexOf('2') !== 0) {
        throw new Error(`Received ${resp.status} ${resp.statusText}. ${method.trim().toUpperCase()} ${uri}`);
    }
    return respType == 'text' ? resp.text() : resp.json();
});
exports.makeRequest = makeRequest;
const headREST = (uri, payload, headers) => (0, exports.makeRequest)('head', uri, payload, headers);
exports.headREST = headREST;
const getREST = (uri, payload, headers) => (0, exports.makeRequest)('get', uri, payload, headers);
exports.getREST = getREST;
const postREST = (uri, payload, headers) => (0, exports.makeRequest)('post', uri, payload, headers);
exports.postREST = postREST;
const putREST = (uri, payload, headers) => (0, exports.makeRequest)('put', uri, payload, headers);
exports.putREST = putREST;
const patchREST = (uri, payload, headers) => (0, exports.makeRequest)('patch', uri, payload, headers);
exports.patchREST = patchREST;
const deleteREST = (uri, payload, headers) => (0, exports.makeRequest)('delete', uri, payload, headers);
exports.deleteREST = deleteREST;
// * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # 
// # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # *
// * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # 
// # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * 
// * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # 
// @todo:Make this last
console.log('your script debugging entry point here...');
