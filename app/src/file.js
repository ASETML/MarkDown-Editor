const { ipcMain } = require('electron')
const fs = require("node:fs")

//Contient les fonctions pour la gestion des fichiers
//Ecoute les messages du frontend
function fileModule() {
    ipcMain.on("file:open", (event, arg) => {
        event.returnValue = fs.readFileSync(arg, 'utf8');
    })

    //[file.md, montexte]
    ipcMain.on("file:save", (event, arg) => {
        event.returnValue = fs.writeFileSync(arg[0], arg[1]);
    })
}

module.exports = { fileModule }