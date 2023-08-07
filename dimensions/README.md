# Dimensions

## The Problem

Dimensions is a scheduling and timekeeping tool from HR/Workforce Management developer UKG.  Formerly known as Kronos, Dimension boasts an updated look and feel with no real functional leaps forward, yet maintains advanced features like an absence of calendar export into decades-old and widely-deployed standards such as vCal/iCal.

With vCal or iCal exports, one can trivially import their work schedule into almost any personal calendaring tool including Apple Calendar and Google Calendar (gCal).

## The Solution

The real issue is that the data is all there, it's just not being given to the user in a simple format that they can use.  Here we provide a simple piece of JavaScript that requests the user's shift information and creates a vCal export file for them.

Create a [bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet) in your browser's bookmark toolbar using this JavaScript snippet to have it handy whenever you visit the Dimensions site:

```js
javascript:"use strict";(()=>{const e="https://javascript-cdn-8712.s3.amazonaws.com/",o=["mykronos.com.js"],n=()=>{o.forEach(a=>{const t=document.createElement("script");t.type="text/javascript",t.src=`${e}${a}?_cb=${Math.random()}`,t.onload=()=>{new Function("generateCalendar('Me', 'me@host.com')")()},document.body.appendChild(t)})};document.readyState!=="loading"?n():document.addEventListener("DOMContentLoaded",n)})();
```