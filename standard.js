window.ready = (fn) => {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};
console.log('your script debugging entry point here...');