const { app } = require("electron");
const fs = require("fs");
const path = require("node:path");

const configFilePath = path.join(app.getPath("userData"), "config.json");

const createIfNotExist = () => {
  //Créer le fichier de config si il n'existe pas
  if (!fs.existsSync(configFilePath)) {
    fs.writeFileSync(configFilePath, "{}");
  }
};

const getConfig = () => {
  const configJson = fs.readFileSync(configFilePath, "utf8");
  return JSON.parse(configJson);
};

const setOpenedFile = (filePath) => {
  let config = getConfig();
  config.OpenedFile = filePath;
  fs.writeFileSync(configFilePath, JSON.stringify(config));
};

const getOpenedFile = () => {
  const config = getConfig();
  return config.OpenedFile;
};

const setLastUsedTheme = (themePath) => {
  let config = getConfig();
  config.LastUsedTheme = themePath;
  fs.writeFileSync(configFilePath, JSON.stringify(config));
};
const getLastUsedTheme = () => {
  const config = getConfig();
  return config.LastUsedTheme;
};

module.exports = {
  configFile: {
    createIfNotExist,
    setOpenedFile,
    getOpenedFile,
    setLastUsedTheme,
    getLastUsedTheme,
  },
};
