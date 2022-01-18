// @include standard.js

const doRemoval = () => {
  const items = document.querySelectorAll('#lee-subscription-wall, .modal-backdrop');
  for (const item of items) {
      item.remove();
  }
  const body = document.querySelector('body');
  body.classList.remove('modal-open');
};

let interval;

ready(function () {
  interval = setInterval(doRemoval, 250);
  doRemoval();
});
