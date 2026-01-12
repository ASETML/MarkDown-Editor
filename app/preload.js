const { contextBridge, ipcRenderer  } = require('electron');

contextBridge.exposeInMainWorld('markdown', {
    parse: (text) => ipcRenderer.sendSync("markdown:parse", text),
});
