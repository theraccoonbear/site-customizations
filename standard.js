
window.ready = (fn) => {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

// @include SipHash.js

const decodeHtml = (html) => {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const runForPath = async (path, func) => {
  const rgx = new RegExp(path, 'i');
  if (rgx.test(document.location.pathname)) {
    console.log(`Conditional path match for "${path}"`);
    ready(() => {
      console.log(`Executing for "${path}"`);
      func();
    })
  }
};

const makeDataURI = (mimeType, data) => `data:${mimeType};charset=utf-8;base64,${btoa(data)}`;

const downloadURI = (uri, name) => {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
};

const hash = (m) => stringToUUID(SipHash.hash_hex("calendarFoo", m))

const hoursDiff = (s, e) => (e.getTime() - s.getTime()) / 1000 / 60 / 60;

const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

const dateAdd = (date, days) => {
  const d = new Date(date);
  d.setDate(date.getDate() + days);
  return d.toISOString().split('T')[0];
};

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


const stringToUUID = (str) => {
  str = str.replace('-', '');
  return 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, (c, p) => str[p % str.length]);
};

const makeRequest = async (method, uri, payload, headers, respType) => {
  method = method.trim().toUpperCase();
  payload = typeof payload === 'undefined' ? null : payload.toString();
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

const headREST = (uri, payload, headers) => makeRequest('head', uri, payload, headers);
const getREST = (uri, payload, headers) => makeRequest('get', uri, payload, headers);
const postREST = (uri, payload, headers) => makeRequest('post', uri, payload, headers);
const putREST = (uri, payload, headers) => makeRequest('put', uri, payload, headers);
const patchREST = (uri, payload, headers) => makeRequest('patch', uri, payload, headers);
const deleteREST = (uri, payload, headers) => makeRequest('delete', uri, payload, headers);

// * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # 
// # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # *
// * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # 
// # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * 
// * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # * # 

// @todo:Make this last
console.log('your script debugging entry point here...');
