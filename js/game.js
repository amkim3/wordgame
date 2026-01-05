import words from './words.js';
import heads from './heads.js';

let baseWord = "";
let goalWord = "";
let wordChain = [];
let totalGuesses = 0;

async function start() {
  const keys = Object.keys(words);
  baseWord = keys[Math.floor(Math.random() * keys.length)];
  goalWord = heads[Math.floor(Math.random() * heads.length)];
  while (goalWord === baseWord) { // avoid goal = base initially
    goalWord = heads[Math.floor(Math.random() * heads.length)];
  }
  wordChain = [baseWord];
  console.log("Base word:", baseWord);
  renderChain();
}

async function renderChain() {
    const list = document.getElementById("chain");
    list.innerHTML = "";
    wordChain.forEach(word => {
        const li = document.createElement("li");
        li.textContent = word;
        list.appendChild(li);
    });
    document.getElementById("base-word").textContent = baseWord;
    document.getElementById("goal-word").textContent = goalWord;
}

// async function validateGuess(guess) {
//     try {
//         const response = await fetch('http://localhost:3000/validate', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ word: guess.toLowerCase() })
//         });
//         const result = await response.json();
//         return result.valid;
//     } catch (error) {
//         console.error('Error validating guess:', error);
//         return false;
//     }
// }

async function validateCombination(base, guess) {
  const combined = (base + guess).toLowerCase();
  const validCompounds = words[base];
  if (validCompounds && validCompounds.includes(combined)) return true;
  return false;
}

async function undoLastGuess() {
  if (wordChain.length <= 1) {
    alert("Nothing to undo!");
    return;
  }

  // Remove last guess
  wordChain.pop();

  // Set base word to previous guess
  baseWord = wordChain[wordChain.length - 1];

  // Update total guesses if you are tracking it
  if (totalGuesses > 0) totalGuesses--;

  // Re-render the chain
  renderChain();
}

document.addEventListener("DOMContentLoaded", () => {
    start();
});
document.getElementById("undo-btn").addEventListener("click", undoLastGuess);
document.getElementById("reset-btn").addEventListener("click", () => {
  start();
});

document.getElementById("guess-form").addEventListener("submit", async e => {
  e.preventDefault();

  const input = document.getElementById("guess-input");
  const guess = input.value.trim().toLowerCase();
  if (!guess) return;

//   const isWordValid = await validateGuess(guess);
//   if (!isWordValid) {
//     alert("Invalid word");
//     return;
//   }
  const isComboWin = await validateCombination(guess, goalWord);
  if (isComboWin) {
    alert(guess + goalWord);
    alert(`You completed the goal! Total guesses: ${++totalGuesses}`);
    return; // Game ends
  }
  else {
    const isComboValid = await validateCombination(baseWord, guess);
    if (!isComboValid) {
        alert("Invalid combo word");
        return;
    }
    else totalGuesses++;
  }

  
  
  

  // Advance game state
  baseWord = guess;
  wordChain.push(guess);

  renderChain();
  input.value = "";
});