//#region variables
var inp = new Array(7)
  .fill("input")
  .map((x, i) => `${x}${i + 1}`)
  .map(x => document.getElementById(x));

var outp = new Array(7)
  .fill("output")
  .map((x, i) => `${x}${i + 1}`)
  .map(x => document.getElementById(x));

var input = inp.map(x => null);
var output = outp.map(x => null);

var startBtn = document.getElementById("start");
var stopBtn = document.getElementById("stop");
var variables = document.getElementById("variables");
var code = document.getElementById("code");
var deltatime = document.getElementById("deltatime");
var stantextbox = document.getElementById("stantextbox");
var logger = document.getElementById("logger");

//#endregion

//#region input functions
const offInputColor = "red";
const onInputColor = "yellowgreen";
const offOutputColor = "black";
const onOutputColor = "yellowgreen";

function setInput(i, val) {
  if (input[i] === val) return;
  input[i] = val;
  inp[i].style.backgroundColor = val ? onInputColor : offInputColor;
}

function setOutput(i, val) {
  if (output[i] === val) return;
  output[i] = val;
  outp[i].style.backgroundColor = val ? onOutputColor : offOutputColor;
}

function toggleInput(i) {
  if (!isRunning) return;
  setInput(i, !input[i]);
}

function resetIO() {
  input.forEach((x, i) => setInput(i, false));
  output.forEach((x, i) => setOutput(i, false));
}
//#endregion

//init
var forceStop = true;
var stan = 1;
var loopDelay = 100;
var isRunning = false;

function loop() {
  if (forceStop) return;
  stantextbox.innerHTML = `stan: ${stan}`;

  setTimeout(() => {
    var aK1 = input[0];
    var aK2 = input[1];
    var aK3 = input[2];
    var aK4 = input[3];
    var aK5 = input[4];
    var aK6 = input[5];
    var aK7 = input[6];
    var L1 = output[0];
    var L2 = output[1];
    var L3 = output[2];
    var L4 = output[3];
    var L5 = output[4];
    var L6 = output[5];
    var L7 = output[6];

    try {
      eval(code.value);
    } catch (ex) {
      showError(ex, "błąd wykonywnia programu");
      stopProgram();
      return;
    }

    setOutput(0, L1);
    setOutput(1, L2);
    setOutput(2, L3);
    setOutput(3, L4);
    setOutput(4, L5);
    setOutput(5, L6);
    setOutput(6, L7);

    loop();
  }, loopDelay);
}

inp.forEach((x, i) => x.addEventListener("click", () => toggleInput(i)));
startBtn.addEventListener("click", () => startProgram());
stopBtn.addEventListener("click", () => stopProgram());
document.addEventListener("keypress", onKeyPress);

function stopProgram() {
  startBtn.disabled = false;
  stopBtn.disabled = true;
  code.disabled = false;
  variables.disabled = false;
  stopBtn.blur();
  forceStop = true;
  deltatime.disabled = false;
  isRunning = false;

  stan = 1;
  resetIO();
}

function startProgram() {
  startBtn.disabled = true;
  stopBtn.disabled = false;
  startBtn.blur();
  forceStop = false;
  isRunning = true;
  code.disabled = true;
  variables.disabled = true;
  deltatime.disabled = true;

  loopDelay = Math.max(1, Math.min(deltatime.value || 10, 500));
  console.log(`starting program with ${loopDelay}ms loop delay`);

  stan = 1;
  resetIO();

  if (variables.value)
    try {
      let kurwa = variables.value.split(" ").join("");
      let variablesInitCommand = `var ${kurwa};`.replace(";;", ";");
      console.log(`setting variables: '${variablesInitCommand}'`);
      window.eval(variablesInitCommand);
    } catch (ex) {
      showError(ex, "błąd w deklaracji zmiennych");
    }
  else {
    console.log("no variables set");
  }

  loop();
}

function showError(ex, source = "error") {
  console.log(source, ex);

  let xd = document.createElement("p");
  xd.innerHTML = innerHTML = `${new Date().toLocaleTimeString()} - <b>${source}</b>:<br />${
    ex.message
  }<hr/>`;
  setTimeout(() => xd.remove(), 10000);
  // if (logger.firstChild) logger.firstChild.insertBefore(xd);
  logger.appendChild(xd);
}

function onKeyPress(ev) {
  if (!isRunning) return;
  if (document.activeElement === variables || document.activeElement === code)
    return;

  if (ev.key >= "1" && ev.key <= "7") {
    toggleInput(ev.key - 1);
  }
}
