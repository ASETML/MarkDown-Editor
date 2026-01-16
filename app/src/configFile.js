const { app } = require("electron");
const fs = require("fs");
const path = require("node:path");

const createIfNotExist = () => {
  const configFilePath = path.join(app.getPath("userData"), "config.json");

  //Créer le fichier de config si il n'existe pas
  if (!fs.existsSync(configFilePath)) {
    fs.writeFileSync(configFilePath, "{}");
  }
};

const setOpenedFile = (filePath) => {
  const configFilePath = path.join(app.getPath("userData"), "config.json");
  const configJson = fs.readFileSync(configFilePath, "utf8");
  let config = JSON.parse(configJson);
  config.OpenedFile = filePath;
  fs.writeFileSync(configFilePath, JSON.stringify(config));
};

const getOpenedFile = () => {
  const configFilePath = path.join(app.getPath("userData"), "config.json");
  const configJson = fs.readFileSync(configFilePath, "utf8");
  let config = JSON.parse(configJson);
  return config.OpenedFile;
};

module.exports = {
  configFile: { createIfNotExist, setOpenedFile, getOpenedFile },
};
