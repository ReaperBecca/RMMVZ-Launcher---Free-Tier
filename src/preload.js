const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getProjectInfo: () => ipcRenderer.invoke('get-project-info'),
  launchGame: () => ipcRenderer.invoke('launch-game')
});