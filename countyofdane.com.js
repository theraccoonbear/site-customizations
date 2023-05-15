// @include standard.js
ready(() => {
  const changeUrl = (url, title) => {
    var new_url = '/' + url;
    window.history.pushState('data', title, new_url);      
  };

  const getFirstLast = (name) => {
    const n = name.trim();
    const parts = n.split(/\s+/g);
    if (parts.length < 2) {
      throw new Error(`Can't find name "${name}"`);
    }
    if (parts.length == 2) {
      return { first: parts[0], last: parts[1] };
    } else if (parts.length == 3) {
      return { first: parts[0], last: parts[2] };
    } else {
      return { first: parts[0], last: parts[parts.length - 1] };
    }
  }

  const makeLink = (url, text) => {
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('type', 'button');
    link.classList.add('btn', 'btn-primary', 'btn-small', 'pull-right', 'breathe');
    link.innerText = text;
    return link;
  }

  const afterLoad = () => {
    const summary = document.getElementById('parcelSummary');
    const entries = summary.querySelectorAll('table tr:nth-child(3) ul li');
    // console.log(entries);
    entries.forEach(e => {
      const fullName = e.innerText;
      try {
        const { first, last } = getFirstLast(fullName);
        // geoUrn=%5B%22106816259%22%5D&
        const urlLI = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(first)}%20${encodeURIComponent(last)}&origin=FACETED_SEARCH&sid=)*S`;
        e.appendChild(makeLink(urlLI, 'LI'));
        const urlGoog = `https://www.google.com/search?q=${encodeURIComponent(`"${first}`)}%20${encodeURIComponent(`${last}"`)}`;
        e.appendChild(makeLink(urlGoog, 'Goog'));
        // const link = document.createElement('a');
        // link.setAttribute('href', url);
        // link.setAttribute('target', '_blank');
        // link.innerText = 'LinkedIn';
        // e.appendChild(link);
      } catch (err) {
        console.log(`Unable to generate LinkedIn for "${fullName}"`, err);
      }
    });
    
  }

  const mapView = document.getElementById('mainWindow').parentElement;
  if (!mapView) {
    console.error('No #mainWindow found');
    return;
  }
  const cls = mapView.classList;
  if (!cls.contains('dataSection') || !cls.contains('span12')) {
    console.error('Check into missing classes on #mainWindow\'s parent', mapView.classList);
    return;
  }
  const topPane = mapView.querySelector('.alert-info');
  if (!topPane) {
    console.error('Could not find top pane .alert-info');
    return;
  }
  const button = document.createElement('button');
  button.setAttribute('id', 'mapToggleButton');
  button.innerText = "Embiggen";
  button.classList.add('mapToggleButton')
  let isSmall = true;

  const loaderOverlay = document.createElement('div');
  loaderOverlay.classList.add('loader-overlay');
  loaderOverlay.classList.add('hidden');
  const sp = `<div class="spinner loadingio-spinner-spinner-2gf4dum8vh4"><div class="ldio-kzt78hlfuvc">
  <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
  </div></div>`;
  loaderOverlay.innerHTML = sp;
  document.body.appendChild(loaderOverlay);

  const linkRgx = /^\d{12}$/;

  button.addEventListener('click', () => {
    if (isSmall) {
      button.innerText = "Ensmallen";
      isSmall = false;
      mapView.classList.add('embiggen');
    } else {
      button.innerText = "Embiggen";
      isSmall = true;
      mapView.classList.remove('embiggen');
    }
  });
  topPane.appendChild(button);

  const idSwap = (id, src) => swapIn(`#${id}`, src);

  const swapIn = (sel, src) => {
    const doc = document.querySelector(sel);
    const elem = src.querySelector(sel);
    doc.innerHTML = elem.innerHTML;
  }

  document.addEventListener('click', async (e) => {
    if (e.target && e.target.innerText && linkRgx.test(e.target.innerText)) {
      try {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.cancelBubble = true;
        loaderOverlay.classList.remove('hidden');
        const url = `https://accessdane.countyofdane.com/${e.target.innerText}`;
        const resp = await fetch(url);
        // console.log(resp);
        if (resp.ok) {
          const page = await resp.text();
          const dom = document.createElement('div');
          dom.innerHTML = page;

          const portions = [
            '#parcel_detail_heading',
            '#parcelSummary',
            '#parcelDetail',
            '#assessmentSummary',
            // '.taxDetailTable'
          ];
          portions.forEach(id => swapIn(id, dom));
          changeUrl(e.target.innerText, "Another");
          afterLoad();
        } else {
          alert("Oh no!");
        }
      } catch (err) {
        console.error('loading error', err);
      } finally {
        loaderOverlay.classList.add('hidden');
      }
    }
  });

  afterLoad();
});
