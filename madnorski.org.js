function ready(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

const scoreFromText = (description) => {
  switch (description.toLowerCase()) {
    case 'excellent':
      return 5;
    case 'good':
      return 4;
    case 'fair':
      return 3;
    case 'poor':
      return 2;
    default:
      return 1;
  }
};

const colorSchemes = {
  beauty: ['e8554e', 'f19c65', 'ffd265', '2aa876', '0a7b83'],
  generated: ['ff2c2c', 'ca612c', '95962b', '60ca2b', '2bff2a'],
  original: ['ff3300', 'ff9933', 'ffff00', 'ccff66', '009933'],
};

const colorFromScore = (score) => {
  const scheme = 'beauty'
  const colors = [null, ...colorSchemes[scheme]];
  const c = parseInt(score);
  return c >= 1 && c <= 5 ? colors[c] : '333333';
}

const textColorFromBG = (color) => {
  const m = /^(?<red>[a-f0-9]{2})(?<green>[a-f0-9]{2})(?<blue>[a-f0-9]{2})$/i.exec(color);

  let Ys = Math.pow(parseInt(m.groups.red, 16) / 255.0, 2.2) * 0.2126 +
      Math.pow(parseInt(m.groups.green, 16) / 255.0, 2.2) * 0.7152 +
      Math.pow(parseInt(m.groups.blue, 16) / 255.0, 2.2) * 0.0722; 

  return Ys < 0.4 ? 'ffffff' : '000000';
}

const begin = async () => {
  const allScores = {};
  const now = new Date();
  const contentSections = document.getElementsByClassName('entry-content');
  for (const content of contentSections) {
    const headsAndEntries = Array.from(content.querySelectorAll('b, table tr')).slice(1);
    // console.log('headsAndEntries', typeof headsAndEntries);
    // console.log(headsAndEntries);
    let lines = [];
    let venue = '[unknown]';
    for (let i = 0; i < headsAndEntries.length; i++) {
      const heading = headsAndEntries[i];
      // console.log(i, heading.tagName);
      switch (heading.tagName.toLowerCase()) {
        case 'tr': // entry lines
          let newEntry = [];
          for (let ii = i + 2; ii < headsAndEntries.length; ii++) {
            const line = headsAndEntries[ii];
            if (line.tagName.toLowerCase() == 'tr') {
              if (line.innerText.trim() != '') {
                newEntry.push(line.innerText);
              } else {
                const parts = newEntry[0].split(/\t/)
                const dateRaw = parts[0].split(/\s+/);
                const DOM = dateRaw[1] < 9 ? `0${dateRaw[1]}` : dateRaw[1];
                const newDateStr = `${DOM} ${dateRaw[0].substr(0, 3)} ${dateRaw[2]}`;
                const ts = Date.parse(newDateStr);
                const date = new Date();
                date.setTime(ts);

                const entry = {
                  date,
                  score: scoreFromText(parts[1]),
                  scoreText: parts[1],
                  style: parts[2],
                  poster: parts[3],
                  comment: newEntry[1],
                  raw: newEntry,
                }
                lines.push(entry);
                newEntry = [];
              }
            } else {
              i = ii - 1;
              break;
            }
          }
          if (lines.length > 0) {
            const ts = lines[0] ? lines[0].date : new Date();
            allScores[venue] = {
              entries: lines,
              score: lines[0] ? lines[0].score : 1,
              daysOld: (now.getTime() - ts) / 1000 / 60 / 60 / 24,
            };
          }
          break;
        case 'b': // venue
          venue = heading.innerText;
          lines = [];
          break;
      }
    }
  }
  console.log(allScores);
  produceReport(allScores);
};

const produceReport = (data) => {
  const mkup = [];
  let lineStyles = [];
  
  mkup.push('<table class="venueScores">');
  Object.keys(data)
    .forEach((k, idx) => {
      const bgColor = colorFromScore(data[k].score);
      const textColor = textColorFromBG(bgColor);
      lineStyles.push(`.venueScores tr.venue-${idx} td { text-align: center; min-width: 50px; padding: 3px; background-color: #${bgColor}; color: #${textColor}; }`);
      mkup.push(`<tr class="venue-${idx}">`);
      mkup.push(`<td style="text-align: right;">${k}</td>`);
      mkup.push(`<td>${data[k].score}/5</td>`);
      mkup.push(`<td>${data[k].daysOld.toFixed(0)} days ago</td>`);
      mkup.push('</tr>')
    });
  mkup.push('</table>');
  mkup.push('<style>');
  mkup.push(lineStyles.join("\n"));
  mkup.push('</style>');
  document.querySelector("#quickLocationSelector").insertAdjacentHTML("afterend", mkup.join("\n"));

}

ready(function () {
  setTimeout(begin, 250);
});
console.log('here we are...');