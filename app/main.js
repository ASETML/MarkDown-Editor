const { app, BrowserWindow, screen } = require("electron");
const { Menu, dialog } = require("electron/main");
const { markdownModule } = require("./src/markdown.js");
const { fileModule } = require("./src/file.js");
const fs = require("fs");
const path = require("node:path");
const { configFile } = require("./src/configFile.js");

let win = null;
const template = [
  {
    role: "fileMenu",
    submenu: [
      {
        label: "Open file",
        accelerator: "Control+O",
        click: async () => {
          const result = await dialog.showOpenDialog({
            properties: ["openFile"],
            filters: [
              {
                name: "Markdown files",
                extensions: ["md"],
              },
              { name: "All Files", extensions: ["*"] },
            ],
          });
          if (result.canceled || result.filePaths.length === 0) return;
          const text = fs.readFileSync(result.filePaths[0], "utf8");

          //Stocker le chemin du fichier dans le fichier de config
          configFile.setOpenedFile(result.filePaths[0]);

          // Send the file content to the renderer process
          win.webContents.send("file-opened", text);
        },
      },
      { type: "separator" },
      {
        label: "Save",
        accelerator: "Control+S",
        click: async () => {
          win.webContents.send("file-saved");
        },
      },
      {
        label: "Save As",
        accelerator: "Control+Shift+S",
        click: async () => {
          win.webContents.send("file-saved-as");
        },
      },
      { type: "separator" },
      {
        label: "Export",
        accelerator: "Control+E",
        click: async () => {
          win.webContents.send("file-exported");
        },
      },
      { type: "separator" },
      {
        label: "Exit",
        role: "quit",
      },
    ],
  },
  { role: "editMenu" },
  { role: "viewMenu" },
  { role: "windowMenu" },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://github.com/ASETML/MarkDown-Editor");
        },
      },
    ],
  },
];

//Création de la fenêtre
const createWindow = async () => {
  win = new BrowserWindow({
    icon: "client/images/MarkDownEditor-logo.png",
    show: false,
    width: screen.getPrimaryDisplay().workAreaSize.width,
    height: screen.getPrimaryDisplay().workAreaSize.height,
    webPreferences: {
      preload: path.join(__dirname, "client/preload.js"),
    },
  });

  win.loadFile("client/index.html");
  win.maximize();

  win.once("ready-to-show", () => {
    configFile.createIfNotExist();
    const file = configFile.getOpenedFile();
    //Ouvrir le dernier fichier par défaut
    if (file && fs.existsSync(file)) {
      //Stocker le chemin du fichier dans le fichier de config
      configFile.setOpenedFile(file);

      const text = fs.readFileSync(file, "utf8");

      // Send the file content to the renderer process
      win.webContents.send("file-opened", text);
    } else {
      configFile.setOpenedFile("");
    }
    win.show(); // Show window only after it's ready
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

//Démarrer l'app
app.whenReady().then(() => {
  createWindow();
});

//Quitte l'app si toute les fenêtres sont fermées
app.on("window-all-closed", () => {
  app.quit();
});

//Ecoute les messages pour le md
markdownModule();

//Ecoute les messages pour les fichiers
fileModule();
