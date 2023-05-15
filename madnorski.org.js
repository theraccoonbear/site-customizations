// @include standard.js
class Report {
  constructor(date, venue, author, style, score, comment) {
    this.date = date;
    this.venue = venue;
    this.author = author;
    this.style = style;
    this.score = score;
    this.comment = comment;
  }
}
class Venue {
  constructor(id, name, lat, lon, mapUrl, webUrl) {
    this.id = id;
    this.name = name;
    this.lat = lat;
    this.lon = lon;
    this.mapUrl = mapUrl;
    this.webUrl = webUrl;
    this.reports = [];
  }
  setReports(reports) {
    this.reports = reports;
  }
  addReport(report) {
    this.reports.push(report);
  }
  getReports() {
    return this.reports
      .sort((a, b) => a.date < b.date);
  }
  averageScore() {
    const reports = this.getReports();
    const latest = [...reports, new Report()][0].date;
    if (!latest) {
      return 0;
    }
    // calculate average score
    const latestReports = reports
      .filter(r => r.date.toString() == latest.toString())
      .reduce((p, c) => p + c.score, 0) / latestReports.length;
  }
}

class ReportView {
  constructor() {
    this.reports = [];
    this.reportsByVenue = {};
    this.venues = {};
  }
  addVenue(id, name, lat, lon, mapUrl, webUrl) {
    this.venues[id] = new Venue(id, name, lat, lon, mapUrl, webUrl);
    return this.venues[id];
  }
  getVenueIDs() {
    return Object.keys(this.venues);
  }
  getVenue(id) {
    return this.venues[id];
  }
  loadReports(reports) {
    this.reportsByVenue = {};
    this.reports = reports
      .map(r => 
        new Report(r.ReportDate, r.Trail, r.ReportBy, r.ReportStyle, r.Score, r.Body)
      );
    this.reports.forEach(r => {
      if (!this.getVenue(r.venue)) {
        // console.log(`New venue! ${r.venue}`);
        this.addVenue(r.venue, r.venue, 100, 100, "http://", "http://");
      } else {
        // console.log(`New report @ ${r.venue}`);
      }
      const rbv = this.reportsByVenue[r.venue] || [];
      rbv.push(r);
      this.reportsByVenue[r.venue] = rbv;
      const venue = this.getVenue(r.venue);
      venue.setReports(rbv);
    });
  }
  getReportsForVenue(venue) {
    return this.reportsByVenue[venue] || [];
  }
}

const start = () => {
  let blob = document.querySelector('#allReports');
  if (blob) {
    return processReports(blob.text);
  }
  console.log('blob miss');
  setTimeout(start, 250);
}

const processReports = (raw) => {
  try {
    console.log('starting');
    const allReports = JSON.parse(raw);
    // const extra = {
    //   "ReportBy": "Don",
    //   "ReportDate": "20230208",
    //   "UnixTimestamp": 1675814410,
    //   "FormattedDate": "February  8 2023",
    //   "ISO8601": "2023-02-08T16:02:20+00:00",
    //   "SecondsOld": 144140,
    //   "DaysOld": 1,
    //   "ReportGrade": "Good",
    //   "ReportStyle": "Classic",
    //   "ReportArea": "near",
    //   "Score": 4,
    //   "Trail": "Elver Park",
    //   "Body": "Foo"
    // };
    // allReports.push(extra);
    // console.log(allReports);
    const reportView = new ReportView();
    reportView.loadReports(allReports)
    reportView.getVenueIDs()
      .map(vid => {
        const v = reportView.getVenue(vid);
        console.log(`${v.name} (${v.averageScore()}):`, v.reports);
      })
    // const v = reportView.getVenue("Elver Park");
    // console.log(v);
    // console.log(v.averageScore());
  } catch (err) {
    console.error("ERROR!", err);
  }
};

start();
