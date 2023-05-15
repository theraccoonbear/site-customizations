// @include standard.js

function isVowel(char) {
  return ['a', 'e', 'i', 'o', 'u', 'y'].includes(char.toLowerCase());
}

const wordSplitter = /\s|(?<=[a-zA-Z])-(?=[a-zA-Z])/g;

function applyBionicReading(minWords = 10) {
  // Define tags that typically contain display text
  const textTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'span', 'blockquote', 'caption', 'td', 'th', 'label', 'button'];

  // Select all elements on the page with the specified tags
  const textElements = document.querySelectorAll(textTags.join(','));

  // Loop through all elements
  textElements.forEach((element) => {
    // Check if the element has text content
    if (element.textContent.trim() !== '') {
      // Count the number of words in the element
      const words = element.textContent.trim().split(wordSplitter);

      // If the word count is greater than or equal to the minimum words
      if (words.length >= minWords) {

        // Create a new HTML string
        let newHtml = '';

        // Loop through each word
        words.forEach((word) => {
          const firstVowelIndex = [...word].findIndex(isVowel);
          const boldedLetters = `<span class="bionic-bold">${word.slice(0, firstVowelIndex + 1)}</span>`;
          const remainingLetters = word.slice(firstVowelIndex + 1);
          const newWord = `${boldedLetters}${remainingLetters}`;

          newHtml += `${newWord} `;
        });

        // Set the element's innerHTML to the new HTML string
        element.innerHTML = newHtml.trim();
      }
    }
  });
}


ready(() => {
  // Apply Bionic Reading to elements with more than 10 words and bold the first 3 letters of each word
  // applyBionicReading(10);
});
