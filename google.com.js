function ready(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

const clickLinkIfDirected = () => {
  const u = document.location;
  const q = u.search.substring(1);
  const pairs = q.split(/&(amp;)?/);
  const qs = {};
  const nvp = pairs
    .map(p => {
      if (p) {
        const nv = p.split(/=/, 2);
        return [nv[0], decodeURIComponent(nv[1])];
      }
      return;
    })
    .filter(Boolean)
    .forEach(nvp => qs[nvp[0]] = nvp[1])
  if (qs.__clickFirstResult) {
    const link = document.querySelectorAll('#search a:nth-of-type(1)');
    if (link.length > 0) {
      var evt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      link[0].dispatchEvent(evt);
    }
  }
  
};

ready(function () {
  setTimeout(clickLinkIfDirected, 250);
});
console.log('your entry point here...');
  