(() => {
  const slug = (s: string): string => s.replace(/[^A-Za-z_]+/g, '_');

  const host = 'https://javascript-cdn-8712.s3.amazonaws.com/';
  const scripts = ['mykronos.com.js'];

  const readyFn = (): any => {
    scripts.forEach(script => {
      const id = `script_${slug(script)}`;
      const existing = document.getElementById(id);
      if (existing) {
        return console && console.log(`already found #${id}`);
      }
      const scriptElem = document.createElement('script');
      scriptElem.type = 'text/javascript';
      scriptElem.id = id;
      scriptElem.src = `${host}${script}`;
      scriptElem.onload = () => {
        // const nf = new Function(`generateCalendar('Me', 'me@host.com')`);
        // nf();
      };
      document.body.appendChild(scriptElem);
    });
  };

  if (document.readyState !== 'loading'){
    readyFn();
  } else {
    document.addEventListener('DOMContentLoaded', readyFn as any);
  }
})();
