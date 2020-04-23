import logger from "./logger.js";
import codeBox from "./codeMirror.js";
import eventEmitter from "./eventEmitter.js";

var template = document.getElementById("savedprogram-template");
var programlistnode = document.getElementById("savedprograms");
var variablesInput = document.getElementById("variables");

document
  .getElementById("saveNewProgramBtn")
  .addEventListener("click", () => saveNewProgram());

const ls = {
  get() {
    return JSON.parse(localStorage.getItem("savedprograms")) || {};
  },

  getByName(name) {
    return this.get()[name];
  },

  set(val) {
    localStorage.setItem("savedprograms", JSON.stringify(val));
  },

  setOne(val) {
    let items = this.get();
    this.set({ ...items, [val.name]: { ...val } });
  },
};

var event = new eventEmitter();

var programStorage = {
  displayPrograms() {
    programlistnode.innerHTML = "";

    let items = ls.get() || {};
    let keys = Object.keys(items);
    keys.forEach((x) => {
      var item = items[x];
      var node = template.cloneNode(true);

      node.id = "prog" + item.name.replace(" ", "_");
      node.hidden = false;
      node.querySelector(".name").value = item.name;
      node
        .querySelector(".load")
        .addEventListener("click", () => loadProgram(item.name));
      node
        .querySelector(".save")
        .addEventListener("click", () => resaveProgram(item.name));
      node
        .querySelector(".delete")
        .addEventListener("click", () => deleteProgram(item.name));
      programlistnode.appendChild(node);
    });
  },
  listener: event,
};

function saveNewProgram() {
  let item = {
    code: codeBox.doc.getValue(),
    vars: variablesInput.value,
    name: prompt("Podaj nazwę dla tego programu", undefined),
  };
  if (!item.name) {
    logger.Error("lub anulowano idk ¯\\_(ツ)_/¯", `Nie podano nazwy pliku`);
    return;
  }

  if (ls.getByName(item.name)) {
    logger.Error(
      `Bo istnieje już program z nazwą ${item.name}`,
      "Zapisano nowego programu"
    );
    return;
  }

  ls.setOne(item);
  programStorage.displayPrograms();

  logger.Info(`Zapisano program '${item.name}'`);
}

function resaveProgram(name) {
  if (!confirm(`Czy na pewno chcesz nadpisać program ${name}?`)) return;

  let item = ls.getByName(name);
  item.code = codeBox.doc.getValue();
  item.vars = variablesInput.value;
  ls.setOne(item);

  logger.Info(`Zapisano program '${name}'`);
}

function loadProgram(name) {
  let item = ls.getByName(name);
  codeBox.doc.setValue(item.code);
  variablesInput.value = item.vars;

  logger.Info(`Wczytano program '${name}'`);
  event.emit("codeChanged");
}

function deleteProgram(name) {
  if (!confirm("Czy na pewno usunąć ten program?")) return;

  let items = ls.get();
  items[name] = undefined;
  ls.set(items);
  programStorage.displayPrograms();

  logger.Info(`Usunięto program '${name}'`);
}

export default programStorage;
