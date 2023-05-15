// @include standard.js
// @include cooking.nytimes.com.js

ready(function () {
  let redirecting = false;

  const doRemoval = () => {
    if (redirecting) { return; }
    const paywall = document.getElementById('gateway-content');
    if (paywall != null) {
      const u = document.location;
      const url = `https://www.google.com/search?q="${encodeURIComponent(`${u.origin}${u.pathname}`)}"&__clickFirstResult=true&domain=nytimes.com`;
      redirecting = true;
      document.location = url;
    }

    const dock = document.querySelectorAll('.expanded-dock');
    for (let d of dock) {
      d.remove();
    }
  };

  setInterval(doRemoval, 250);
});
