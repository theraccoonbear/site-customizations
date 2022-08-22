// console.log('entry point');
// let ourInterval;
// let checking = false;

// let doIt = () => {
//   if (checking || typeof trainingOptions === 'undefined' || typeof trainingOptions.trainingSessionId === 'undefined') {
//     return;
//   }
//   checking = true;
//   const data = {
//     trainingSessionId: trainingOptions.trainingSessionId,
//     returnType: 'json'
//   };
//   fetch(`/learn/edugame/begin`, {
//     method: "POST",
//     header: {'Content-Type': 'application/json'}, 
//     body: JSON.stringify(data)
//   }).then(res => {
//     console.log("RES:", res);
//   }).catch(err => {
//     console.error("ERR:", err);
//   }).finally(() => {
//     console.log('done');
//     clearInterval(ourInterval);
//     checking = false;
//   });
// }


// ourInterval = setInterval(() => doIt(), 250);
