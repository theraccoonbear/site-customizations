const doCookingRemoval = () => {
  const items = document.querySelectorAll('[class^="modal_modal-window-container"]')
  for (const item of items) {
    item.remove();
  }
};

ready(function () {
  setInterval(doCookingRemoval, 250);
});
