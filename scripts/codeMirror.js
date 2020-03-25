import logger from "./logger.js";

var code = document.getElementById("code");

var codeBox = CodeMirror.fromTextArea(code, {
  value: code.value,
  mode: "javascript",
  theme: "idea",
  indentUnit: 2,
  tabSize: 2,
  lineNumbers: true,
  pollInterval: 1000,
  placeholder: "Główny kod programu..."
});

codeBox.on("changes", xd => {
  codeBox.save();
});

export default {
  ...codeBox,
  format: () => {
    codeBox.execCommand("selectAll");
    codeBox.execCommand("indentAuto");
    logger.Info("Automatycznie ustawiono wcięcia");
  }
};
