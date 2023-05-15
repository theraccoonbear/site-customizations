// Debug toggler 
// javascript:(function(){const k='try-debugging',l=localStorage,g=l.getItem.bind(l),s=l.setItem.bind(l);s(k,!(g(k)==='true'));console.log('debug: '+(g(k)==='true'?'on':'off'));})();
const TICK_LEN_MS = 250;
const SETTLE_DELAY_MS = 1000;

const adventuresFormActions = [
  // page 0
  { i: '36', v: 2 }, // adults
  { i: '45', v: 3 }, // children
  { i: '52', v: 'Don' }, // first name
  { i: '54', v: 'Smith' }, // last name
  { i: '56', v: 'dosmith@rei.com' }, // email
  { i: '58', v: '608-212-1205' }, // phone
];

const eventsFormActions = [
  // page 0
  { i: 'js-is18', click: true },
  // page 1
  { n: 'numberOfAdults', v: 1 },
  { s: '.continue', e: true },
  // page 2
  { n: 'firstName', v: 'Don' },
  { n: 'lastName', v: 'Smith' },
  { n: 'email', v: 'dosmith@rei.com' },
  { n: 'email', click: true },
  { n: 'phone', v: '608-212-1205' },
  { n: 'phone', click: true },
  { n: 'c67-gearmail', c: false },
  // page 3
  { n: 'emergencyContactName', v: 'Julia' },
  { n: 'emergencyContactPhone', v: '608-393-7004' },
  { s: '[for="c67-medicalCondition-no"]', click: true },
  { s: '[for="c67-disability-no"]', click: true },
  // page 4
  { n: 'address1', v: '2731 Moland St.' },
  { n: 'city', v: 'Madison' },
  { n: 'billing-state', v: 'WI' },
  { n: 'billing-country', v: 'US' },
  { n: 'zip', v: '53704' },
  { n: 'billing-cardType', v: 'mc' },
  { n: 'cardNumber', v: '5454545454545454' },
  { n: 'expirationMonth', v: '12' },
  { n: 'expirationMonth', v: '12' },
  // { n: 'expirationMonth', click: true },
  { n: 'expirationYear', v: '2024' },
  // { n: 'expirationYear', click: true },
  { n: 'securityCode', v: '123' },
  // page 5
  { s: '[for="user-agreement-checkbox"]', click: true }
];

const ourVals = {
  numberOfAdults: 1,
  numberOfYouths: 0,
};

const tryRgx = /^try.+rei-cloud.com$/;
const adventuresRgx = /Xadventures\//
const localS = window.localStorage;
const inDebug = localS.getItem('try-debugging') === 'true';

const tickLog = (msg, tick) => {
  if (tick % ((1000 / TICK_LEN_MS) * 5) == 0) { console.log(msg); }
};

const sanitize = v => v.replace(/[^A-Za-z0-9_-]+/g, '-');

const doOnTick = (selector, action, tick) => {
  tick = typeof tick === 'undefined' ? 1 : tick;
  let elem = document.querySelector(selector);
  if (elem != null) {
    const trackingKey = `try-debug-completed`; //-${sanitize(selector)}`;
    const completed = !!elem.getAttribute(trackingKey);
    if (!completed) {
      console.log(`Handled ${selector} after ${tick} tick(s).  Tracked as: ${trackingKey}`);
      action(elem);
      elem.setAttribute(trackingKey, true);
    }
  }
  setTimeout(() => doOnTick(selector, action, tick + 1), 250);
};

const setEnabledStateWhenAvail = (selector, state) => doOnTick(selector, elem => elem.disabled = !state);

const setCheckedStateWhenAvail = (selector, state) => doOnTick(selector, elem => elem.checked = state);

const setValWhenAvail = (selector, value) => doOnTick(selector, elem => { elem.value = value; elem.focus() })

const clickWhenAvail = (selector) => doOnTick(selector, elem => elem.click());

if (tryRgx.test(document.location.hostname)) {
  console.log(`We are in a try environment with debugging ${inDebug ? 'ON' : 'OFF'}`);
  console.log('waiting...')
  setTimeout(() => {
    console.log('go!');
    const formActions = adventuresRgx.test(document.location.pathname) ?
      adventuresFormActions : eventsFormActions;

    if (inDebug) {
      formActions.forEach(item => {
        console.log('form action:', item);
        const selector = typeof item.n !== 'undefined' ? 
            `[name="${item.n}"]` : 
            (typeof item.i !== 'undefined' ?
                `[id="${item.i}"]` :
                item.s);
        if (typeof item.v !== 'undefined') {
          setValWhenAvail(selector, item.v);
        } else if (typeof item.e !== 'undefined') {
          setEnabledStateWhenAvail(selector, item.e)
        } else if (typeof item.c !== 'undefined') {
          setCheckedStateWhenAvail(selector, item.c);
        } else if (typeof item.click !== 'undefined') {
          clickWhenAvail(selector);
        } else {
          console.error('Not sure what to do with...', item);
        }
      });
    }
  }, SETTLE_DELAY_MS);
}
