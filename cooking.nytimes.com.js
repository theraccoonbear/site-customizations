// @include standard.js

const doRemoval = () => {
  const items = document.getElementsByClassName('nytc---modal-window---noScroll');
  for (const item of items) {
    item.classList.remove('nytc---modal-window---noScroll');
  }
};

ready(function () {
  setInterval(doRemoval, 250);
});
