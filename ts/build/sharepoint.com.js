"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const std = __importStar(require("./lib/standard"));
const getPrograms = () => __awaiter(void 0, void 0, void 0, function* () {
    const date = std.dateFmt(new Date(), 'MM/dd/y');
    const url = `https://reiweb.sharepoint.com/sites/Forms/Prodeal/admin/_api/web/lists/getbytitle('Vendor%20Programs')/items?$select=ID,%20DateExpires,%20Title,%20OfferSummary,%20Website/Url,%20ProdealDetails,%20ProgramFor,%20VendorCodeType,%20ShippingDetails,%20CodeNotificationFrequency,%20NotificationSent&$filter=%20(%20DateAvailable%20le%20%27${date}%27%20and%20DateExpires%20ge%20%27${date}%27)%20and%20(%20ProgramStatus%20eq%20%27Active%27%20or%20ProgramStatus%20eq%20%27Ongoing%20(month%20to%20month)%27%20)&$orderby=Title&$top=5000`;
    // const resp = await std.getREST(url)
    console.log('Date:', date);
    console.log('URL:', url);
    const resp = yield fetch(url, {
        "headers": {
            "accept": "application/json; odata=verbose",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
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
    const payload = yield resp.json();
    const programs = payload.d.results;
    return programs;
});
const programExists = (programs, title) => findProgram(programs, title) !== null;
const findProgram = (programs, title) => {
    const rgxFindProgram = new RegExp(title, 'i');
    return [...programs.filter((p) => rgxFindProgram.test(p.Title)), null][0];
};
const doIt = () => __awaiter(void 0, void 0, void 0, function* () {
    const programs = yield getPrograms();
    console.log('programs:', programs);
    // const fjallraven = findProgram(programs, 'Fjallraven Special');
    // const adidas = findProgram(programs, 'Adidas Over');
    // console.log('Fjallraven:', fjallraven);
    // console.log('Adidas:', adidas);
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
    console.log('everything:', total);
    const data = JSON.stringify(total, null, 2).replace(/[\u00A0-\u2666]/g, (c) => `&#${c.charCodeAt(0)};`);
    std.downloadURI(std.makeDataURI('text/json', data), 'prodeals.json');
});
std.runForPath('Prodeal.aspx', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const header = document.querySelector('h1#pageTitle');
    const button = std.mkButton('Download Programs', doIt);
    (_a = header === null || header === void 0 ? void 0 : header.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(button);
}));
