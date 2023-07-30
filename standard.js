window.ready = (fn) => {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

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

const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Make this last
console.log('your script debugging entry point here...');
