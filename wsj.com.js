// @include standard.js

let originalBody, body, html;
let bodyReplaced = false;

const doRemoval = () => {
  const paywall = document.querySelectorAll('.snippet-promotion');
  for (let p of paywall) {
    p.remove();
  }
  // Looks like the Wall Street Urinal sensibly does not actually send the full article body :/
};

ready(function () {
  html = document.querySelector('html');
  body = document.querySelector('body');
  originalBody = body.innerHTML;
  setInterval(doRemoval, 250);
});