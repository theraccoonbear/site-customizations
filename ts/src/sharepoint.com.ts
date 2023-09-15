import * as std from './lib/standard';

const getPrograms = async () => {
  const date = std.dateFmt(new Date(), 'MM/dd/y');
  const url = `https://reiweb.sharepoint.com/sites/Forms/Prodeal/admin/_api/web/lists/getbytitle('Vendor%20Programs')/items?$select=ID,%20DateExpires,%20Title,%20OfferSummary,%20Website/Url,%20ProdealDetails,%20ProgramFor,%20VendorCodeType,%20ShippingDetails,%20CodeNotificationFrequency,%20NotificationSent&$filter=%20(%20DateAvailable%20le%20%27${date}%27%20and%20DateExpires%20ge%20%27${date}%27)%20and%20(%20ProgramStatus%20eq%20%27Active%27%20or%20ProgramStatus%20eq%20%27Ongoing%20(month%20to%20month)%27%20)&$orderby=Title&$top=5000`
  // const resp = await std.getREST(url)
  console.log('Date:', date);
  console.log('URL:', url);

  const resp = await fetch(url, {
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
  const payload = await resp.json();
  const programs = payload.d.results;
  return programs;
};

const programExists = (programs: any[], title: string): boolean => findProgram(programs, title) !== null;

const findProgram = (programs: any, title: any) => {
  const rgxFindProgram = new RegExp(title, 'i');
  return [...programs.filter((p: any) => rgxFindProgram.test(p.Title)), null][0];
};

std.runForPath('Prodeal.aspx', async () => {
  const programs = await getPrograms();
  console.log('programs:', programs);
  const fjallraven = findProgram(programs, 'Fjallraven Special');
  const adidas = findProgram(programs, 'Adidas Over');
  console.log('Fjallraven:', fjallraven);
  console.log('Adidas:', adidas);

  const byWhoCanUse: any = {};
  programs.forEach((p: any) => {
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
  // std.downloadURI(std.makeDataURI('text/json', data), 'prodeals.json');
});
