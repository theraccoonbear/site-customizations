// @include standard.js
// @include SipHash.js

const stringToUUID = (str) => {
  str = str.replace('-', '');
  return 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, (c, p) => str[p % str.length]);
};

const iCalDate = (dt) => {
  const d = new Date(dt);
  const year = d.getFullYear();
  const mon = `${(d.getMonth() + 1 < 10 ? '0' : '')}${d.getMonth() + 1}`;
  const dom = (d.getDate() < 10 ? '0' : '') + d.getDate();
  const hr = (d.getHours() < 10 ? '0' : '') + d.getHours();
  const min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  const sec = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
  return `${year}${mon}${dom}T${hr}${min}${sec}`;
}

const time = dt => dt
  .toLocaleTimeString('en-US', 
    { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }
  )
  .replace(/:\d{2}\s+/, ' ');

const date = dt => dt
  .toLocaleDateString('en-US',
    { weekday: 'short', month: 'short', day: 'numeric' }
  );

const hash = (m) => stringToUUID(SipHash.hash_hex("calendarFoo", m))

const hoursDiff = (s, e) => (e.getTime() - s.getTime()) / 1000 / 60 / 60;

const iCalEvent = (e, name, email) => {
  const start = new Date(e.orderedSegments[0].startDateTimeUTC);
  const end = new Date(e.orderedSegments[e.orderedSegments.length - 1].endDateTimeUTC);
  const elapsed = hoursDiff(start, end).toPrecision(3);
  const iCal = `BEGIN:VEVENT
UID: ${ hash(iCalDate(start) + iCalDate(end)) }
DTSTAMP;TZID=America/Chicago:${iCalDate(start)}
ORGANIZER;CN=${name}:MAILTO:${email}
DTSTART;TZID=America/Chicago:${iCalDate(start)}
DTEND;TZID=America/Chicago:${iCalDate(end)}
SUMMARY:REI from ${time(start)} to ${time(end)} on ${date(start)} (${elapsed} hours)
END:VEVENT`
  return {
  ...event,
  iCal
  };
};

const fetchCalendar = async (name, email) => {
  const resp = await fetch("https://recreationalequip-ss3.prd.mykronos.com/myschedule/eventDispatcher", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json;charset=UTF-8",
      "page": "ess",
      "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "x-xsrf-token": "XgFykobB-OEgl77tOn-ItMKWwQrSe7wOpW8Y",
      "cookie": "VANITY_URL=https://recreationalequip-ss3.prd.mykronos.com:443/; _csrf=383rxyYNwF781j06aDe7QCKM; deviceType=desktop; authnamlbcookie=01; AUTHN_TOKEN=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjlEOGxWeUExY0lvN2REQVZXMXBVcXl4VEwyND0ifQ.eyJpc3MiOiJodHRwOi8vY3VzdDAxLXByZDA5LWF0aDEwLW9hbS5pbnQucHJkLm15a3Jvbm9zLmNvbTo4MCIsImlhdCI6MTY5MDY0OTQ4MywiZXhwIjoxNjkwNjc4MjgzLCJzdWIiOiIxNzg4NTIiLCJub25jZSI6IjxEbi0wUzZfV3pBMk1qIiwicmVhbG0iOiIvcmVjcmVhdGlvbmFsZXF1aXBfcHJkXzAxIiwiaXByIjpmYWxzZSwib2lkY1Nlc3Npb24iOmZhbHNlfQ.KG6Kef786D6xYda9Z4QJjj8LSmQz7EKXIzUcidxvsPhlAm0ouAvBudojTj80M9KkZGrZ-9Xy5cgl4NL38qoEb8C6t5nF52kByewGUlO3heXkreLYVcYMJUXwKfDgqSYC_-Whxpz09PN7TRW0Os1xnV2iBMCcBkmtAOl8gg0HNnhIg9hO06NXkYMIyftjo45_Fuf6gJvulzoXMKCpCCC6VjeG069GE4GVhq3RvLKd-MBTEMKqT3YV6yGmFAOvSWK4Ro6IWJu2u9gJJ16VmT-GZDAk2Di7jD9WBcSmZ438hfuA4_xKbmQg1-vvbt1xbRfLU9aSIxumapSrn2AoaB1Gzw|L3F0SDBJVFlXa25tVmcwbEM1NHJYU0JaaTVRUXVyVmFrVG1XRHAwVGd6WUpXUjFLdzVicEtFQ3h4R3RHSEtuM2drOHBQS084OUhDNXcxcWRwK2hVeVRSaENMSU51SzBvQVFZV0R0ZXBHMGZGd3p3ZjIzT3p3Tmo0STF3cU9Yd1hiUTc2M0FNc0M1a2R4R3pheFRQN0xKaHd4RW9MY2oyRDZVNTVUZnRMSjFyNEhKN21POXpLTysvSzkwcHhNbHNVUFJIemNTOWJMei9nODJUb1Ryc2pVZ1krRFI1NWNkUCt3YlFEajJ0Rk9QcmdkR05TV3dKaElabWZKazJqMzVqUHJrZ09INExZVEhrbkZIdjdaNmRyNUtvZEIyTGcwZGtoU0ZhelcxbUR3NmNVYXFab3JkMDhtbEFvYUFPSUtrMTEvRzgvdzEvVGE1WVJjTjlWb0xSNnB3YThrMy9NS1ViVmQ1aEY5U1MxbWVCK3B5eDJGSHAyL2tVVW1aZHh5bkJ0N3NIVllYL2hpZG5JaFM4RkJDajRVbGRzZVc4bHBFZ3BEdFBmekNlMDZWYWZwNE5xL2JPTEh5eWZkVHovTDRYaC84bzVzR3VOR0paZkRyZzVIV3p1eEwxTUVueEhWblNOckZCUWdvdWowQ2NkMkxZRW1rOGQyN0ZZUzRwR3J4ZmUvb3Y1dG1qZjZ5cEZ1em5jRjNaK1Exc1JTTGFqZ0FGVWh4TmtDSjNjSjFkU1BBTGdqYk1aTVdHQWFVUkFIUnFXa2dmbjZ2NjhWVThmUk83U000Sks4aHNyTUVQc3N0RUZ5TkFLaW5iaVJaZitndVNoS0lUcU50ZVRvWHNwQ21HVjZuVm5nWmtVR00vWmN0SUQ0ak80eTRlS2tmWVRaUjNiYjFrWVpycWgxbGtiQ1M5SEJkUXFjeTREZnFLMGNGSHQxR1YwbTZ6TGVuZ1ZTSkpGeUIyVXh6Rk9iK0NPNkxkSmsvOFFzK2Q0UUhjNFBlVUpFdWVMNkp3aUxURStwQUs2; IDP_URI=aHR0cHM6Ly9jdXN0MDEtcHJkMDktYXRoMDEucHJkLm15a3Jvbm9zLmNvbS9hdXRobi9yZWNyZWF0aW9uYWxlcXVpcF9wcmRfMDE=; TENANT_AUTHORIZATION=PdtSTeojZ6o5uqR5Va2kGp1g7dQJTO1Sc86EZPuFA+w=; authn_ssid=TJnoWfaXV5_2RvcNDWsxy1uOcpY.*AAJTSQACMDIAAlNLABwveTE0U0JmQjE4WGpBY29mMzlydXBnL2tkSms9AAR0eXBlAANDVFMAAlMxAAIwMQ..*; falconAuthCookie=true; ssologin=true; JSESSIONID=E792FBB14C2A5FE8C29A96D28C42F1D3; srv_id=1512edd8361998e15dfc580a6ecb5b61; AUTHZ_TOKEN=YmxZenNTUmJOQUFVZ3cxZGl6d3prZlh4eXhjelRGZzVEWVBLUzBZNzAxTC9DSGVWQVhyclBPMDhiUXB1RXg0TEpuYmFRT0k4MVIraWZsNG5jL2pJVXZhZ2dJODZLZVpuRDhDWVRmSFlLNGdxM1hDdGUwbVpJcGczQy9VcGlHVm1kMk09X3Yy; authn_external_ssid=TJnoWfaXV5_2RvcNDWsxy1uOcpY.*AAJTSQACMDIAAlNLABwveTE0U0JmQjE4WGpBY29mMzlydXBnL2tkSms9AAR0eXBlAANDVFMAAlMxAAIwMQ..*; kronosAuthToken=b1695c58a05727cbc63dfb158b201acc886ea9f4; kronosCookie=srv_id%3D1512edd8361998e15dfc580a6ecb5b61%3BJSESSIONID%3DE792FBB14C2A5FE8C29A96D28C42F1D3%3BWFC_INSTANCE%3Der7e35KlJkl5hQ4nAJdG1x7keDoquYaNkWfdND7CHPRXEYw9ULTVjkLdiQqjxv3IBn0lYYnNGAqsaq3pgIoR%2Frv0bCBrdDtqST4NNuakCeA-%3BWFC_USER%3Dr8cGdAdfFVAdGtiCdFgyHIbSYzfULX9FsxOTg4wSm78hqczGNuR4rtezNP6OrDBB%3BWFC_TENANT_ID%3D71we2NaeOHALgq4%2FbsuCpY5LUgPw%2FRQ6OXsKaPKqVf%2FbSl%2BYff9KmKorKLtR%2BzT2PyRn%2B0EsOHg4UqR6j67i9w--%3BJSESSIONID%3DE792FBB14C2A5FE8C29A96D28C42F1D3%3BAUTHZ_TOKEN%3DYmxZenNTUmJOQUFVZ3cxZGl6d3prZlh4eXhjelRGZzVEWVBLUzBZNzAxTC9DSGVWQVhyclBPMDhiUXB1RXg0TEpuYmFRT0k4MVIraWZsNG5jL2pJVXZhZ2dJODZLZVpuRDhDWVRmSFlLNGdxM1hDdGUwbVpJcGczQy9VcGlHVm1kMk09X3Yy%3B; securityToken=NXGZ-XVM5-SGQX-DOUQ-TSO3-N5S2-K6YR-V8EI; widgetToken=515e21d5-83db-4cfc-85f9-c9cef8571556; allTokens=j%3A%7B%22com.kronos.wfc.ngui.search%22%3A%7B%22value%22%3A%22515e21d5-83db-4cfc-85f9-c9cef8571556%22%7D%2C%22com.kronos.wfc.ngui.peopleeditor%22%3A%7B%22value%22%3A%22286a1d3d-19cd-4d11-8317-ebdf39ffdf55%22%7D%2C%22com.kronos.wfc.ngui.scheduleRest%22%3A%7B%22value%22%3A%22bd6f1c7f-92b1-4f72-b790-38d2942ea5d7%22%7D%2C%22com.kronos.wfc.ngui.generictimeeditor_mgr%22%3A%7B%22value%22%3A%22938d2001-a069-48c0-8040-1eb74e854e29%22%7D%2C%22com.kronos.wfc.ngui.generictimeeditor_emp%22%3A%7B%22value%22%3A%22cd8bf02c-b82a-4cde-89be-24e2b0b26030%22%7D%2C%22com.kronos.wfc.ngui.calendar%22%3A%7B%22value%22%3A%22de02ccb2-9102-45c5-aa1e-4404f7e8d1b8%22%7D%2C%22timeStampTileToken%22%3A%7B%22value%22%3A%2205cf3977-2355-48f4-adf7-96c0b6a43451%22%7D%7D; srv_id=1512edd8361998e15dfc580a6ecb5b61; WFC_USER=r8cGdAdfFVAdGtiCdFgyHIbSYzfULX9FsxOTg4wSm78hqczGNuR4rtezNP6OrDBB; WFC_TENANT_ID=71we2NaeOHALgq4/bsuCpY5LUgPw/RQ6OXsKaPKqVf/bSl+Yff9KmKorKLtR+zT2PyRn+0EsOHg4UqR6j67i9w--; XSRF-TOKEN=XgFykobB-OEgl77tOn-ItMKWwQrSe7wOpW8Y",
      "Referer": "https://recreationalequip-ss3.prd.mykronos.com/ess",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": "{\"startDate\":\"2023-06-25\",\"endDate\":\"2023-08-05\",\"types\":[{\"name\":\"approvedtimeoffrequest\",\"order\":2,\"domain\":\"SCHEDULING\",\"isExclusivelyFrontEnd\":false,\"visible\":true,\"group\":[\"filters\"],\"template\":\"components/employeeView/eventDefinitions/approvedtimeoffrequest/template.html\"},{\"name\":\"regularshift\",\"order\":3,\"domain\":\"SCHEDULING\",\"isExclusivelyFrontEnd\":false,\"visible\":true,\"group\":[\"filters\"],\"template\":\"components/employeeView/eventDefinitions/regularshift/template.html\"},{\"name\":\"paid_leave_time_all_cases\",\"order\":4,\"domain\":\"LEAVE\",\"isExclusivelyFrontEnd\":false,\"visible\":true,\"group\":[\"filters\"],\"template\":\"components/employeeView/eventDefinitions/paid_leave_time_all_cases/template.html\"},{\"name\":\"paycodeedit\",\"order\":5,\"domain\":\"SCHEDULING\",\"isExclusivelyFrontEnd\":false,\"visible\":true,\"group\":[\"filters\"],\"template\":\"components/employeeView/eventDefinitions/paycodeedit/template.html\"},{\"name\":\"transfershift\",\"order\":6,\"domain\":\"SCHEDULING\",\"isExclusivelyFrontEnd\":false,\"visible\":true,\"group\":[\"filters\"],\"template\":\"components/employeeView/eventDefinitions/transfershift/template.html\"},{\"name\":\"swaprequest\",\"order\":7,\"domain\":\"SCHEDULING\",\"isExclusivelyFrontEnd\":false,\"visible\":true,\"group\":[\"filters\"],\"template\":\"components/employeeView/eventDefinitions/swaprequests/template.html\"},{\"name\":\"openshiftrequest\",\"order\":8,\"domain\":\"SCHEDULING\",\"isExclusivelyFrontEnd\":false,\"visible\":true,\"group\":[\"filters\"],\"template\":\"components/employeeView/eventDefinitions/openshiftrequest/template.html\"},{\"name\":\"openshift\",\"order\":9,\"domain\":\"SCHEDULING\",\"isExclusivelyFrontEnd\":false,\"visible\":true,\"group\":[\"filters\"],\"template\":\"components/employeeView/eventDefinitions/openshift/template.html\"},{\"name\":\"coverrequest\",\"order\":10,\"domain\":\"SCHEDULING\",\"isExclusivelyFrontEnd\":false,\"visible\":true,\"group\":[\"filters\"],\"template\":\"components/employeeView/eventDefinitions/coverrequests/template.html\"}],\"configId\":3004002,\"isRestEndpoint\":true}",
    "method": "POST"
  });

  if (!resp.ok) {
    throw new Error(`Failed: ${resp.status} ${resp.statusText}`);
  }
  const body = await resp.json();
  if (!Array.isArray(body)) {
    throw new Error(`Non-array response!`);
  }
  return body.map(e => {
    // console.log(e);
    const ice = iCalEvent(e, name, email);
    return ice;
  });
};

const generateCalendar = async (name, email) => {
  const cal = await fetchCalendar(name, email);
  // console.log("Calendar:", cal);
  const iCalEvents = cal
    .map(c => c.iCal).join("\n");
  const iCalFull = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
${iCalEvents}
END:VCALENDAR`;

  console.log("\n\n");
  console.log(iCalFull);

  // downloadURI(makeDataURI("text/calendar", iCalFull), "schedule.vcs");
};


// const cloneButton = (srcBtn, label, icon) => {
//   const text = srcBtn
//     .getInnerHTML()
//     .replace(/id="([^"]+)"/g, 'id="$1_foo"');
//   const container = document.createElement('div');
//   container.innerHTML = text;

//   const iconElem = container.querySelector('button i');
//   iconElem.classList = "";
//   iconElem.classList.add(`icon-k-${icon}`);

//   const lblElem = container.querySelector('.icon-label span');
//   lblElem.innerHTML = label;

//   return container.children.item(0);
// }


const begin = async () => {
  generateCalendar("Me", "me@host.com");
};

ready(begin);
