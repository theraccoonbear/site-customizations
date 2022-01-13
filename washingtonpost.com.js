function ready(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

let originalBody;

const doRemoval = () => {
  const paywall = document.querySelector('div[data-qa="overlay-container"]');
  if (paywall != null) {
    paywall.remove();
  }
  const html = document.querySelector('html');
  if (html != null) {
    html.style.overflow = 'scroll';
  }
  const body = document.querySelector('body');
  if (body != null) {
    body.style.overflow = 'scroll';
    body.innerHTML = originalBody;
  }
};

ready(function () {
  const body = document.querySelector('body');
  originalBody = body.innerHTML;
  console.log(originalBody);
  setInterval(doRemoval, 250);
});
console.log('your entry point here...');