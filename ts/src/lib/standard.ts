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
  
export const runForPath = async (path: string | RegExp, func: Function) => {
  const rgx = new RegExp(path, 'i');
  if (rgx.test(document.location.pathname)) {
    console.log(`Conditional path match for "${path}"`);
    ready(() => {
      console.log(`Executing for "${path}"`);
      func();
    })
  }
};

export const mkButton = (label: string, action: (this: HTMLButtonElement, ev: MouseEvent) => any, classes: string[] = []): HTMLButtonElement => {
  const button = document.createElement('button');
  button.setAttribute('value', label);
  button.innerHTML = label;
  button.addEventListener('click', action);
  button.classList.add(...classes);
  return button
};


export const makeDataURI = (mimeType: string, data: string) => 
  `data:${mimeType};charset=utf-8;base64,${btoa(unescape(encodeURIComponent(data)))}`;
  
export const downloadURI = (uri: string, name: string) => {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
};
  
export const hash = (m: any): string => stringToUUID(SipHash.hash_hex("calendarFoo", m))

export const minutesDiff = (s: Date | string, e: Date | string): number => 
  ((typeof e === 'string' ? new Date(e) : e).getTime() - 
    (typeof s === 'string' ? new Date(s) : s).getTime()) / 1000 / 60;

export const hoursDiff = (s: Date, e: Date): number => minutesDiff(s, e) / 60;

export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const addDays = (date: any, days: number): Date => {
  const d = new Date(date);
  d.setDate(new Date(date).getDate() + days);
  return d;
}

export const simpleDate = (d: Date): string => d.toISOString().split('T')[0];
export const sDate = (d: Date): string => simpleDate(d)
  .split(/-/)
  .filter((_, i) => i > 0)
  .join('-');

// @todo make it use the template XD
export const dateFmt = (d: Date, format: string = ''): string => {
  const year = d.getFullYear();
  const mon = `${(d.getMonth() + 1 < 10 ? '0' : '')}${d.getMonth() + 1}`;
  const dom = (d.getDate() < 10 ? '0' : '') + d.getDate();
  return `${mon}/${dom}/${year}`;
}

export const dateAdd = (date: any, days: number): string => simpleDate(addDays(date, days));

export const getDateRange = (range?: number, now: Date = new Date()): Date[] => 
  [
    addDays(now, -Math.abs(range || 14)),
    addDays(now, Math.abs(range || 32))
  ];

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

export const time = (dt: Date | string): string => (typeof dt === 'string' ? new Date(dt) : dt)
  .toLocaleTimeString('en-US', 
    { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }
  )
  .replace(/:\d{2}\s+/, ' ')
  .toLowerCase();

export const date = (dt: Date): string => dt
  .toLocaleDateString('en-US',
    { weekday: 'short', month: 'short', day: 'numeric' }
  );


export const stringToUUID = (str: string): string => {
  str = str.replace('-', '');
  return 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, (_, p) => str[p % str.length]);
};

export const fwcl = (text: string, width: number): string => fwc(text, width, 'L', true);
export const fwcr = (text: string, width: number): string => fwc(text, width, 'R', true);
export const fwcc = (text: string, width: number): string => fwc(text, width, 'C', true);

export const fwc = (text: string, width: number, alignment: 'L' | 'R' | 'C' = 'L', truncate: boolean = true): string => 
  text.length > width ? 
    (truncate ? text.slice(0, width) : text) : 
    (
      alignment === 'L' ? 
        (text + ' '.repeat(width - text.length))
      : 
      (alignment === 'R' ? 
        (' '.repeat(width - text.length) + text) 
      : 
        (
          ' '.repeat(Math.floor((width - text.length) / 2)) + 
          text +
          ' '.repeat(Math.ceil((width - text.length) / 2))
        )
      )
    );

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
  