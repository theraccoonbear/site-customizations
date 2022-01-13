function ready(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

const doRemoval = () => {
  const paywall = document.getElementById('gateway-content');
  if (paywall != null) {
    const u = document.location;
    const url = `https://www.google.com/search?q="${encodeURIComponent(`${u.origin}${u.pathname}`)}"&__clickFirstResult=true`;
    document.location = url;
  }

  const dock = document.querySelectorAll('.expanded-dock');
  for (let d of dock) {
    d.remove();
  }
};

ready(function () {
  setInterval(doRemoval, 250);
});
console.log('your entry point here...');