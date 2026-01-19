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
        template: fs.readFileSync('template.html', 'utf8'),
        printBackground: true
      };
/*
      const frontMatter =
`
---
pdf_options:
  format: A3
  margin: 30mm 20mm 30mm 20mm
  printBackground: true
  displayHeaderFooter: true
  headerTemplate: |-
    <style>
      font-size: 11px;
      margin-left: 10px;
      text-align: left;
      width: 100%;
    </style>
    <div class="header">
      <span class="title">Your Title</span>
    </div>
  footerTemplate: |-
    <style>
      font-size: 11px;
      text-align: center;
      width: 100%;
    </style>
    <div class="footer">
      Page <span class="pageNumber"></span> of <span class="totalPages"></span>
    </div>
---
`;


      const md = frontMatter + "\n" + arg

      console.log(md);
*/
      const md = `---
pdf_options:
  format: A4
  margin: 30mm 20mm 30mm 20mm
  printBackground: true
  displayHeaderFooter: true
  headerTemplate: |-
    <div class="header" style="font-size: 11px; text-align: left;">
      Test Header
    </div>
  footerTemplate: |-
    <div class="footer" style="font-size: 11px; text-align: center;">
      Page <span class="pageNumber"></span>
    </div>
---

# Rapport Tests 450

Content goes here.
`;

console.log(md)
      const pdf = await mdToPdf({content: md }, options);
      event.returnValue = fs.writeFileSync(result.filePaths[0], pdf.content);
      shell.openPath(result.filePaths[0])
    } catch (err) {
      console.log(err)
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
