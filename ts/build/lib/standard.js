var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SipHash } from './SipHash.js';
export const ready = (fn) => {
    if (document.readyState !== 'loading') {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};
window.ready = ready;
const MAX_TRIES = 100; // 10 seconds
export const retrySelector = (query, cnt) => __awaiter(void 0, void 0, void 0, function* () {
    cnt = typeof cnt === 'number' ? cnt : 1;
    const elem = document.querySelectorAll(query);
    if (elem && elem.length > 0) {
        return elem;
    }
    else if (cnt > MAX_TRIES) {
        throw new Error(`Unable to find '${query}'; giving up.`);
    }
    console.debug(`#${cnt} selector miss on '${query}'`);
    yield sleep(100);
    return retrySelector(query, cnt + 1);
});
export const decodeHtml = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};
export const runForPath = (path, func) => __awaiter(void 0, void 0, void 0, function* () {
    const rgx = new RegExp(path, 'i');
    if (rgx.test(document.location.pathname)) {
        console.log(`Conditional path match for "${path}"`);
        ready(() => {
            console.log(`Executing for "${path}"`);
            func();
        });
    }
});
export const makeDataURI = (mimeType, data) => `data:${mimeType};charset=utf-8;base64,${btoa(data)}`;
export const downloadURI = (uri, name) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
};
export const hash = (m) => stringToUUID(SipHash.hash_hex("calendarFoo", m));
export const minutesDiff = (s, e) => ((typeof e === 'string' ? new Date(e) : e).getTime() -
    (typeof s === 'string' ? new Date(s) : s).getTime()) / 1000 / 60;
export const hoursDiff = (s, e) => minutesDiff(s, e) / 60;
export const sleep = (ms) => __awaiter(void 0, void 0, void 0, function* () { return new Promise(resolve => setTimeout(resolve, ms)); });
export const dateAdd = (date, days) => {
    const d = new Date(date);
    d.setDate(date.getDate() + days);
    return d.toISOString().split('T')[0];
};
export const iCalDate = (dt) => {
    const d = new Date(dt);
    const year = d.getFullYear();
    const mon = `${(d.getMonth() + 1 < 10 ? '0' : '')}${d.getMonth() + 1}`;
    const dom = (d.getDate() < 10 ? '0' : '') + d.getDate();
    const hr = (d.getHours() < 10 ? '0' : '') + d.getHours();
    const min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    const sec = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
    return `${year}${mon}${dom}T${hr}${min}${sec}`;
};
export const time = (dt) => (typeof dt === 'string' ? new Date(dt) : dt)
    .toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' })
    .replace(/:\d{2}\s+/, ' ');
export const date = (dt) => dt
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
export const stringToUUID = (str) => {
    str = str.replace('-', '');
    return 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, (c, p) => str[p % str.length]);
};
export const srt = (m) => m.toLowerCase()
    .replace(/[a-z]/gi, letter => String.fromCharCode(letter.charCodeAt(0) + (letter.toLowerCase() <= 'm' ? 13 : -13)));
export const makeRequest = (method, uri, payload, headers, respType) => __awaiter(void 0, void 0, void 0, function* () {
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
export const headREST = (uri, payload, headers) => makeRequest('head', uri, payload, headers);
export const getREST = (uri, payload, headers) => makeRequest('get', uri, payload, headers);
export const postREST = (uri, payload, headers) => makeRequest('post', uri, payload, headers);
export const putREST = (uri, payload, headers) => makeRequest('put', uri, payload, headers);
export const patchREST = (uri, payload, headers) => makeRequest('patch', uri, payload, headers);
export const deleteREST = (uri, payload, headers) => makeRequest('delete', uri, payload, headers);
// * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # 
// # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # *
// * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # 
// # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * 
// * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # 
// @todo:Make this last
console.log('your script debugging entry point here...');
