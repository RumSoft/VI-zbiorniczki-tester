import programStorage from "./storage.js";
import logger from "./logger.js";
import codeBox from "./codeMirror.js";
import variablesUtils from "./variablesUtils.js";

//#region variables
var inp = new Array(8)
  .fill("input")
  .map((x, i) => `${x}${i + 1}`)
  .map((x) => document.getElementById(x));

var outp = new Array(8)
  .fill("output")
  .map((x, i) => `${x}${i + 1}`)
  .map((x) => document.getElementById(x));

var input = inp.map((x) => null);
var output = outp.map((x) => null);

/// com
var comsend = new Array(9)
  .fill("comsend")
  .map((x, i) => `${x}${i + 1}`)
  .map((x) => document.getElementById(x));
window.com_queue = [];
function sendCharacterToCom(c) {
  window.com_queue.push(c);
}
function COM_recv() {
  if (!window.com_queue.length) return 0;
  return window.com_queue.shift();
}
comsend.forEach((x, i) =>
  x.addEventListener("click", () => sendCharacterToCom(i + 1))
);

///
var startBtn = document.getElementById("start");
var stopBtn = document.getElementById("stop");
var variables = document.getElementById("variables");
var deltatime = document.getElementById("deltatime");
var stantextbox = document.getElementById("stantextbox");
var stantextbox1 = document.getElementById("stantextbox1");
var stantextbox2 = document.getElementById("stantextbox2");
var stantextbox3 = document.getElementById("stantextbox3");
var timtextbox = document.getElementById("timtextbox");
var timtextbox1 = document.getElementById("timtextbox1");
var timtextbox2 = document.getElementById("timtextbox2");
var timtextbox3 = document.getElementById("timtextbox3");
var pctextbox = document.getElementById("pctextbox");
var pctextbox1 = document.getElementById("pctextbox1");
var pctextbox2 = document.getElementById("pctextbox2");
var pctextbox3 = document.getElementById("pctextbox3");

var oczkodiv = document.getElementById("oczko");

var formatBtn = document
  .getElementById("formatBtn")
  .addEventListener("click", () => codeBox.format());
//#endregion

var monitoring = document.getElementById("monitoring");
var monitoringData = [];

//#region input functions
const colors = {
  input: {
    on: "yellowgreen",
    off: "red",
  },
  output: {
    on: "yellowgreen",
    off: "black",
  },
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
  },
};

//#endregion

//init
var forceStop = true;
var loopDelay = 100;
var isRunning = false;

function oczkoo() {
  oczko((+new Date() / 100000) % 100);
}

function oczko(v = (+new Date() / 1000) % 1000) {
  oczkodiv.style.opacity = Math.abs(v);
  oczkodiv.style.filter = "";

  if (v > 1) {
    let vv = v * v;

    let effects = {
      "hue-rotate": `${(vv / 100).toFixed(2)}rad`,
      invert: Math.sin(-vv) > 0 ? Math.sin(-vv) : 0,
      saturate: Math.sin(vv / 5 + 1) * 2 + 2,
      brightness: Math.sin(-vv / 10 + 2) / 3 + 1,
      contrast: -Math.cos(vv / 5 + 11) * 5 + 6,
    };

    let eff = Object.keys(effects)
      .map(
        (x) =>
          `${x}(${
            typeof effects[x] === "number" ? effects[x].toFixed(2) : effects[x]
          })`
      )
      .join(" ");
    oczkodiv.style.filter = eff;
  }

  if (v < 0) oczkodiv.style.filter = `invert(${-v})`;
}

function loop() {
  if (forceStop) return;
  if (typeof stan !== "undefined") stantextbox.innerText = stan;
  if (typeof stan1 !== "undefined") stantextbox1.innerText = stan1;
  if (typeof stan2 !== "undefined") stantextbox2.innerText = stan2;
  if (typeof stan3 !== "undefined") stantextbox3.innerText = stan3;
  if (typeof tim !== "undefined")
    timtextbox.innerText = ((tim * loopDelay) / 1000).toFixed(1);
  if (typeof tim1 !== "undefined")
    timtextbox1.innerText = ((tim1 * loopDelay) / 1000).toFixed(1);
  if (typeof tim2 !== "undefined")
    timtextbox2.innerText = ((tim2 * loopDelay) / 1000).toFixed(1);
  if (typeof tim3 !== "undefined")
    timtextbox3.innerText = ((tim3 * loopDelay) / 1000).toFixed(1);
  if (typeof pc !== "undefined") pctextbox.innerText = pc;
  if (typeof pc1 !== "undefined") pctextbox1.innerText = pc1;
  if (typeof pc2 !== "undefined") pctextbox2.innerText = pc2;
  if (typeof pc3 !== "undefined") pctextbox3.innerText = pc3;

  setTimeout(() => {
    var aK1 = input[0];
    var aK2 = input[1];
    var aK3 = input[2];
    var aK4 = input[3];
    var aK5 = input[4];
    var aK6 = input[5];
    var aK7 = input[6];
    var aK8 = input[7];
    var aK9 = input[8];
    var L1 = output[0];
    var L2 = output[1];
    var L3 = output[2];
    var L4 = output[3];
    var L5 = output[4];
    var L6 = output[5];
    var L7 = output[6];
    var L8 = output[7];
    var L9 = output[8];

    try {
      eval(codeBox.doc.getValue());
    } catch (ex) {
      logger.Error(ex, "błąd wykonywania programu");
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
    io.setOutput(7, L8);
    io.setOutput(8, L9);

    monitoringData.forEach((x, i) => {
      x.value = window[x.key];
      if (typeof x.value === "undefined") x.value = "-";
      else if (x.value === 0 || x.value === false)
        x.value = window.przemek ? "0" : "0  ❌";
      else if (x.value === 1 || x.value === true)
        x.value = window.przemek ? "1" : "1  ✔";

      if (/.*\[.*\]/.test(x.key)) {
        let tab = x.key.split("[")[0];
        let index = x.key.split("[")[1].split("]")[0];
        if (
          typeof window[tab] !== "undefined" &&
          typeof window[index] !== "undefined"
        )
          x.value = window[tab][window[index]];
      }
      x.valueTd.innerHTML = x.value;
    });

    loop();
  }, loopDelay);
}

inp.forEach((x, i) => x.addEventListener("click", () => io.toggleInput(i)));
startBtn.addEventListener("click", () => startProgram());
stopBtn.addEventListener("click", () => stopProgram());
document.addEventListener("keypress", onKeyPress);

function random(lo, hi) {
  return Math.floor(Math.random() * (hi - lo + 1) + lo);
}

function rand() {
  return random(0, 10000);
}

function stopProgram() {
  startBtn.disabled = false;
  stopBtn.disabled = true;
  code.disabled = false;
  variables.disabled = false;
  stopBtn.blur();
  forceStop = true;
  deltatime.disabled = false;
  isRunning = false;
  codeBox.display.wrapper.style.pointerEvents = "unset";

  io.reset();
}

var przemek = 0;

function startProgram() {
  console.clear();
  oczko(0);
  startBtn.disabled = true;
  stopBtn.disabled = false;
  startBtn.blur();
  forceStop = false;
  isRunning = true;
  code.disabled = true;
  variables.disabled = true;
  deltatime.disabled = true;
  codeBox.display.wrapper.style.pointerEvents = "none";
  window.com_queue = [];

  loopDelay = Math.max(1, Math.min(deltatime.value || 100, 1000));
  logger.Info(`Uruchamianie programu z cyklem ${loopDelay}ms`);

  io.reset();

  if (variables.value)
    try {
      const variablesInitCommand = variablesUtils.prepareVariables(
        variables.value
      );
      logger.Info(`Ustawianie zmiennych: '${variablesInitCommand}'`);
      window.eval(variablesInitCommand);
    } catch (ex) {
      logger.Error(ex, "Błąd w deklaracji zmiennych");
    }
  else {
    logger.Info("Nie zadeklarowano zmiennych");
  }

  reloadMonitoring();

  loop();
}

function onKeyPress(ev) {
  if (!isRunning) return;
  if (document.activeElement === variables || document.activeElement === code)
    return;

  if (ev.key >= "1" && ev.key <= "8") {
    io.toggleInput(ev.key - 1);
  }
}

//data grid

variables.addEventListener("input", (ev) => reloadMonitoring());
programStorage.listener.on("codeChanged", () => reloadMonitoring());

function reloadMonitoring() {
  let vars = variablesUtils.extractVariables(variables.value);
  monitoringData = [
    ...vars,
    vars.indexOf("pc") >= 0 && vars.indexOf("tab_PW") >= 0 && "tab_PW[pc]",
    vars.indexOf("pc") >= 0 && vars.indexOf("tab_PA") >= 0 && "tab_PA[pc]",
    vars.indexOf("pc") >= 0 && vars.indexOf("tab_PS") >= 0 && "tab_PS[pc]",
    vars.indexOf("pc") >= 0 && vars.indexOf("tab_PS1") >= 0 && "tab_PS1[pc]",
    vars.indexOf("pc") >= 0 && vars.indexOf("tab_PS2") >= 0 && "tab_PS2[pc]",
    vars.indexOf("pc") >= 0 && vars.indexOf("tab_PS3") >= 0 && "tab_PS3[pc]",
  ]
    .filter((x) => x)
    .map((x) => {
      let keyTd = document.createElement("td");
      keyTd.innerHTML = x;
      return {
        keyTd: keyTd,
        valueTd: document.createElement("td"),
        key: x,
        value: "-",
      };
    });

  monitoring.innerHTML = "";

  monitoringData.forEach((x) => {
    let tr = document.createElement("tr");
    tr.appendChild(x.keyTd);
    tr.appendChild(x.valueTd);
    monitoring.appendChild(tr);
  });
}

programStorage.displayPrograms();
reloadMonitoring();

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

autosize(document.getElementById("variables"));
