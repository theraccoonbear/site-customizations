

function ready(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
  
  const doRemoval = () => {
    const items = document.querySelectorAll('.promotions-personalized-offers-ui-advice');
    for (const item of items) {
      const parent = item.closest('.adviceWidget');
      if (parent) {
        parent.remove();
      }
    }
    const advices = document.querySelectorAll('.promotions-personalized-offers-ui');
    for (const advice of advices) {
        if (advice) {
            advice.remove();
        }
    }
  };
  
  let interval;
  
  ready(function () {
    interval = setInterval(doRemoval, 250);
    doRemoval();
  });
  