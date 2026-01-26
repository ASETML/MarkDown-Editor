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
        showFileSavedNotification(file);
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
      //Le nom du fichier exporté
      const result = await dialog.showSaveDialog({
        properties: ["promptToCreate", "showOverwriteConfirmation"],
      });

      //Option pour md-pdf
      const options = {
        template: fs.readFileSync("pdf-template.html", "utf8"),
        printBackground: true,
      };

      //Remplacer les raccourcis pour les valeurs spéciales du header/footer
      arg.headerFooter = replaceSpecialHeaderFooterValue(arg.headerFooter);

      //Doit être présent au début du document pour la mise en forme de md-pdf
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

      //Ajouter le frontmatter au début du document
      const md = frontMatter + "\n" + arg.md;

      //Convertir en pdf et sauver le fichier
      const pdf = await mdToPdf({ content: md }, options);
      fs.writeFileSync(result.filePath, pdf.content);

      //Changer le titre du pdf
      const existingpdf = fs.readFileSync(result.filePath);
      const pdfDoc = await PDFDocument.load(existingpdf, {
        updateMetadata: false,
      });

      //Si il n'y a pas de titre, le titre du pdf est le nom du fichier sans le chemin
      if (!arg.title) {
        arg.title = result.filePath.replace(/^.*[\\/]/, "");
      }

      pdfDoc.setTitle(arg.title);

      //Sauvegarder le pdf après avoir modifié le titre
      const pdfBytes = await pdfDoc.save();
      event.returnValue = fs.writeFileSync(result.filePath, pdfBytes);

      //Ouvrir le pdf dans le navigateur
      shell.openPath(result.filePath);
    } catch {
      event.returnValue = null;
    }
  });
}

//Sauvegarder un fichier sous un nom différent
const saveAs = async (text) => {
  try {
    const dialogResult = await dialog.showSaveDialog({
      properties: ["promptToCreate", "showOverwriteConfirmation"],
    });

    //Mettre à jour le chemin du fichier
    configFile.setOpenedFile(dialogResult.filePath);

    const result = fs.writeFileSync(dialogResult.filePath, text);
    showFileSavedNotification(dialogResult.filePath);
    return result;
  } catch {
    return;
  }
};

//Affiche une notification "Fichier sauvegardé"
const showFileSavedNotification = (fileName) => {
  new Notification({
    title: "File Saved",
    body: `The file ${fileName} was saved`,
  }).show();
};

//Remplace les raccourcis des valeurs spéciales (date, numéro de page, etc) par un élément avec la bonne classe
const replaceSpecialHeaderFooterValue = (headerFooter) => {
  //Les valeurs à remplacer
  const specialValues = [
    { "{{date}}": '<span class="date"></span>' },
    { "{{pageNumber}}": '<span class="pageNumber"></span>' },
    { "{{totalPages}}": '<span class="totalPages"></span>' },
  ];

  //On copie le tableau: opérateur spread pour enlever la réference
  const oldHeaderFooter = [...headerFooter];

  //Pour chaque case du tableau
  for (const item of headerFooter) {
    //Une case peux avoir plusieurs raccourcis à remplacer
    for (const part of item.split(" ")) {
      //Pour tous les raccourcis
      for (const specialValue of specialValues) {
        //Si la case contient un raccourci
        if (specialValue[part]) {
          //Trouver l'index actuel
          const i = oldHeaderFooter.indexOf(item);

          //Remplacer le raccourci
          headerFooter[i] = headerFooter[i].replace(part, specialValue[part]);
        }
      }
    }
  }

  return headerFooter;
};

module.exports = { fileModule };
