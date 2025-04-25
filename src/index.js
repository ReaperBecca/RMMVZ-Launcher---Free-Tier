const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Global variables
let mainWindow = null;
let gameWindow = null;

// Find the game folder using a simple relative path approach
function findGameFolder() {
  // Just look in the current directory for folders with www/index.html
  const rootDir = path.join(__dirname, '..');
  console.log('Looking for games in:', rootDir);

  try {

    // List all directories in the root directory
    const entries = fs.readdirSync(rootDir, { withFileTypes: true });
    
    for (const entry of entries) {

      if (entry.isDirectory() && entry.name !== 'src' && entry.name !== 'node_modules') {
        const folderPath = path.join(rootDir, entry.name);
        const wwwPath = path.join(folderPath, 'www');
        
        console.log('Checking folder:', folderPath);
        
        // Check if this folder contains a www folder with index.html
        if (fs.existsSync(wwwPath) && 
            fs.statSync(wwwPath).isDirectory() && 
            fs.existsSync(path.join(wwwPath, 'index.html'))) {
          
          console.log('Found game folder:', entry.name);
          return {
            gameName: entry.name,
            wwwPath: wwwPath
          };
        }
      }
    }
    
    console.log('No game folder found with www/index.html');
  } catch (error) {

    console.error('Error searching for game folder:', error);
  }
  
  return null;
}

// Determine RPG Maker version
function determineRPGMakerVersion(wwwPath) {
  try {
    if (fs.existsSync(path.join(wwwPath, 'js', 'rmmz_core.js'))) {
      return 'MZ';
    } else if (fs.existsSync(path.join(wwwPath, 'js', 'rpg_core.js'))) {
      return 'MV';
    }
  } catch (error) {
    console.error('Error determining RPG Maker version:', error);
  }
  
  return 'Unknown';
}

// Create the launcher window
function createLauncherWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  
  // Uncomment for development tools
  // mainWindow.webContents.openDevTools();
  
  return mainWindow;
}

// Create the game window
function createGameWindow(wwwPath) {
  // Close existing game window if it exists
  if (gameWindow && !gameWindow.isDestroyed()) {
    gameWindow.close();
  }
  
  gameWindow = new BrowserWindow({
    width: 816,  // Standard RPG Maker resolution
    height: 624,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    title: 'RPG Maker Game'
  });
  
  // Load the game's index.html file

  const indexPath = path.join(wwwPath, 'index.html');
  console.log('Loading game from:', indexPath);
  gameWindow.loadFile(indexPath);
  
  // Remove the menu bar for a cleaner look
  gameWindow.setMenuBarVisibility(false);
  
  // Handle window close
  gameWindow.on('closed', () => {
    gameWindow = null;
  });
  
  return gameWindow;
}

// App initialization
app.whenReady().then(() => {

  // First, try to find and launch the game automatically
  const gameInfo = findGameFolder();
  
  if (gameInfo) {
    // Game found, launch it directly
    createGameWindow(gameInfo.wwwPath);
  } else {
    // No game found, show the launcher
    createLauncherWindow();
  }

  app.on('activate', function () {

    if (BrowserWindow.getAllWindows().length === 0) {
      if (gameInfo) {
        createGameWindow(gameInfo.wwwPath);
      } else {
        createLauncherWindow();
      }
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers
ipcMain.handle('get-project-info', () => {

  const gameInfo = findGameFolder();
  
  if (!gameInfo) {
    return { 
      found: false, 
      error: 'No RPG Maker game found in the expected location' 
    };
  }
  
  const gameType = determineRPGMakerVersion(gameInfo.wwwPath);
  
  return {
    found: true,
    name: gameInfo.gameName,
    path: gameInfo.gamePath,
    wwwPath: gameInfo.wwwPath,
    type: gameType
  };
});

ipcMain.handle('launch-game', async () => {

  const gameInfo = findGameFolder();
  
  if (!gameInfo) {
    return { success: false, error: 'No RPG Maker game found' };
  }
  
  try {
    createGameWindow(gameInfo.wwwPath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});