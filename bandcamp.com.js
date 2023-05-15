// @include standard.js

const dataURI = 'data:image/vndmicrosofticon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADw+ODwAAbmwAAGe3AAByzAAAfswQEI+9DAyKeBgYlxUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB2ZgAAeO0AAG3/AAAk/wAAAP8AAAD/AAAk/yUlpP8AADH7AAAA/wAAAP8AAACWAAAAAAAAAAAAAAAAAAB+jQAAaP8AAHH/AABr/wAAAP9wfpf/cH6X/wAAAP8AAHr/AAAA/3B+l/9wfpf/AAAA/wAAAAAAAAAAAAB+ZgAAWP8BAYD/DAyK/wAAev8AAAD/fYyo/32MqP8AAAD/AAAA/wAAAP99jKj/fYyo/wAAAP8AAAAAAQGAEhMTku0AAGz/AABk/wMDgv8AAGv/AAAt/wAAAP+LnLv/i5y7/4ucu/+LnLv/i5y7/4ucu/8AAAD/AAB/JAAAZWkICIf/BgaF/wAAef8AAEz/AABx/wEBgP8EBDj/AAAA/5qt0P8AAAD/AAAA/5qt0P+ardD/AAAA/wAAbocAAHKxAABe/wAAc/8REZD/AABl/wwMiv8VFZT/AABv/wAALf8AAAD/qL3j/wAAAP+oveP/qL3j/wAAAP8AAHHPAAAe7AAAAP8AAAD/AAAy/wAAev8NDUH/AAAA/wAAAP8BATb/AAAh/wAAAP+1y/T/tcv0/7XL9P8AAAD/AQGA+QAAAP9ygJr/coCa/wAAAP8CAoH/AAAA/3KAmv9ygJr/AAAA/wAAfP8GBjr/AAAA/73U//+91P//AAAA/wAAcvYAAAD/gZGu/4GRrv8AAAD/AAAA/wAAAP+Bka7/gZGu/wAAAP8AAHj/AABu/wAAM/8AAAD/AAAA/wEBNv8AAHPYAAAA/5Olxv+Tpcb/AAAA/5Olxv8AAAD/k6XG/5Olxv8AAAD/Dw+O/wAAaP8AAHn/AABe/wAAWv8AAGv/AAB0lgAAAP+kuN3/pLjd/wAAAP+kuN3/AAAA/6S43f+kuN3/AAAA/wAAW/8AAHL/AAB//wICgf8AAHH/AABy/AAAbTAAAAD/s8nx/7PJ8f+zyfH/AAAA/7PJ8f+zyfH/s8nx/wAAAP8AAH7/AAB//wAAe/8AAGv/AAB7/wAAepwAAAAAAAAA/73U//+91P//AAAA/wAAMP8AAAD/vdT//73U//8AAAD/BweG/wkJiP8AAHX/AABt/wAAfMMcHJsGAAAAAAAAAJYAAAD/AAAA/wAAFbsWFpXwAAAs/wAAAP8AAAD/CAg8/xcXlv8AAF7/AAB49gAAZHUREZADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABhGw8PjoQAAGrJAQGA+QkJiP8TE5LMAAB2jQ0NjCcAAAAAAAAAAAAAAAAAAAAA8A8AAOABAADAAQAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAwAA8A8AAA==';

const makeBCLink = (search, type, appendHere) => {
  if (['band', 'album'].indexOf(type) < 0) { 
    throw new Error(`Invalid Bandcamp link type "${type}"`);
  }
  const bcIcon = document.createElement('img');
  bcIcon.src = dataURI;
  const isBand = type.trim().toLowerCase() == 'band';
  const searchType = isBand ? 'band_name' : 'album_title';
  const url = `https://www.metal-archives.com/search?searchString=${encodeURIComponent(search)}&type=${searchType}`;
  if (isBand) {
    bcIcon.alt = `Search Bandcamp for bands called "${search}"`;
  } else {
    bcIcon.alt = `Search Bandcamp for albums called "${search}"`;
  }
  bcIcon.title = bcIcon.alt;
  const bcLink = document.createElement('a');
  bcLink.href = url;
  bcLink.setAttribute("target", "_blank");
  bcLink.appendChild(bcIcon);
  if (typeof appendHere !== 'undefined') {
    appendHere.appendChild(bcLink)
  }
  return bcLink;
}

const doMetalLinking = () => {
  const tags = [...document.querySelectorAll('.tralbum-tags a')];
  const isMetal = tags.reduce((p, c) => 
      p || 
      c.innerText.toLowerCase().indexOf('metal') >= 0
    , false);

  if (isMetal) {
    const nameSection = document.querySelector('#name-section');
    const albumHead = nameSection.querySelector('h2.trackTitle');  

    const bandSpan = nameSection.querySelector('h3 span');
    const bandLink = bandSpan.querySelector('a');
    
    const album = albumHead.innerText;
    const bandName = bandLink.innerText;

    makeBCLink(album, 'album', albumHead);
    makeBCLink(bandName, 'band', bandSpan);
  }
};

// const getCart = async () => {
//   const myCart = [];
//   const resp = await fetch('https://wearebrutus.bandcamp.com/cart');
//   if (resp.ok) {
//     const body = await resp.text();
//     console.log(body);
//   }
//   return myCart;
// }

// const doCart = () => {
//   const cart = document.querySelector('.cart-wrapper');
//   console.log('CART!', cart);
//   cart.addEventListener('mouseover', (e) => {
//       console.log(e);
//       // debugger;
//   });
// };

ready(async () => {
  doMetalLinking();
  // const cartData = await getCart();
  // doCart();
});
