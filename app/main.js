const { app, BrowserWindow, ipcMain, screen  } = require('electron')
const path = require('node:path')
const { Menu } = require('electron/main')
const { markdownModule } = require("./src/markdown.js")
const { fileModule } = require("./src/file.js")

//Menu
const template = [
  { role: 'fileMenu' },
  { role: 'editMenu' },
  { role: 'viewMenu' },
  { role: 'windowMenu' },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell, ipcRenderer } = require('electron')
          const fs = require("node:fs")
          const { dialog } = require('electron')
          //await shell.openExternal('https://github.com/ASETML/MarkDown-Editor')
          //await console.log(ipcRenderer.sendSync("file:open", "../../README.md"))
          console.log(fs.readFileSync((await dialog.showOpenDialog({ properties: ['openFile'] })).filePaths[0], 'utf8'))
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

//Création de la fenêtre
const createWindow = () => {
  const win = new BrowserWindow({
    show: false,
    width: screen.getPrimaryDisplay().workAreaSize.width,
    height: screen.getPrimaryDisplay().workAreaSize.height,
    webPreferences: {
      preload: path.join(__dirname, 'client/preload.js'),
    }
  })

  win.loadFile('client/index.html')
  win.maximize();
  win.show();
}

//Démarrer l'app
app.whenReady().then(() => {
  createWindow()
})

//Quitte l'app si toute les fenêtres sont fermées
app.on('window-all-closed', () => {
    app.quit()
})

//Ecoute les messages pour le md
markdownModule();

//Ecoute les messages pour les fichiers
fileModule();