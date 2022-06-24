const bgElement = document.querySelector(".bg");
const propAndActionsContainer = document.querySelector(".property-and-actions");
const propElement = document.querySelector(".property");
const rollAgainBtn = document.querySelector('[data-action="roll-again"]');
const doneBtn = document.querySelector('[data-action="done"]');

const propsDoneKey = "propsDone";
let propsDone = [];
let calcProps = [];
let propIndex = 0;

let isClickTextToRoll = true;
let rolling = false;
const youreDoneMsg = "Thats it you're done 🤩"

function init() {
  const propsDoneStorage = window.localStorage.getItem(propsDoneKey);
  propsDone = propsDoneStorage ? propsDoneStorage.split(",") : [];
  calcProps = properties.filter((p) => !propsDone.includes(p));
  propsDone.forEach((p) => addToBg(p));
  if (!calcProps.length) {
    propElement.innerHTML = youreDoneMsg;
    isClickTextToRoll = false;
  }
}

propElement.addEventListener("click", () => {
  if (isClickTextToRoll) {
    rollProp();
    isClickTextToRoll = false;
  }
});
rollAgainBtn.addEventListener("click", rollProp);
doneBtn.addEventListener("click", doneProperty);

function rollProp() {
  if (rolling) {
    return;
  }
  rolling = true;
  propAndActionsContainer.classList.add("rolling");
  const randomMS = 1500 + Math.random() * 5000;
  const currentTime = new Date().getTime();
  rollingInterval(randomMS, currentTime);
}

function rollingInterval(randomMS, currentTime, speed = 20) {
  propIndex = upticIndex();
  setNewProp();
  const timeDiff = new Date().getTime() - currentTime;
  if (timeDiff > randomMS) {
    rollingDone();
    return;
  }
  if (randomMS - timeDiff < 1500) {
    speed *= 1.3;
  }

  setTimeout(() => rollingInterval(randomMS, currentTime, speed), speed);
}

function upticIndex() {
  const next = propIndex + 1;
  return next >= calcProps.length ? 0 : next;
}

function setNewProp() {
  propElement.innerHTML = calcProps[propIndex];
}

function rollingDone() {
  rolling = false;
  propAndActionsContainer.classList.remove("rolling");
  propAndActionsContainer.classList.add("rolled");
  document.querySelector(
    "a"
  ).href = `https://www.google.com/search?q=css ${calcProps[propIndex]}`;
}

function doneProperty() {
  propAndActionsContainer.classList.remove("rolling");
  propAndActionsContainer.classList.remove("rolled");
  propElement.classList.add("is-done");
  addToBg(calcProps[propIndex]);
  propsDone.push(calcProps[propIndex]);
  calcProps.splice(propIndex, 1);
  propIndex = 0;
  window.localStorage.setItem(propsDoneKey, propsDone);
  setTimeout(() => {
    if (!calcProps.length) {
      propElement.innerHTML = youreDoneMsg;
    } else {
      propElement.innerHTML = "Lets Roll";
      isClickTextToRoll = true;
    }
    propElement.classList.remove("is-done");
  }, 1200);
}

function addToBg(prop) {
  const propSpan = document.createElement("span");
  propSpan.innerHTML = prop + " ";
  bgElement.appendChild(propSpan);
}

init();
