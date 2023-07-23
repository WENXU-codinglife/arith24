// Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};

const TIME_LIMIT = 180;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("timer").innerHTML = `
<div class="base-timer">
<svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <g class="base-timer__circle">
    <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
    <path
      id="base-timer-path-remaining"
      stroke-dasharray="283"
      class="base-timer__path-remaining ${remainingPathColor}"
      d="
        M 50, 50
        m -45, 0
        a 45,45 0 1,0 90,0
        a 45,45 0 1,0 -90,0
      "
    ></path>
  </g>
</svg>
<span id="base-timer-label" class="base-timer__label">${formatTime(
  timeLeft
)}</span>
</div>
`;

function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = TIME_LIMIT;
  timePassed = 0;
  setTimerEffect();
  document
    .querySelector(".base-timer__path-remaining")
    .classList.remove(COLOR_CODES.alert.color);
  document
    .querySelector(".base-timer__path-remaining")
    .classList.add(COLOR_CODES.info.color);
}
function onTimesUp() {
  clearInterval(timerInterval);
  if (currentMode === "thinkMode") {
    alert("Time is up! (thinkMode)");
  } else if (currentMode === "answerMode") {
    alert("Time is up! (answerMode)");
  }
  updateStats(false);
  resetEquations();
  resetTimer();
  modeSwitching("regularMode");
}
function cancelAndRestartTimer() {
  clearInterval(timerInterval);
  resetTimer();
  startTimer();
}
function setTimerEffect() {
  document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
  setCircleDasharray();
  setRemainingPathColor(timeLeft);
}
function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    setTimerEffect();

    if (timeLeft < 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}
// Mateusz Rybczonec's code ends

let currentMode = "";
modeSwitching("regularMode");
function modeSwitching(mode) {
  currentMode = mode;
  switchRobotPrompt();
  if (mode === "answerMode") {
    /*
    - show solution container
    - answer-timer started
    - carts in shrink mode
    - answer button is not clickable
    */
    document.querySelector(".solution-container").style.display = "flex";
    const cards = document.querySelectorAll(".poker-card");
    for (let el of cards) {
      el.classList.add("shrink");
    }
    cancelAndRestartTimer();
  } else {
    document.querySelector(".solution-container").style.display = "none";
    const cards = document.querySelectorAll(".shrink");
    if (cards)
      for (let card of cards) {
        card.classList.remove("shrink");
      }
    switchSolutionAppearance("hide");
  }

  if (mode === "regularMode") {
    /*
    - hide solution container
    - poker cards show back side
    - card in non-shrink mode
    - answer button is as ready button and is clickable
    */
    document.querySelector(".solution-container").style.display = "none";
    const cardFaces = document.querySelectorAll(".poker-card-face");
    for (let card of cardFaces) {
      card.classList.contains("front")
        ? card.classList.remove("face-active")
        : card.classList.add("face-active");
    }
    document.querySelector(".ready-btn").style.display = "block";
    resetTimer();
    resetAllUsed();
  } else if (mode === "thinkMode") {
    /*
    - hide solution container
    - poker cards show front side
    - card in non-shrink mode
    - Ready button hide
    - answer button is clickable
    - think-timer started
    */
    document.querySelector(".ready-btn").style.display = "none";
    const cardFaces = document.querySelectorAll(".poker-card-face");
    for (let card of cardFaces) {
      card.classList.contains("back")
        ? card.classList.remove("face-active")
        : card.classList.add("face-active");
    }
    document.querySelector(".solution-container").style.display = "none";
    startTimer();
  }
}
function answerBtnClickingHandler() {
  if (currentMode === "thinkMode") modeSwitching("answerMode");
}
function readyBtnClickingHandler() {
  if (currentMode === "regularMode") {
    modeSwitching("thinkMode");
    dispatchCards();
  }
}

function nextEquationElement(curr) {
  console.log(curr);
  if (curr === "operand-1-1") {
    document.querySelector(".operator-1").classList.add("equ-selected");
  } else if (curr === "operator-1") {
    document.querySelector(".operand-1-2").classList.add("equ-selected");
  } else if (curr === "operand-1-2") {
    document.querySelector(".operand-2-1").classList.add("equ-selected");
  } else if (curr === "operand-2-1") {
    document.querySelector(".operator-2").classList.add("equ-selected");
  } else if (curr === "operator-2") {
    document.querySelector(".operand-2-2").classList.add("equ-selected");
  } else if (curr === "operand-2-2") {
    document.querySelector(".operand-3-1").classList.add("equ-selected");
  } else if (curr === "operand-3-1") {
    document.querySelector(".operator-3").classList.add("equ-selected");
  } else if (curr === "operator-3") {
    document.querySelector(".operand-3-2").classList.add("equ-selected");
  } else {
    return;
  }
  document.querySelector(`.${curr}`).classList.remove("equ-selected");
}

function generateEvent(event) {
  return new Event(event);
}

let equations = [[], [], []];
function cardClickingHandler(card) {
  let count = 0;
  if (currentMode !== "answerMode") return;
  const selectedCard = document.querySelector(`.${card}`);
  const currentSelectedCard = document.querySelector(".selected");
  if (selectedCard.classList.contains("used")) return;
  if (currentSelectedCard && currentSelectedCard === selectedCard) return;
  const focusedEquationElement = document.querySelector(".equ-selected");
  const cardNumber = selectedCard.querySelector(".card-number").textContent;
  for (let cl of focusedEquationElement.classList) {
    const operandList = [
      "operand-1-1",
      "operand-1-2",
      "operand-2-1",
      "operand-2-2",
      "operand-3-1",
      "operand-3-2",
    ];
    if (operandList.includes(cl)) {
      focusedEquationElement.value = cardNumber;
      focusedEquationElement.dispatchEvent(generateEvent("change"));
      if (currentSelectedCard) currentSelectedCard.classList.remove("selected");
      selectedCard.classList.add("selected");
      selectedCard.classList.add("used");
      return;
    }
  }
}

function resultChecking(result) {
  result !== 24 ? alert("WRONG SOLUTIONS!") : alert("Congratulations!");
  updateStats(result === 24);
  resetEquations();
  if (result === 24) modeSwitching("regularMode");
}

function resultClickingHandler(res) {
  if (currentMode !== "answerMode") return;

  const selectedResult = document.querySelector(`.${res}`);
  const selectedValue = +selectedResult.value;
  if (selectedResult.classList.contains("used") || !selectedValue) return;
  selectedResult.classList.add("used");
  const focusedEquationElement = document.querySelector(".equ-selected");
  focusedEquationElement.value = selectedValue;
  focusedEquationElement.dispatchEvent(generateEvent("change"));
}

let operators = [];
function operatorClickingHandler(op) {
  if (currentMode !== "answerMode") return;
  const ops = {
    addition: "➕",
    subtraction: "➖",
    multiplication: "✖️",
    division: "➗",
  };
  const focusedEquationElement = document.querySelector(".equ-selected");
  ["operator-1", "operator-2", "operator-3"].forEach((cl) => {
    if (focusedEquationElement.classList.contains(cl)) {
      focusedEquationElement.value = ops[op];
      focusedEquationElement.dispatchEvent(generateEvent("change"));
    }
  });
}

function onEquationElementChange(el) {
  console.log("onEquationElementChange: ", el);
  const element = document.querySelector(`.${el}`);
  const cardValue = element.value;
  const operatorList = ["operator-1", "operator-2", "operator-3"];
  if (cardValue !== "\u00A0") {
    if (el === "operand-1-1") {
      equations[0].push(+cardValue);
      nextEquationElement(el);
    } else if (operatorList.includes(el)) {
      operators.push(cardValue);
      nextEquationElement(el);
    } else if (el === "operand-1-2") {
      equations[0].push(+cardValue);
      if (operators[0] === "➕")
        equations[0].push(equations[0][0] + equations[0][1]);
      if (operators[0] === "➖")
        equations[0].push(equations[0][0] - equations[0][1]);
      if (operators[0] === "✖️")
        equations[0].push(equations[0][0] * equations[0][1]);
      if (operators[0] === "➗")
        equations[0].push(equations[0][0] / equations[0][1]);
      console.log(equations);
      document.querySelector(".result-1").value = equations[0][2];
      nextEquationElement(el);
    } else if (el === "result-1") {
      nextEquationElement(el);
    } else if (el === "operand-2-1") {
      nextEquationElement("operand-2-1");
      equations[1].push(+cardValue);
    } else if (el === "operand-2-2") {
      nextEquationElement("operand-2-2");
      equations[1].push(+cardValue);
      if (operators[1] === "➕")
        equations[1].push(equations[1][0] + equations[1][1]);
      if (operators[1] === "➖")
        equations[1].push(equations[1][0] - equations[1][1]);
      if (operators[1] === "✖️")
        equations[1].push(equations[1][0] * equations[1][1]);
      if (operators[1] === "➗")
        equations[1].push(equations[1][0] / equations[1][1]);
      document.querySelector(".result-2").value = equations[1][2];
    } else if (el === "operand-3-1") {
      nextEquationElement("operand-3-1");
      equations[2].push(+cardValue);
    } else if (el === "operand-3-2") {
      equations[2].push(+cardValue);
      if (operators[2] === "➕")
        equations[2].push(equations[2][0] + equations[2][1]);
      if (operators[2] === "➖")
        equations[2].push(equations[2][0] - equations[2][1]);
      if (operators[2] === "✖️")
        equations[2].push(equations[2][0] * equations[2][1]);
      if (operators[2] === "➗")
        equations[2].push(equations[2][0] / equations[2][1]);
      document.querySelector(".result-3").value = equations[2][2];
      document
        .querySelector(".result-3")
        .dispatchEvent(generateEvent("change"));
    } else if (el === "result-3") {
      setTimeout(() => {
        resultChecking(equations[2][2]);
      }, 500);
    }
  }
  return;
}

function resetAllUsed() {
  const usedElements = document.querySelectorAll(".used");
  for (let el of usedElements) {
    el.classList.remove("used");
  }
}
function resetEquations() {
  if (currentMode !== "answerMode") return;
  const toBeReset = document.getElementsByClassName("resetable");
  for (let el of toBeReset) el.value = "";
  document.querySelector(".equ-selected").classList.remove("equ-selected");
  document.querySelector(".operand-1-1").classList.add("equ-selected");
  equations = [[], [], []];
  operators = [];
  resetAllUsed();
}

const cards = [];
const shapes = ["&#9824;", "&#9827;", "&#9829;", "&#9830;"];
const shapesObj = {
  "&#9824;": "spade",
  "&#9827;": "club",
  "&#9829;": "heart",
  "&#9830;": "diamond",
};
function shuffleCards() {
  for (let shape of shapes) {
    for (let i = 1; i < 14; ++i) cards.push([shape, i.toString()]);
  }
}
function dispatchCards() {
  if (!cards.length) shuffleCards();
  const result = [];
  while (result.length < 4) {
    const randomIndex = Math.floor(Math.random() * cards.length);
    result.push(cards[randomIndex]);
    cards.splice(randomIndex, 1);
  }
  const dispatchedCardNumber = document.querySelectorAll(".card-number");
  const dispatchedCardStyle = document.querySelectorAll(".card-style");
  const numbers = [];
  for (let i = 0; i < 4; ++i) {
    dispatchedCardNumber[i].textContent = result[i][1];
    numbers.push(result[i][1]);
    dispatchedCardStyle[i].innerHTML = result[i][0];
    ["club", "spade", "diamond", "heart"].forEach((shape) => {
      if (dispatchedCardStyle[i].classList.contains(shape))
        dispatchedCardStyle[i].classList.remove(shape);
    });
    dispatchedCardStyle[i].classList.add(shapesObj[result[i][0]]);
  }
  if (!solve24(numbers)) dispatchCards();
}

function switchSolutionAppearance(state) {
  state !== "hide"
    ? document.querySelectorAll(".solution").forEach((el) => {
        el.style.display = "block";
      })
    : document.querySelectorAll(".solution").forEach((el) => {
        el.style.display = "none";
      });
}
const animationBox = document.querySelector(".solution-container");
animationBox.addEventListener("animationend", () => {
  switchSolutionAppearance("show");
});

function switchRobotPrompt() {
  const prompts = {
    regularMode: "Press the 'Ready' button!",
    thinkMode: "Press the red button if you know a solution!",
    answerMode: "Press the cards and operator buttons to build your solution!",
  };
  document.querySelector(".robot-prompt").textContent = prompts[currentMode];
}

let games = 0,
  wins = 0,
  streak = 0,
  currStreak = 0;
function updateStats(winning) {
  ++games;
  if (winning) {
    ++wins;
    ++currStreak;
    streak = Math.max(currStreak, streak);
  } else {
    currStreak = 0;
  }
  // console.log(wins, currStreak, streak, games);
  document.querySelector(".stats-board").innerHTML = `
    <span>Wins/Games: ${wins}/${games}</span>
    <span>Longest Winning Streak: ${streak}</span>
  `;
}
