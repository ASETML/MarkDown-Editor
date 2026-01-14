const { ipcMain } = require('electron')
const { marked } = require("marked")

//Contient les fonctions qui parsent le markdown
//Ecoute les messages du frontend
function markdownModule() {
    ipcMain.on("markdown:parse", (event, arg) => {
        event.returnValue = marked(arg)
    })
}

module.exports = { markdownModule }