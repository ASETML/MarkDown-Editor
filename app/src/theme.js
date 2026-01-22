const { app } = require("electron");
const fs = require("fs");
const path = require("node:path");
const YAML = require("yaml");

const getThemes = () => {
  //Récupérer les fichiers
  const themesPath = path.join(app.getPath("userData"), "/themes");

  const files = fs.readdirSync(themesPath, "utf-8");

  //Parser les .yml trouvés
  let themeArray = [];
  for (const f of files) {
    const p = path.join(themesPath, f);
    themeArray.push({
      path: p,
      parsedYaml: YAML.parse(fs.readFileSync(p, "utf-8")),
    });

    console.log(themeArray[themeArray.length - 1]);
  }

  //Retourner le tableau
  return themeArray;
};

module.exports = { getThemes };
