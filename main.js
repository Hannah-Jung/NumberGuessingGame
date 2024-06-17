// Required variables
let answer = 0;
let submitBtn = document.getElementById("submit-btn");
let newGameBtn = document.getElementById("new-game-btn");
let userInput = document.getElementById("user-input");
let resultArea = document.getElementById("result-area");
let chanceArea = document.getElementById("chance-area");
let historyArea = document.getElementById("history-area");
let chanceSelect = document.getElementById("chance-select");
let selectInfo = document.getElementById("select-info");

// Audio setup
let correctSound = new Audio("./sound/CorrectSound.mp3");
let levelCompleteSound = new Audio("./sound/LevelCompleteSound.mp3");
let gameOverSound = new Audio("./sound/GameOverSound.mp3");
let wrongSound = new Audio("./sound/WrongSound.mp3");
let higherSound = new Audio("./sound/HigherSound.mp3");
let LowerSound = new Audio("./sound/LowerSound.mp3");

// Game state variables
let chance = 0;
let gameOver = false;
let history = [];

// Set initial audio properties
gameOverSound.volume = 0.7;
higherSound.volume = 0.7;
higherSound.playbackRate = 1.7;
LowerSound.volume = 0.7;
LowerSound.playbackRate = 1.7;

// Event listeners
submitBtn.addEventListener("click", play);
newGameBtn.addEventListener("click", reset);
userInput.addEventListener("focus", function () {
  userInput.value = "";
});

// Initially hide input and submit button
userInput.hidden = true;
submitBtn.hidden = true;

// Update game settings based on chance selection
chanceSelect.addEventListener("change", function () {
  chance = parseInt(chanceSelect.value);
  if (chanceSelect != selectInfo) {
    chanceArea.innerHTML = `You have <strong>${chance}</strong> chances!`;
  } else {
    chanceArea.innerHTML = `Please select difficulty above.`;
  }
  userInput.hidden = false;
  submitBtn.hidden = false;
});

// Handle 'Enter' key press
userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    play();
  }
  chanceSelect.hidden = true;
});

// Remove leading zeroes from user input
userInput.addEventListener("input", function () {
  if (userInput.value.startsWith("0") && userInput.value.length > 1) {
    userInput.value = userInput.value.replace(/^0+/, "");
  }
});

// Generate random answer
function randomNum() {
  answer = Math.floor(Math.random() * 100) + 1;
  console.log("Answer: ", answer);
}

// Process user guess
function play() {
  let userValue = userInput.value;

  if (userValue < 1 || userValue > 100) {
    resultArea.innerHTML = `Oops!<br>Your number must be between 1 and 100.<br>Try again!`;
    userInput.value = "";
    wrongSound.play();
    return;
  }

  if (history.includes(userValue)) {
    resultArea.innerHTML = `You've already guessed that number.<br>Choose a different one!`;
    wrongSound.play();
    userInput.value = "";
    return;
  }

  chance--;
  chanceArea.innerHTML = `Keep going! You still have <strong>${chance}</strong> chance(s) left to win!`;
  console.log("chance", chance);

  history.push(userValue);
  console.log(history);

  if (userValue == answer) {
    resultArea.innerHTML = "<img src = ./image/Cheer.gif>";
    chanceArea.innerHTML = `Bravo! Great guess! The answer was <u><strong>${answer}</strong></u>!<br>Want to play again?`;
    correctSound.play();
    levelCompleteSound.play();
    gameOver = true;
  } else if (userValue < answer) {
    resultArea.innerHTML = "<img src = ./image/Higher.gif>";
    if (chance > 0) {
      higherSound.play();
    }
  } else if (userValue > answer) {
    resultArea.innerHTML = "<img src = ./image/Lower.gif>";
    if (chance > 0) {
      LowerSound.play();
    }
  }

  if (chance < 1 && answer != userValue) {
    gameOver = true;
    gameOverSound.play();
    resultArea.innerHTML = "<img src = ./image/GameOver.gif>";
    chanceArea.innerHTML = `The correct number was <u><strong>${answer}</strong></u>. Want to play again?`;
  }

  if (gameOver) {
    submitBtn.hidden = true;
    userInput.hidden = true;
    chanceSelect.hidden = true;
  }

  userInput.value = "";
  updateHistory();
}

// Update guess history display
function updateHistory() {
  let userValue = userInput.value;
  if (userValue != answer) {
    historyArea.innerHTML = `Your guesses so far: <strong>${history.join(
      ", "
    )}</strong>.`;
  } else {
    historyArea.innerHTML = ``;
  }
}

// Reset game settings
function reset() {
  userInput.value = "";
  randomNum();
  resultArea.innerHTML = "<img src = ./image/QuestionMark.gif>";
  chance = parseInt(chanceSelect.value);
  history = [];
  chanceArea.innerHTML = `Ready to play? Please select difficulty above.`;
  gameOver = false;
  historyArea.innerHTML = ``;
  submitBtn.hidden = false;
  userInput.hidden = true;
  chanceSelect.hidden = false;
  gameOverSound.pause();
  gameOverSound.currentTime = 0;
  correctSound.pause();
  correctSound.currentTime = 0;
  levelCompleteSound.pause();
  levelCompleteSound.currentTime = 0;
  submitBtn.hidden = true;
  selectInfo.selected = true;
}

// Initialize game
randomNum();
