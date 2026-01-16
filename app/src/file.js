const { ipcMain, app } = require("electron");
const { dialog } = require("electron/main");
const fs = require("node:fs");
const path = require("node:path");
const { mdToPdf } = require("md-to-pdf");

//Contient les fonctions pour la gestion des fichiers
//Ecoute les messages du frontend
function fileModule() {
  ipcMain.on("file:open", (event, arg) => {
    event.returnValue = fs.readFileSync(arg, "utf8");
  });

  //Sauve le fichier
  ipcMain.on("file:save", async (event, arg) => {
    const configFilePath = path.join(app.getPath("userData"), "config.json");
    const configJson = fs.readFileSync(configFilePath, "utf8");
    let config = JSON.parse(configJson);

    event.returnValue = fs.writeFileSync(config.OpenedFile, arg);
  });

  //Export le fichier
  ipcMain.on("file:export", async (event, arg) => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ["promptToCreate"],
      });
      const pdf = await mdToPdf({ content: arg });
      event.returnValue = fs.writeFileSync(result.filePaths[0], pdf.content);
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });
}

module.exports = { fileModule };
