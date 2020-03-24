import logger from "./logger.js";

var template = document.getElementById("savedprogram-template");
var programlistnode = document.getElementById("savedprograms");
var saveNewProgramBtn = document.getElementById("saveNewProgramBtn");
saveNewProgramBtn.addEventListener("click", () => {
  saveNewProgram();
});

var variablesInput = document.getElementById("variables");
var codeTextarea = document.getElementById("code");
var newProgramNameInput = document.getElementById("newProgramNameInput");

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
  }
};

var programStorage = {
  displayPrograms() {
    programlistnode.innerHTML = "";

    let items = ls.get() || {};
    let keys = Object.keys(items);
    keys.forEach(x => {
      var item = items[x];
      var node = template.cloneNode(true);

      node.id = "prog" + item.name.replace("", "_");
      node.hidden = false;
      node.querySelector(".title").value = item.name;
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
  }
};

function saveNewProgram() {
  let item = {
    code: codeTextarea.value,
    vars: variablesInput.value,
    name: newProgramNameInput.value
  };
  if (!item.name) {
    alert("ustaw nazwę!@%!@$!");
    return;
  }

  ls.setOne(item);
  programStorage.displayPrograms();

  logger.Info(`zapisano program '${item.name}'`);
}

function resaveProgram(name) {
  let item = ls.getByName(name);
  item.code = codeTextarea.value;
  item.vars = variablesInput.value;
  ls.setOne(item);

  logger.Info(`zapisano program '${name}'`);
}

function loadProgram(name) {
  let item = ls.getByName(name);
  codeTextarea.value = item.code;
  variablesInput.value = item.vars;

  logger.Info(`załadowano program '${name}'`);
}

function deleteProgram(name) {
  if (!confirm("Czy na pewno usunąć ten program?")) return;

  let items = ls.get();
  items[name] = undefined;
  ls.set(items);
  programStorage.displayPrograms();

  logger.Info(`usunięto program '${name}'`);
}

export default programStorage;
