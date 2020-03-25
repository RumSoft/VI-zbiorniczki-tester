var logger = document.getElementById("logger");
const timeout = 5000;

export default {
  Error(ex, source = "Error") {
    console.log(source, ex);

    let xd = document.createElement("p");
    xd.className = "log log--error";
    xd.innerHTML = `<span class="log__title">${new Date().toLocaleTimeString()} - <strong>${source}</strong>:</span><br />${ex?.message ??
      ex}`;

    logger.prepend(xd);

    setTimeout(() => {
      setTimeout(() => {
        xd.remove();
      }, timeout);
      xd.className += " log--hiding";
    }, timeout);
  },

  Info(str) {
    let xd = document.createElement("p");
    xd.className = "log log--info";
    xd.innerHTML = `<span class="log__title">${new Date().toLocaleTimeString()} - <strong>${str}</strong></span>`;

    logger.prepend(xd);

    setTimeout(() => {
      setTimeout(() => {
        xd.remove();
      }, timeout);
      xd.className += " log--hiding";
    }, timeout);
  }
};
