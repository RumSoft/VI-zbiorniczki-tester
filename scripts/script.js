import programStorage from "./storage.js";
import logger from "./logger.js";

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

//#endregion

//#region input functions
const colors = {
  input: {
    on: "yellowgreen",
    off: "red"
  },
  output: {
    on: "yellowgreen",
    off: "black"
  }
};

const io = {
  setInput(i, val) {
    if (input[i] === val) return;
    input[i] = val;
    inp[i].style.backgroundColor = val ? colors.input.on : colors.input.off;
  },
  setOutput(i, val) {
    if (output[i] === val) return;
    output[i] = val;
    outp[i].style.backgroundColor = val ? colors.output.on : colors.output.off;
  },
  toggleInput(i) {
    if (!isRunning) return;
    this.setInput(i, !input[i]);
  },
  reset() {
    input.forEach((x, i) => io.setInput(i, false));
    output.forEach((x, i) => io.setOutput(i, false));
  }
};

//#endregion

//init
var forceStop = true;
var stan = 1;
var loopDelay = 100;
var isRunning = false;

function loop() {
  if (forceStop) return;
  stantextbox.innerText = stan;

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
      logger.Error(ex, "błąd wykonywnia programu");
      stopProgram();
      return;
    }

    io.setOutput(0, L1);
    io.setOutput(1, L2);
    io.setOutput(2, L3);
    io.setOutput(3, L4);
    io.setOutput(4, L5);
    io.setOutput(5, L6);
    io.setOutput(6, L7);

    loop();
  }, loopDelay);
}

inp.forEach((x, i) => x.addEventListener("click", () => io.toggleInput(i)));
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
  io.reset();
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

  loopDelay = Math.max(1, Math.min(deltatime.value || 100, 1000));
  logger.Info(`starting program with ${loopDelay}ms loop delay`);

  stan = 1;
  io.reset();

  if (variables.value)
    try {
      let kurwa = variables.value.split(" ").join("");
      let variablesInitCommand = `var ${kurwa};`.replace(";;", ";");
      logger.Info(`setting variables: '${variablesInitCommand}'`);
      window.eval(variablesInitCommand);
    } catch (ex) {
      logger.Error(ex, "błąd w deklaracji zmiennych");
    }
  else {
    logger.Info("no variables set");
  }

  loop();
}

function onKeyPress(ev) {
  if (!isRunning) return;
  if (document.activeElement === variables || document.activeElement === code)
    return;

  if (ev.key >= "1" && ev.key <= "7") {
    io.toggleInput(ev.key - 1);
  }
}

programStorage.displayPrograms();
