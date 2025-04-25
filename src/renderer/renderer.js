// DOM Elements
const projectInfo = document.getElementById('projectInfo');
const launchBtn = document.getElementById('launchBtn');
const notification = document.getElementById('notification');

// Load project info when the app starts
loadProjectInfo();

// Event Listeners
launchBtn.addEventListener('click', launchGame);

// Functions
async function loadProjectInfo() {
  const info = await window.api.getProjectInfo();
  renderProjectInfo(info);
}

function renderProjectInfo(info) {
  if (!info.found) {
    projectInfo.innerHTML = `
      <div class="error">
        ${info.error || 'No RPG Maker game detected'}
      </div>
    `;
    launchBtn.disabled = true;
    return;
  }

  projectInfo.innerHTML = `
    <div class="project-name">${info.name}</div>
    <div class="project-path">WWW Folder: ${info.wwwPath}</div>
    <div>
      <span class="project-type">RPG Maker ${info.type}</span>
    </div>
  `;
  
  launchBtn.disabled = false;
}

async function launchGame() {
  const result = await window.api.launchGame();
  
  if (result.success) {
    showNotification('Game launched!', 'success');
  } else {
    showNotification(result.error || 'Failed to launch game', 'error');
  }
}

function showNotification(message, type = 'info') {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  
  // Remove the hidden class to show the notification
  setTimeout(() => {
    notification.classList.remove('hidden');
  }, 10);
  
  // Hide the notification after 3 seconds
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}

// Find www folder in the expected structure
function findWwwFolder() {
  // The app is in the "RMMVZ Launcher - Free Tier" folder
  const rootPath = app.getAppPath();
  
  console.log('App root path:', rootPath);
  
  try {
    // In the root folder, look for any subfolder that contains a www folder
    const entries = fs.readdirSync(rootPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const gameFolderPath = path.join(rootPath, entry.name);
        console.log('Checking potential game folder:', gameFolderPath);
        
        // Check if this directory has a www folder
        const wwwPath = path.join(gameFolderPath, 'www');
        if (fs.existsSync(wwwPath) && fs.statSync(wwwPath).isDirectory()) {
          // Check if index.html exists
          const indexPath = path.join(wwwPath, 'index.html');
          if (fs.existsSync(indexPath)) {
            console.log('Found game:', entry.name);
            return {
              wwwPath: wwwPath,
              gameName: entry.name
            };
          }
        }
      }
    }
    
    console.log('No game folder with www/index.html found');
  } catch (error) {
    console.error(`Error searching for game:`, error);
  }
  
  return null;
}