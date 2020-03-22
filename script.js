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

inp.forEach((x, i) => x.addEventListener("click", () => toggleInput(i)));

const offInputColor = "red";
const onInputColor = "yellowgreen";
const offOutputColor = "black";
const onOutputColor = "yellowgreen";

function toggleInput(i) {
  if (!isRunning) return;
  setInput(i, !input[i]);
}
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

function resetIO() {
  input.forEach((x, i) => setInput(i, false));
  output.forEach((x, i) => setOutput(i, false));
}

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

    eval(code.value);

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

  eval(`var ${variables.value};`);
  loop();
}

function onKeyPress(ev) {
  if (!isRunning) return;
  if (document.activeElement === variables || document.activeElement === code)
    return;

  if (ev.key >= "1" && ev.key <= "7") {
    toggleInput(ev.key - 1);
  }
}
