function ready(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

const useGoogleIfPaywalled = () => {
  const paywall = document.getElementById('gateway-content');
  if (paywall != null) {
    const u = document.location;
    const url = `https://www.google.com/search?q="${encodeURIComponent(`${u.origin}${u.pathname}`)}"&__clickFirstResult=true`;
    document.location = url;
  }

};

ready(function () {
  setInterval(useGoogleIfPaywalled, 250);
});
console.log('your entry point here...');