function ready(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

const textFromScore = (score) => {
  switch (score) {
    case 5:
      return 'excellent';
    case 4:
      return 'good';
    case 3:
      return 'fair';
    case 2:
      return 'poor';
    default:
      return 'no-go';
  }
};

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

  const Ys = Math.pow(parseInt(m.groups.red, 16) / 255.0, 2.2) * 0.2126 +
      Math.pow(parseInt(m.groups.green, 16) / 255.0, 2.2) * 0.7152 +
      Math.pow(parseInt(m.groups.blue, 16) / 255.0, 2.2) * 0.0722; 

  return Ys < 0.4 ? 'ffffff' : '000000';
}

const reviewFromRaw = (newEntry) => {
  const parts = newEntry[0].split(/\t/)
  const dateRaw = parts[0].split(/\s+/);
  const DOM = dateRaw[1] < 9 ? `0${dateRaw[1]}` : dateRaw[1];
  const newDateStr = `${DOM} ${dateRaw[0].substr(0, 3)} ${dateRaw[2]}`;
  const ts = Date.parse(newDateStr);
  const now = new Date();
  const date = new Date();
  date.setTime(ts);

  return {
    date,
    daysOld: Math.round((now.getTime() - ts) / 1000 / 60 / 60 / 24),
    score: scoreFromText(parts[1]),
    scoreText: parts[1],
    style: parts[2],
    poster: parts[3],
    comment: newEntry[1],
    raw: newEntry,
  }
}

const begin = async () => {
  const allScores = {};
  const now = new Date();
  const contentSections = document.getElementsByClassName('entry-content');
  for (const content of contentSections) {
    // our venue headings are <b>s
    // our entries are in <tr>s
    // and our venue IDs are in <a[name]>s
    const headsAndEntries = Array.from(content.querySelectorAll('b, table tr, a[name]')).slice(1);
    let reviews = [];
    let venue = '[unknown]';
    let venueID = 'id-unknown';
    for (let i = 0; i < headsAndEntries.length; i++) {
      const heading = headsAndEntries[i];
      switch (heading.tagName.toLowerCase()) {
        case 'tr': // entry lines
          let rawReviewData = [];
          // start walking through subsequent lines until we find the next venue (a non-<tr>)
          for (let ii = i + 2; ii < headsAndEntries.length; ii++) {
            const rawLine = headsAndEntries[ii];
            if (rawLine.tagName.toLowerCase() == 'tr') { // we've found an review line
              if (rawLine.innerText.trim() == '') { // empty <tr> is the delimeter between reviews
                // build a review from the raw data we've stacked up and then clear the stack
                const review = reviewFromRaw(rawReviewData);
                reviews.push(review);
                rawReviewData = [];
              } else {
                // accumulate review data
                rawReviewData.push(rawLine.innerText);
              }
            } else {
              // we went past the end of reviews, back off one
              i = ii - 1;
              break;
            }
          }
          // after we've gotten all the reviews, save off the venue info
          if (reviews.length > 0) {
            const ts = reviews[0] ? reviews[0].date : new Date(); // get the newest review date
            allScores[venue] = {
              entries: reviews,
              score: reviews[0] ? reviews[0].score : 1,
              venue,
              venueID,
              daysOld: Math.round((now.getTime() - ts) / 1000 / 60 / 60 / 24),
            };
          }
          break;
        case 'b': // we've found a venue heading
          venue = heading.innerText;
          const before = heading.previousElementSibling;
          if (before && before.tagName.toLowerCase() == 'a' && before.attributes.name) {
            venueID = before.attributes.name.nodeValue;
          }
          // clear our the reviews accumulator for our new venue
          reviews = [];
          break;
      }
    }
  }
  produceReport(allScores);
};

const produceReport = (venueList) => {
  const mkup = [];
  let lineStyles = [];
  
  
  const sortedVenues = [];
  Object.keys(venueList)
    .forEach(venueKey => { // go through each venue
      sortedVenues.push(venueList[venueKey]);
      const allScoresEncountered = []; // track each score as we encounter it
      const clScoresEncountered = []; // track each _classical_ score as we encounter it
      const skScoresEncountered = []; // track each _skate_ score as we encounter it

      const allScoreAccumulator = [];  // track all of our weighted scores for tabulation
      const clScoreAccumulator = [];  // track all of our weighted _classical_  scores for tabulation
      const skScoreAccumulator = [];  // track all of our weighted _skate_ scores for tabulation

      let lastDaysOld = 0;
      console.log(`Begining ${venueKey}...`);
       // go through each review
      venueList[venueKey].entries.forEach(e => {
        console.log(`we've now encountered: ${e.score} on ${e.date}`);
        // if the review is older than the oldest review we've seen then we neded
        // to backfill for the calendar days missed where we didn't encounter any reviews
        if (lastDaysOld < e.daysOld) {
          if (allScoresEncountered.length > 0) { // only both if we've got something to backfill with
            const backfillDays = e.daysOld - lastDaysOld;
            for (let z = 0; z < backfillDays; z++) {
              // put a copy of all reviews encountered on for this "missed" day
              console.log(`  ...backfill: ${ allScoreAccumulator.join(', ') }`);
              allScoreAccumulator.push(...allScoresEncountered);
            }
          }
          // track our oldest
          lastDaysOld = e.daysOld;  
        }
        // Add this new score onto our list so far
        allScoresEncountered.push(e.score);
        // @todo track sk/cl separately

        // put a copy of all of the scores onto the accumulator
        allScoreAccumulator.push(...allScoresEncountered);
        console.log(`* daily accumulation: ${allScoreAccumulator.join(', ')}`);
      });

      // Add 'em up and divide by count = weighted average
      const score = allScoreAccumulator.reduce((prev, cur) => { return prev + cur; }, 0) / allScoreAccumulator.length;
      console.log(venueKey, ' => ', score, ", accum:", allScoreAccumulator);
      venueList[venueKey].weightedScore = score;
    });

  

  const sortFields = ['weightedScore', 'daysOld'];

  sortedVenues.sort((a, b) => {
    // for (let i = 0; i < sortFields.length; i++) {
    //   const f = sortFields[i];
    //   if (a[f] < b[f]) 
    // }
    if (a.weightedScore < b.weightedScore) { 
      return 1
    } else if (a.weightedScore > b.weightedScore) {
      return -1;
    }
    if (a.daysOld < b.daysOld) {
      return -1;
    } else if (a.daysOld > b.daysOld) {
      return 1
    }
    return 0;
  });

  mkup.push('<div class="venueScores">');
  sortedVenues.forEach((d, idx) => {
    const bgColor = colorFromScore(Math.ceil(d.weightedScore));
    const textColor = textColorFromBG(bgColor);
    const maxDays = Math.min(8, d.daysOld);
    const lightenBy = ((15 - maxDays) / 10);
    const rating = textFromScore(d.score);
    
    lineStyles.push(`.venueScores .venue-${idx} div { text-align: center; padding: 3px; background-color: #${bgColor}; color: #${textColor}; filter: brightness(${lightenBy}); }`);
    lineStyles.push(`.venueScores .venue-${idx} a { color: #${textColor}; }`);

    mkup.push(`<div class="venue-${idx} row">`);
    mkup.push(`  <div class="col-md-6 col-8" style="text-align: right;"><a class="venue-link" data-href="${d.venueID}" href="#">${d.venue}</a></div>`);
    mkup.push(`  <div class="col-md-2 col-4">${d.weightedScore.toFixed(1)}</div>`);
    mkup.push(`  <div class="col-md-4 d-none d-md-inline-block">${d.daysOld.toFixed(0)} days ago</div>`);
    mkup.push('</div>')
  });
  mkup.push('</div>');

  mkup.push('<style>');
  mkup.push(lineStyles.join("\n"));
  mkup.push('</style>');

  document
    .querySelector("#quickLocationSelector")
    .insertAdjacentHTML("afterend", mkup.join("\n"));

  const qls = document.getElementById('quickLocationSelector');
  document.addEventListener('click', (event) => {
    if (event.target.matches('a.venue-link')) { // trigger that scrolling behavior from the drop-down
      qls.value = event.target.getAttribute('data-href');
      qls.dispatchEvent(new Event('change'));
      event.preventDefault();
    }
  });
}

ready(function () {
  setTimeout(begin, 250);
});
console.log('your entry point here...');
