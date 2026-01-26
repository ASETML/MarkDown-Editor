const { ipcMain, Notification, shell } = require("electron");
const { dialog } = require("electron/main");
const fs = require("node:fs");
const { mdToPdf } = require("md-to-pdf");
const { configFile } = require("./configFile");
const { PDFDocument } = require("pdf-lib");

//Contient les fonctions pour la gestion des fichiers
//Ecoute les messages du frontend
function fileModule() {
  ipcMain.on("file:open", (event, arg) => {
    event.returnValue = fs.readFileSync(arg, "utf8");
  });

  //Sauve le fichier
  ipcMain.on("file:save", async (event, arg) => {
    try {
      const file = configFile.getOpenedFile();
      if (file) {
        const result = fs.writeFileSync(file, arg);
        event.returnValue = result;
        showNotification(file);
      } else {
        event.returnValue = await saveAs(arg);
      }
    } catch {
      event.returnValue = null;
    }
  });

  //Sauve le fichier avec un nom
  ipcMain.on("file:save-as", async (event, arg) => {
    event.returnValue = await saveAs(arg);
  });

  //Export le fichier
  ipcMain.on("file:export", async (event, arg) => {
    try {
      const result = await dialog.showSaveDialog({
        properties: ["promptToCreate", "showOverwriteConfirmation"],
      });

      const options = {
        template: fs.readFileSync("pdf-template.html", "utf8"),
        printBackground: true,
      };

      arg.headerFooter = replaceSpecialHeaderFooterValue(arg.headerFooter);

      const frontMatter = `---
css: |-
    ${arg.customBody}
pdf_options:
  format: ${arg.paperFormat}
  margin: ${arg.margins[0]} ${arg.margins[1]} ${arg.margins[2]} ${arg.margins[3]}
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

      const md = frontMatter + "\n" + arg.md;

      const pdf = await mdToPdf({ content: md }, options);
      fs.writeFileSync(result.filePath, pdf.content);

      //Changer le titre du pdf
      const existingpdf = fs.readFileSync(result.filePath);
      const pdfDoc = await PDFDocument.load(existingpdf, {
        updateMetadata: false,
      });

      if (!arg.title) {
        arg.title = result.filePath.replace(/^.*[\\/]/, "");
      }

      pdfDoc.setTitle(arg.title);

      const pdfBytes = await pdfDoc.save();
      event.returnValue = fs.writeFileSync(result.filePath, pdfBytes);

      shell.openPath(result.filePath);
    } catch {
      event.returnValue = null;
    }
  });
}

const saveAs = async (text) => {
  try {
    const dialogResult = await dialog.showSaveDialog({
      properties: ["promptToCreate", "showOverwriteConfirmation"],
    });

    //Mettre à jour le chemin du fichier
    configFile.setOpenedFile(dialogResult.filePath);

    const result = fs.writeFileSync(dialogResult.filePath, text);
    showNotification(dialogResult.filePath);
    return result;
  } catch {
    return;
  }
};

const showNotification = (fileName) => {
  new Notification({
    title: "File Saved",
    body: `The file ${fileName} à été sauvegardé`,
  }).show();
};

const replaceSpecialHeaderFooterValue = (headerFooter) => {
  const specialValues = [
    { "{{date}}": '<span class="date"></span>' },
    { "{{pageNumber}}": '<span class="pageNumber"></span>' },
    { "{{totalPages}}": '<span class="totalPages"></span>' },
  ];

  const oldHeaderFooter = [...headerFooter]

  for (const item of headerFooter) {
    for (const part of item.split(" ")) {
      for (const specialValue of specialValues) {
        if (specialValue[part]) {
          const i = oldHeaderFooter.indexOf(item);
          headerFooter[i] = headerFooter[i].replace(part, specialValue[part]);
        }
      }
    }
  }
  return headerFooter;
};

module.exports = { fileModule };
