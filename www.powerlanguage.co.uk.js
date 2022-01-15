// console.log('your script entry point for debugging...');

// const letter = (n) => String.fromCharCode(n + 65);
// const random = (ar) => ar[Math.floor(Math.random() * (ar.length - 1))];

// class WordleGuesser {
//   words = [];
//   certain = [null, null, null, null, null]
//   inWordButNotAt = [[], [], [], [], []];
//   alphabet = [...new Array(26)].fill('').map((_, i) => String.fromCharCode(i + 65));
//   keyboard = {};

//   constructor() {
//     this.certain = [null, null, null, null, null]
//     this.inWordButNotAt = [[], [], [], [], []];
//     this.bindKeyboard();
//   }

//   bindKeyboard() {
//     for (let button of document.querySelectorAll('button[data-key]')) {
//       this.keyboard[button.attributes('data-key')] = button;
//     }
//   }

//   rnd(ar) {
//     return ar[Math.floor(Math.random() *  (ar.length - 1))];
//   }

//   rndChr() {
//     return this.rnd(this.alphabet);
//   }

//   getGuess() {
//     const g = []
//     for (let i = 0; i < 5; i++) {
//       g.push(this.rndChr());
//     }
//     return g;
//   }

//   pressKey(k) {
//     const b = this.keyboard[k];
//     if (b) {
//       const ev = new Event("click")
//       b.dispatchEvent(ev);
//     }
//   }

//   doGuess() {
//     const guess = this.getGuess();
//     console.log('guessing... ', guess);
//     this.pressKey(guess[0]);
//   }

//   // getWords() {
//   //   if (localStorage && localStorage.wordleGuesserBaseSet) {
//   //     console.log('retrieving cached words...')
//   //     this.words = localStorage.wordleGuesserBaseSet.split(/(.{5})/).filter(x => x.length == 2);
//   //     console.log('retrieved words from localStorage');
//   //   } else {
//   //     console.log('generating word set...');
//   //     this.words = this.generateWords();
//   //     console.log('caching...')
//   //     const packed = this.words.join('');
//   //     localStorage.wordleGuesserBaseSet = this.words.join('');
//   //   }
//   //   return this.words;
//   // }

//   // generateWords() {
//   //   const start = new Date();
//   //   const computed = [];
//   //   let iter = 0;
//   //   for (let a = 0; a < 26; a++) {
//   //     for (let b = 0; b < 26; b++) {
//   //       for (let c = 0; c < 26; c++) {
//   //         for (let d = 0; d < 26; d++) {
//   //           for (let e = 0; e < 26; e++) {
//   //             computed.push([a,b,c,d,e].map(letter).join(''));
//   //             iter++;
//   //           }
//   //         }
//   //       }
//   //     }
//   //   }
//   //   const elap = (new Date()).getTime() - start.getTime();
//   //   console.log(`${elap}ms to complete ${iter} word generations`)
//   //   return computed;
//   // }
// }

// function ready(fn) {
//   if (document.readyState !== 'loading'){
//     fn();
//   } else {
//     document.addEventListener('DOMContentLoaded', fn);
//   }
// }
// ready(function () {
//   let interval = setInterval(() => {
//     const x = document.getElementsByClassName('close-icon');
//     if (x) {
//       clearInterval(interval);
//       x.dispatchEvent(new Event("click"));
//       const wg = new WordleGuesser();
//       wg.doGuess();
//     }
//   }, 250);
// });



