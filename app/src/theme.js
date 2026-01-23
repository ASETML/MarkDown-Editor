const { app, ipcMain } = require("electron");
const fs = require("fs");
const path = require("node:path");
const YAML = require("yaml");
const { configFile } = require("./configFile.js");

const getThemes = () => {
  //Récupérer les fichiers
  const themesPath = path.join(app.getPath("userData"), "/themes");

  const files = fs.readdirSync(themesPath, "utf-8");

  //Parser les .yml trouvés
  let themeArray = [];
  for (const f of files) {
    try {
      const p = path.join(themesPath, f);
      themeArray.push({
        path: p,
        parsedYaml: YAML.parse(fs.readFileSync(p, "utf-8")),
      });
    } catch {
      return;
    }
  }

  //Ne garder que les yaml valident
  themeArray = themeArray.filter(
    (y) =>
      Object.hasOwn(y.parsedYaml, "name") &&
      Object.hasOwn(y.parsedYaml, "style"),
  );

  //Retourner le tableau
  return themeArray;
};

function themeModule() {
  ipcMain.on("themes:request-list", (event) => {
    event.returnValue = getThemes();
  });

  ipcMain.on("themes:set-last", (event, arg) => {
    event.returnValue = configFile.setLastUsedTheme(
      getThemes().find((t) => arg.path == t.path),
    );
  });

  ipcMain.on("themes:request-last-used", (event) => {
    event.returnValue = configFile.getLastUsedTheme();
  });
}

module.exports = { themeModule };
