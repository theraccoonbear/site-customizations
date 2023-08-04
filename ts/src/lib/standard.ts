import { SipHash } from './SipHash.js';

export const ready = (fn: Function): void => {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn as any);
  }
};

(window as any).ready = ready;

const MAX_TRIES = 100; // 10 seconds

export const retrySelector = async (query: string, cnt?: number): Promise<NodeListOf<Element>> => {
  cnt = typeof cnt === 'number' ? cnt : 1;
  const elem = document.querySelectorAll(query); 
  if (elem && elem.length > 0) {
    return elem;
  } else if (cnt > MAX_TRIES) {
    throw new Error(`Unable to find '${query}'; giving up.`);
  }
  console.debug(`#${cnt} selector miss on '${query}'`);
  await sleep(100);
  return retrySelector(query, cnt + 1);
} 

export const decodeHtml = (html: any): string => {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};
  
export const runForPath = async (path: string, func: Function) => {
  const rgx = new RegExp(path, 'i');
  if (rgx.test(document.location.pathname)) {
    console.log(`Conditional path match for "${path}"`);
    ready(() => {
      console.log(`Executing for "${path}"`);
      func();
    })
  }
};
  
export const makeDataURI = (mimeType: string, data: string) => 
  `data:${mimeType};charset=utf-8;base64,${btoa(data)}`;
  
export const downloadURI = (uri: string, name: string) => {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
};
  
export const hash = (m: any): string => stringToUUID(SipHash.hash_hex("calendarFoo", m))

export const minutesDiff = (s: Date, e: Date): number => (e.getTime() - s.getTime()) / 1000 / 60;

export const hoursDiff = (s: Date, e: Date): number => minutesDiff(s, e) / 60;

export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dateAdd = (date: any, days: number): string => {
  const d = new Date(date);
  d.setDate(date.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const iCalDate = (dt: any): string => {
  const d = new Date(dt);
  const year = d.getFullYear();
  const mon = `${(d.getMonth() + 1 < 10 ? '0' : '')}${d.getMonth() + 1}`;
  const dom = (d.getDate() < 10 ? '0' : '') + d.getDate();
  const hr = (d.getHours() < 10 ? '0' : '') + d.getHours();
  const min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  const sec = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
  return `${year}${mon}${dom}T${hr}${min}${sec}`;
}

export const time = (dt: Date): string => dt
  .toLocaleTimeString('en-US', 
    { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }
  )
  .replace(/:\d{2}\s+/, ' ');

export const date = (dt: Date): string => dt
  .toLocaleDateString('en-US',
    { weekday: 'short', month: 'short', day: 'numeric' }
  );


export const stringToUUID = (str: string): string => {
  str = str.replace('-', '');
  return 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, (c, p) => str[p % str.length]);
};

export const srt = (m: string ) => m.toLowerCase()
  .replace(/[a-z]/gi, letter => 
    String.fromCharCode(letter.charCodeAt(0) + (letter.toLowerCase() <= 'm' ? 13 : -13)))

export const makeRequest = async (method: string, uri: string, payload?: string | null , headers?: any, respType?: string) => {
  method = method.trim().toUpperCase();
  payload = typeof payload === 'undefined' || payload === null ? null : payload.toString();
  headers = typeof headers === 'undefined' ? {} : { ...headers };
  respType = typeof respType === 'string' && respType.toLowerCase() === 'text' ? 'text' : 'json';
  let body, contentType;
  if (method != 'get' && method != 'head') {
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
      "sec-ch-ua-platform": "\"macOS\"",
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
    console.warn('Failed request:', uri, resp);
    throw new Error(`Error performing ${method} for ${uri}`)
  }

  if (resp.status.toString().indexOf('2') !== 0) {
    throw new Error(`Received ${resp.status} ${resp.statusText}. ${method.trim().toUpperCase()} ${uri}`)
  }
  return respType == 'text' ? resp.text() : resp.json();
};

export const headREST = (uri: string, payload?: string, headers?: any) => makeRequest('head', uri, payload, headers);
export const getREST = (uri: string, payload?: string, headers?: any) => makeRequest('get', uri, payload, headers);
export const postREST = (uri: string, payload?: string, headers?: any) => makeRequest('post', uri, payload, headers);
export const putREST = (uri: string, payload?: string, headers?: any) => makeRequest('put', uri, payload, headers);
export const patchREST = (uri: string, payload?: string, headers?: any) => makeRequest('patch', uri, payload, headers);
export const deleteREST = (uri: string, payload?: string, headers?: any) => makeRequest('delete', uri, payload, headers);

// * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # 
// # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # *
// * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # 
// # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * 
// * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # 

// @todo:Make this last
console.log('your script debugging entry point here...');
  