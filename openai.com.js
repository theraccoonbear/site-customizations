(function() {
  var logConvoDefined = false;
  
  const LogFormats = {
    MD: 'MARKDOWN',
    JSON: 'JSON',
  };
  
  var logConvo = async (f) => {
    const format = typeof LogFormats[f] !== 'undefined' ? LogFormats[f] : LogFormats.MD;
    const newAr = Array.from(document.querySelectorAll('.text-base'))
      .map(n => {
        const isMe = n.innerHTML.toString().indexOf('alt="Don Smith"') > 0;
        return { isMe, said: n.innerText };
      });
    
    if (format == LogFormats.JSON) {
      console.log(JSON.stringify(newAr, null, 2));
    } else {
      const lines = [];
      newAr.slice(newAr.length - showLast).forEach(f => {
        lines.push(`# ${f.isMe ? 'Me' : 'ChatGPT' }`);
        f.said
          .split(/\n/)
          .forEach(l => lines.push(`  > ${l}`));
        lines.push('');
      });
      sfae.focus();
      await navigator.clipboard.writeText(lines.join("\n"));
    }
  };
  
  window.ready = (fn) => {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };
  
  window.ready(() => {
    let sfae = null;
    let showLast = 20;

    logConvoDefined = true;

    window.logConvo = function() {
      if (!logConvoDefined) {
        console.log('logConvo is not defined yet');
        return;
      }
      
      logConvo.apply(null, arguments);
    };
    
    console.log(window.logConvo);
  });
})();

