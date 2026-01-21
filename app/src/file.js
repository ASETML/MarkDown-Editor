const { ipcMain, Notification, shell } = require("electron");
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
    const file = configFile.getOpenedFile();
    if (file) {
      const result = fs.writeFileSync(file, arg);
      event.returnValue = result;
      showNotification(file);
    } else {
      event.returnValue = await saveAs(arg);
    }
  });

  //Sauve le fichier avec un nom
  ipcMain.on("file:save-as", async (event, arg) => {
    event.returnValue = await saveAs(arg);
  });

  //Export le fichier
  ipcMain.on("file:export", async (event, arg) => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ["promptToCreate"],
      });

      const options = {
        template: fs.readFileSync("pdf-template.html", "utf8"),
        printBackground: true,
      };

      const frontMatter = `---
pdf_options:
  format: A4
  margin: 30mm 20mm 30mm 20mm
  printBackground: true
  displayHeaderFooter: true
  headerTemplate: |-
    <style>
      ${arg.customStyle}
    </style>
    <div class="header" style="font-size: 11px; text-align: center; width: 100%; display: flex; flex-direction: row; justify-content: space-around;">
      <p>${arg.headerFooter[0]}</p>
      <p>${arg.headerFooter[1]}</p>
      <p>${arg.headerFooter[2]}</p>
    </div>
  footerTemplate: |-
    <div class="footer" style="font-size: 11px; text-align: center; width: 100%; display: flex; flex-direction: row; justify-content: space-around;">
      <p>${arg.headerFooter[3]}</p>
      <p>${arg.headerFooter[4]}</p>
      <p>${arg.headerFooter[5]}</p>
    </div>
---
`;

      console.log(arg);

      const md = frontMatter + "\n" + arg.md;

      const pdf = await mdToPdf({ content: md }, options);
      event.returnValue = fs.writeFileSync(result.filePaths[0], pdf.content);

      shell.openPath(result.filePaths[0]);
    } catch {
      event.returnValue = null;
    }
  });
}

const saveAs = async (text) => {
  const dialogResult = await dialog.showOpenDialog({
    properties: ["promptToCreate"],
  });
  //Mettre à jour le chemin du fichier
  configFile.setOpenedFile(dialogResult.filePaths[0]);

  const result = fs.writeFileSync(dialogResult.filePaths[0], text);
  showNotification(dialogResult.filePaths[0]);
  return result;
};

const showNotification = (fileName) => {
  new Notification({
    title: "File Saved",
    body: `The file ${fileName} à été sauvegardé`,
  }).show();
};

module.exports = { fileModule };
