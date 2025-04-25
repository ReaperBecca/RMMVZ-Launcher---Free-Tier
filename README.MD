RPG Maker Web Game Launcher - Developer Guide
This guide is intended for RPG Maker MV/MZ developers who want to use this launcher to distribute their web-exported games to end users.

Overview
This launcher allows you to distribute your web-exported RPG Maker games as standalone applications without requiring players to use a web server or browser. The launcher automatically detects and runs your game in an Electron window.

Setting Up Your Game
Export your RPG Maker MV/MZ project for web browsers
Create the following folder structure:
RMMVZ Launcher - Free Tier/
├── src/                  (launcher source code)
├── YourGameName/         (your game folder)
│   └── www/              (web-exported game files)
│       ├── index.html
│       ├── js/
│       ├── data/
│       └── ...
└── ...

Copy


The launcher will automatically detect and run your game when launched
Development Dependencies
Before building installers, install the following dependencies:

# Install Node.js dependencies
npm install

# Install Electron Builder globally
npm install -g electron-builder


## Building Installers
Windows Installer (.exe)
# Build Windows installer
npm run build:win


This creates a Windows installer in the dist folder.

macOS Installer (.dmg)
# Build macOS installer (must be run on macOS)
npm run build:mac


This creates a macOS .dmg file in the dist folder.

Linux Installer (.AppImage, .deb, .rpm)
# Build Linux installers
npm run build:linux


This creates Linux distribution packages in the dist folder.

## Building All Installers at Once
If you have access to all required platforms (or are using a CI service), you can build all installers at once:

npm run build:all


Customizing the Installer
Application Name and Version
Edit the package.json file to change:

name: Your game's name (no spaces, lowercase)
productName: Your game's display name
version: Your game's version
description: Short description of your game
Example:

{
  "name": "my-awesome-rpg",
  "productName": "My Awesome RPG",
  "version": "1.0.0",
  "description": "An epic adventure in a fantasy world"
}


# Application Icon
Replace the icon files in the build folder:

icon.ico - Windows icon
icon.icns - macOS icon
icon.png - Linux icon (at least 512x512px)


# Installer Customization
For advanced customization, edit the electron-builder.yml file. You can customize:

Publisher information
Installer appearance
Start menu location
And more
Distribution

# After building the installers:

Test the installer on a clean system
Distribute the installer file to your users through your preferred channels:
Your game's website
Game distribution platforms
Direct download links
Troubleshooting
Game Not Detected
If the launcher doesn't detect your game:

Ensure your folder structure matches the required format
Check that your game's www folder contains an index.html file
Verify file permissions allow the launcher to read your game files

# Build Errors
If you encounter errors during the build process:

Ensure all dependencies are installed
Check that you have the correct permissions to write to the dist folder
On macOS/Linux, you might need to use sudo for some operations
Platform-Specific Issues
Windows: Ensure you have proper code signing certificates for a trusted installer
macOS: Apple notarization may be required for distribution outside the App Store
Linux: Different distributions may have different requirements
Support
If you need additional help, please refer to:

Electron documentation: https://www.electronjs.org/docs
Electron Builder documentation: https://www.electron.build/
RPG Maker community forums




Note: This launcher is designed to work with RPG Maker MV and MZ games exported for web browsers. It may not work with other game engines or non-web exports.

For all questions and concerns, please Contact Rebecca on Discord (@ReaperBecca)<@152322669214171145>