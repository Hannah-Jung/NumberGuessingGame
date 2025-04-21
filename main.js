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
let lowerSound = new Audio("./sound/LowerSound.mp3");
let failTrumpetSound = new Audio("./sound/FailTrumpetSound.mp3");

// Game state variables
let chance = 0;
let gameOver = false;
let history = [];
let previousGuess = null;
let selectedDifficulty = "";
let soundEnabled = true;

// Set initial audio properties
gameOverSound.volume = 0.7;
higherSound.volume = 0.7;
higherSound.playbackRate = 1.7;
lowerSound.volume = 0.7;
lowerSound.playbackRate = 1.7;
failTrumpetSound.volume = 0.4;

// Sound player function
function playSound(sound) {
  if (soundEnabled && sound) {
    sound.currentTime = 0; // Prevent overlapping
    sound.play();
  }
}

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
  selectedDifficulty = chanceSelect.value;

  if (chanceSelect.value !== "") {
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

// Remove non-integer values (like decimals) from the input
userInput.addEventListener("input", function () {
  // Remove any non-numeric character except for digits
  userInput.value = userInput.value.replace(/[^0-9]/g, "");

  if (userInput.value.includes(".")) {
    userInput.value = userInput.value.split(".")[0]; // Only keep the integer part before the decimal
  }
});

// Toggle between sound on and off, and update button label
const toggleSoundBtn = document.getElementById("toggle-sound");

toggleSoundBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  toggleSoundBtn.innerText = soundEnabled ? "🔊 Sound On" : "🔇 Sound Off";

  // Stop all sounds if sound is turned off
  if (!soundEnabled) {
    correctSound.pause();
    correctSound.currentTime = 0;
    levelCompleteSound.pause();
    levelCompleteSound.currentTime = 0;
    gameOverSound.pause();
    gameOverSound.currentTime = 0;
    wrongSound.pause();
    wrongSound.currentTime = 0;
    higherSound.pause();
    higherSound.currentTime = 0;
    lowerSound.pause();
    lowerSound.currentTime = 0;
    failTrumpetSound.pause();
    failTrumpetSound.currentTime = 0;
  }
});

// Toggle between dark and light mode, and update button label
const toggleBtn = document.getElementById("themeToggle");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    toggleBtn.textContent = "☀️ Light Mode";
  } else {
    toggleBtn.textContent = "🌙 Dark Mode";
  }
});

// Generate random answer
function randomNum() {
  answer = Math.floor(Math.random() * 100) + 1;
  console.log("Answer: ", answer);
}

// Process user guess
function play() {
  let userValue = parseInt(userInput.value);

  // Check if input is out of range (1–100) and show a warning
  if (userValue < 1 || userValue > 100) {
    resultArea.innerHTML = `Oops!<br>Your number must be between 1 and 100.<br>Try again!`;
    userInput.value = "";
    playSound(failTrumpetSound);
    return;
  }

  // Check if the guess was already made and give a hint to choose a different number
  if (history.includes(userValue)) {
    resultArea.innerHTML = `You've already guessed that number.<br>Choose something ${
      previousGuess < answer ? "higher" : "lower"
    } than ${previousGuess}!`;
    playSound(wrongSound);
    userInput.value = "";
    return;
  }

  // Check if the user ignored the previous hint and guessed in the wrong direction again
  if (previousGuess !== null) {
    if (
      (previousGuess < answer && userValue < previousGuess) ||
      (previousGuess > answer && userValue > previousGuess)
    ) {
      resultArea.innerHTML = `Hint was ${
        previousGuess < answer ? "higher" : "lower"
      },<br> but you guessed ${
        previousGuess < userValue ? "higher" : "lower"
      } than ${previousGuess}.<br>Try again!`;
      userInput.value = "";
      playSound(failTrumpetSound);
      return;
    }
  }

  chance--;
  chanceArea.innerHTML = `Keep going! You still have <strong>${chance}</strong> chance(s) left to win!`;
  console.log("chance", chance);

  history.push(userValue);
  console.log(history);

  // Check the user's guess and display appropriate feedback (correct, higher, or lower)
  if (userValue == answer) {
    resultArea.innerHTML = "<img src = ./image/Cheer.gif>";
    chanceArea.innerHTML = `Bravo! Great guess!<br> The answer: <strong><span class="blinking-text"><u>${answer}</u></span></strong><br><br>Want to play again?`;
    playSound(correctSound);
    playSound(levelCompleteSound);
    gameOver = true;
  } else if (userValue < answer) {
    resultArea.innerHTML = "<img src = ./image/Higher.gif>";
    if (chance > 0) {
      playSound(higherSound);
    }
  } else if (userValue > answer) {
    resultArea.innerHTML = "<img src = ./image/Lower.gif>";
    if (chance > 0) {
      playSound(lowerSound);
    }
  }

  // Save the current guess and handle game over if no chances are left
  previousGuess = userValue;

  if (chance < 1 && answer != userValue) {
    gameOver = true;
    playSound(gameOverSound);
    resultArea.innerHTML = "<img src = ./image/GameOver.gif>";
    chanceArea.innerHTML = `The correct number: <strong><span class="blinking-text"><u>${answer}</u></span></strong><br><br>Want to play again?`;
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
    historyArea.innerHTML = `You've guessed: <strong>${history.join(
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
  chanceArea.innerHTML = `Ready to play?<br> Please select difficulty above.`;
  gameOver = false;
  previousGuess = null;
  historyArea.innerHTML = ``;
  submitBtn.hidden = false;
  userInput.hidden = true;
  chanceSelect.hidden = false;

  // Set the game difficulty based on the selected value and show/hide input and submit button accordingly
  if (selectedDifficulty !== "") {
    chance = parseInt(selectedDifficulty);
    chanceArea.innerHTML = `You have <strong>${chance}</strong> chances!`;
    chanceSelect.value = selectedDifficulty;

    userInput.hidden = false;
    submitBtn.hidden = false;
  } else {
    chanceArea.innerHTML = `Ready to play?<br> Please select difficulty above.`;
    userInput.hidden = true;
    submitBtn.hidden = true;
  }
  submitBtn.hidden = true;
}

// Initialize game
randomNum();
