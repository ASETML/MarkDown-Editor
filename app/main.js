const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const {marked} = require("marked")

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('window-all-closed', () => {
    app.quit()
  })

  ipcMain.on("markdown:parse", (event, arg) => {
    console.log(arg)
    event.returnValue = marked(arg)
  })
})