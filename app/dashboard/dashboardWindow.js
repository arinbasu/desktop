const { MemoryBackend, Dashboard } = window.stencila
const stubBackend = new MemoryBackend()
const remote = require('electron').remote
const ipc = require('electron').ipcRenderer
const currentWindow = remote.getCurrentWindow()
const { Menu } = remote
const windowId = currentWindow.id

const DashboardMenuBuilder = require('./DashboardMenuBuilder')
const dashboardMenuBuilder = new DashboardMenuBuilder()

let appState = {}

function _updateMenu() {
  let menu = dashboardMenuBuilder.build(appState)
  console.log('setting dashboard menu', menu)
  Menu.setApplicationMenu(menu)
}

currentWindow.on('focus', () => {
  console.log('dashboard focused')

  // Set up the menu for the dashboard
  _updateMenu(appState)

  ipc.send('windowFocused', {
    windowId: windowId,
    data: 'dashboard'
  })
})

// Initially set the menu when the window is first opened
_updateMenu(appState)

window.addEventListener('load', () => {
  Dashboard.mount({
    backend: stubBackend,
    resolveEditorURL: function(type, archiveURL) {
      let editorURL
      if (type === 'document') {
        editorURL = "document.html"
      } else {
        editorURL = "sheet.html"
      }
      editorURL += '?archiveURL='+encodeURIComponent(archiveURL)
      return editorURL
    }
  }, window.document.body)
})
