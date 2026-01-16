const { ipcMain } = require("electron");
const { dialog } = require("electron/main");
const fs = require("node:fs");
const { mdToPdf } = require("md-to-pdf");
const { configFile } = require("./configFile");

//Contient les fonctions pour la gestion des fichiers
//Ecoute les messages du frontend
function fileModule() {
  ipcMain.on("file:open", (event, arg) => {
    event.returnValue = fs.readFileSync(arg, "utf8");
  });

  //Sauve le fichier
  ipcMain.on("file:save", async (event, arg) => {
    event.returnValue = fs.writeFileSync(configFile.getOpenedFile(), arg);
  });

  //Sauve le fichier avec un nom
  ipcMain.on("file:save-as", async (event, arg) => {
    const result = await dialog.showOpenDialog({
      properties: ["promptToCreate"],
    });
    //Mettre à jour le chemin du fichier
    configFile.setOpenedFile(result.filePaths[0]);

    event.returnValue = fs.writeFileSync(result.filePaths[0], arg);
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
