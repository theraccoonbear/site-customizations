// @include standard.js

const clickLinkIfDirected = () => {
  const u = document.location;
  const q = u.search.substring(1);
  const pairs = q.split(/&(amp;)?/);
  const qs = {};
  pairs
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
    const links = Array.from(document.querySelectorAll('#search a'));
    
    const valid = links.filter(l => {
      if (!qs.domain) { return true; }
      return l.href.includes(qs.domain);
    });

    if (valid.length > 0) {
      var evt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      valid[0].dispatchEvent(evt);
    }
  }
  
};

ready(function () {
  setTimeout(clickLinkIfDirected, 250);
});
  