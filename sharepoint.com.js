"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/lib/SipHash.js
var require_SipHash = __commonJS({
  "src/lib/SipHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SipHash = void 0;
    exports.SipHash = function() {
      "use strict";
      function r(r2, n2) {
        var t2 = r2.l + n2.l, h2 = { h: r2.h + n2.h + (t2 / 2 >>> 31) >>> 0, l: t2 >>> 0 };
        r2.h = h2.h, r2.l = h2.l;
      }
      function n(r2, n2) {
        r2.h ^= n2.h, r2.h >>>= 0, r2.l ^= n2.l, r2.l >>>= 0;
      }
      function t(r2, n2) {
        var t2 = { h: r2.h << n2 | r2.l >>> 32 - n2, l: r2.l << n2 | r2.h >>> 32 - n2 };
        r2.h = t2.h, r2.l = t2.l;
      }
      function h(r2) {
        var n2 = r2.l;
        r2.l = r2.h, r2.h = n2;
      }
      function e(e2, l2, o2, u2) {
        r(e2, l2), r(o2, u2), t(l2, 13), t(u2, 16), n(l2, e2), n(u2, o2), h(e2), r(o2, l2), r(e2, u2), t(l2, 17), t(u2, 21), n(l2, o2), n(u2, e2), h(o2);
      }
      function l(r2, n2) {
        return r2[n2 + 3] << 24 | r2[n2 + 2] << 16 | r2[n2 + 1] << 8 | r2[n2];
      }
      function o(r2, t2) {
        "string" == typeof t2 && (t2 = u(t2));
        var h2 = { h: r2[1] >>> 0, l: r2[0] >>> 0 }, o2 = { h: r2[3] >>> 0, l: r2[2] >>> 0 }, i = { h: h2.h, l: h2.l }, a = h2, f = { h: o2.h, l: o2.l }, c = o2, s = t2.length, v = s - 7, g = new Uint8Array(new ArrayBuffer(8));
        n(i, { h: 1936682341, l: 1886610805 }), n(f, { h: 1685025377, l: 1852075885 }), n(a, { h: 1819895653, l: 1852142177 }), n(c, { h: 1952801890, l: 2037671283 });
        for (var y = 0; y < v; ) {
          var d = { h: l(t2, y + 4), l: l(t2, y) };
          n(c, d), e(i, f, a, c), e(i, f, a, c), n(i, d), y += 8;
        }
        g[7] = s;
        for (var p = 0; y < s; )
          g[p++] = t2[y++];
        for (; p < 7; )
          g[p++] = 0;
        var w = { h: g[7] << 24 | g[6] << 16 | g[5] << 8 | g[4], l: g[3] << 24 | g[2] << 16 | g[1] << 8 | g[0] };
        n(c, w), e(i, f, a, c), e(i, f, a, c), n(i, w), n(a, { h: 0, l: 255 }), e(i, f, a, c), e(i, f, a, c), e(i, f, a, c), e(i, f, a, c);
        var _ = i;
        return n(_, f), n(_, a), n(_, c), _;
      }
      function u(r2) {
        if ("function" == typeof TextEncoder)
          return new TextEncoder().encode(r2);
        r2 = unescape(encodeURIComponent(r2));
        for (var n2 = new Uint8Array(r2.length), t2 = 0, h2 = r2.length; t2 < h2; t2++)
          n2[t2] = r2.charCodeAt(t2);
        return n2;
      }
      return { hash: o, hash_hex: function(r2, n2) {
        var t2 = o(r2, n2);
        return ("0000000" + t2.h.toString(16)).substr(-8) + ("0000000" + t2.l.toString(16)).substr(-8);
      }, hash_uint: function(r2, n2) {
        var t2 = o(r2, n2);
        return 4294967296 * (2097151 & t2.h) + t2.l;
      }, string16_to_key: function(r2) {
        var n2 = u(r2);
        if (16 !== n2.length)
          throw Error("Key length must be 16 bytes");
        var t2 = new Uint32Array(4);
        return t2[0] = l(n2, 0), t2[1] = l(n2, 4), t2[2] = l(n2, 8), t2[3] = l(n2, 12), t2;
      }, string_to_u8: u };
    }();
  }
});

// src/lib/standard.ts
var import_SipHash = __toESM(require_SipHash());
var ready = (fn) => {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};
window.ready = ready;
var runForPath = async (path, func) => {
  const rgx = new RegExp(path, "i");
  if (rgx.test(document.location.pathname)) {
    console.log(`Conditional path match for "${path}"`);
    ready(() => {
      console.log(`Executing for "${path}"`);
      func();
    });
  }
};
var mkButton = (label, action, classes = []) => {
  const button = document.createElement("button");
  button.setAttribute("value", label);
  button.innerHTML = label;
  button.addEventListener("click", action);
  button.classList.add(...classes);
  return button;
};
var makeDataURI = (mimeType, data) => `data:${mimeType};charset=utf-8;base64,${btoa(unescape(encodeURIComponent(data)))}`;
var downloadURI = (uri, name) => {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
};
var dateFmt = (d, format = "") => {
  const year = d.getFullYear();
  const mon = `${d.getMonth() + 1 < 10 ? "0" : ""}${d.getMonth() + 1}`;
  const dom = (d.getDate() < 10 ? "0" : "") + d.getDate();
  return `${mon}/${dom}/${year}`;
};
console.log("your script debugging entry point here...");

// src/sharepoint.com.ts
var getPrograms = async () => {
  const date = dateFmt(/* @__PURE__ */ new Date(), "MM/dd/y");
  const url = `https://reiweb.sharepoint.com/sites/Forms/Prodeal/admin/_api/web/lists/getbytitle('Vendor%20Programs')/items?$select=ID,%20DateExpires,%20Title,%20OfferSummary,%20Website/Url,%20ProdealDetails,%20ProgramFor,%20VendorCodeType,%20ShippingDetails,%20CodeNotificationFrequency,%20NotificationSent&$filter=%20(%20DateAvailable%20le%20%27${date}%27%20and%20DateExpires%20ge%20%27${date}%27)%20and%20(%20ProgramStatus%20eq%20%27Active%27%20or%20ProgramStatus%20eq%20%27Ongoing%20(month%20to%20month)%27%20)&$orderby=Title&$top=5000`;
  console.log("Date:", date);
  console.log("URL:", url);
  const resp = await fetch(url, {
    "headers": {
      "accept": "application/json; odata=verbose",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua": '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "https://reiweb.sharepoint.com/sites/forms/Prodeal/SitePages/Prodeal.aspx",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  if (!resp.ok) {
    throw new Error(`Error getting programs: ${resp.status} ${resp.statusText}`);
  }
  const payload = await resp.json();
  const programs = payload.d.results;
  return programs;
};
var doIt = async () => {
  const programs = await getPrograms();
  console.log("programs:", programs);
  const byWhoCanUse = {};
  programs.forEach((p) => {
    const type = p.ProgramFor.results[0];
    const ar = byWhoCanUse[type] || [];
    ar.push(p);
    byWhoCanUse[type] = ar;
  });
  const total = {
    programs,
    byWhoCanUse
  };
  console.log("everything:", total);
  const data = JSON.stringify(total, null, 2).replace(/[\u00A0-\u2666]/g, (c) => `&#${c.charCodeAt(0)};`);
  downloadURI(makeDataURI("text/json", data), "prodeals.json");
};
runForPath("Prodeal.aspx", async () => {
  const header = document.querySelector("h1#pageTitle");
  const button = mkButton("Download Programs", doIt);
  header?.parentElement?.appendChild(button);
});
