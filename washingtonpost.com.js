function ready(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

let originalBody, body, html;
let bodyReplaced = false;

const doRemoval = () => {
  const paywall = document.querySelector('div[data-qa="overlay-container"]');
  if (paywall != null) {
    paywall.remove();
  }
  if (html != null) {
    if (html.style.overflow != 'scroll') {
      html.style.overflow = 'scroll';
    }
  }
  if (body != null) {
    if (body.style.overflow != 'scroll') {
      body.style.overflow = 'scroll';
    }
    body.innerHTML = originalBody;
  }
};

ready(function () {
  html = document.querySelector('html');
  body = document.querySelector('body');
  originalBody = body.innerHTML;
  setInterval(doRemoval, 250);
});
console.log('your entry point here...');