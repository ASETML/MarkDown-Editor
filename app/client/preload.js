const { contextBridge, ipcRenderer  } = require('electron');

//Communication backend frontend
contextBridge.exposeInMainWorld('markdown', {
    parse: (text) => ipcRenderer.sendSync("markdown:parse", text),
});
