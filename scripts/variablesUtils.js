String.prototype.replaceAll = function replaceAll(from, to) {
  return this.split(from).join(to);
};
String.prototype.replaceMany = function replaceAll(from, to) {
  let _to = Array.isArray(to) ? to : [to];
  const n = _to.length;
  let val = this;
  for (let i = 0; i < from.length; i++)
    val = val.replaceAll(from[i], _to[i % n]);
  return val;
};

const replaceArrays = (str) =>
  str.replaceAll("[]", "").replaceAll("{", "[").replaceAll("}", "]");

const types = ["char", "int"];
const replaceTypes = (str) => str.replaceMany(types, "var");
const removeTypes = (str) => str.replaceMany(types, "");
const removeWhitespaces = (str) => str.replaceMany(["\n", "\r\n", " "], "");

const removeComments = (str) =>
  str
    .split("\n")
    .map((x) => x.split("//")[0].split("/*")[0])
    .join("\n");

const deleteValues = (str) =>
  str
    .replace(/(\[.*\])/g, "")
    .split(/[,;]/)
    .map((x) => x.split("=")[0])
    .join(",");

export default {
  prepareVariables: (str) =>
    [str, removeComments, replaceTypes, replaceArrays].reduce((acc, curr) =>
      curr(acc)
    ),
  extractVariables: (str) =>
    [
      str,
      removeComments,
      replaceArrays,
      removeTypes,
      deleteValues,
      removeWhitespaces,
    ]
      .reduce((acc, curr) => curr(acc))
      .split(/[,;]/)
      .filter((x) => x),
};
