const { contextBridge, ipcRenderer } = require("electron");

//Communication backend frontend
contextBridge.exposeInMainWorld("markdown", {
  parse: (text) => ipcRenderer.sendSync("markdown:parse", text),
});

//Ouverture du fichier: remplacer le texte
window.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("editor");
  ipcRenderer.on("file-opened", (_event, value) => {
    editor.value = value;

    const md = document.getElementById("editor").value;
    const html = ipcRenderer.sendSync("markdown:parse", md);
    document.getElementById("preview").innerHTML = html;
  });
});

//Sauvegarde du fichier: renvoyer le texte
window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.on("file-saved", (_event, _value) => {
    const md = document.getElementById("editor").value;
    ipcRenderer.sendSync("file:save", md);
  });
});

//Sauvegarde du fichier: renvoyer le texte
window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.on("file-saved-as", (_event, _value) => {
    const md = document.getElementById("editor").value;
    ipcRenderer.sendSync("file:save-as", md);
  });
});

//Export du fichier: renvoyer le texte
window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.on("file-exported", (_event, _value) => {
    const html = document.getElementById("preview").innerHTML;
    ipcRenderer.sendSync("file:export", html);
  });
});
