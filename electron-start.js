const electron = require('electron');
const { autoUpdater } = require('electron-updater');

let nodeObs;
if (process.platform === 'win32') {
  nodeObs = require('@streamlabs/obs-studio-node').NodeObs;
}

const app = electron.app;
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let captureWindow;
let trackerWindow;

let obsInput;
let obsOutput;
let obsDisplayInfo = {
  name: 'Overwatch Display',
  show: false,
  capturing: false,
  width: 175,
  height: 98,
  x: 0,
  y: 0,
};

app.disableHardwareAcceleration();

function setupOBSCapture() {
  if (process.platform !== 'win32') {
    return;
  }
  nodeObs.SetWorkingDirectory(
    path.join(
      app.getAppPath().replace('app.asar', 'app.asar.unpacked'),
      'node_modules/@streamlabs/obs-studio-node',
    ),
  );
  nodeObs.OBS_API_initAPI(path.join(app.getPath('userData'), 'obs-client'));
  let obsSettings = nodeObs.OBS_settings_getSettings('Video');
  for (const group of obsSettings) {
    for (const obsSetting of group.parameters) {
      if (obsSetting.name === 'Base') {
        obsSetting.currentValue = '1920x1080';
      }
      if (obsSetting.name === 'Output') {
        obsSetting.currentValue = '1920x1080';
      }
      if (obsSetting.name === 'FPSType') {
        obsSetting.currentValue = 'Fractional FPS Value';
      }
    }
  }
  nodeObs.OBS_settings_saveSettings('Video', obsSettings);
  obsSettings = nodeObs.OBS_settings_getSettings('Video');
  for (const group of obsSettings) {
    for (const obsSetting of group.parameters) {
      if (obsSetting.name === 'FPSNum') {
        obsSetting.currentValue = 1;
      }
      if (obsSetting.name === 'FPSDen') {
        obsSetting.currentValue = 2;
      }
    }
  }
  nodeObs.OBS_settings_saveSettings('Video', obsSettings);

  obsSettings = nodeObs.OBS_settings_getSettings('Advanced');
  for (const group of obsSettings) {
    for (const obsSetting of group.parameters) {
      if (obsSetting.name === 'ColorFormat') {
        obsSetting.currentValue = 'RGB';
      }
    }
  }
  nodeObs.OBS_settings_saveSettings('Advanced', obsSettings);
  nodeObs.OBS_service_resetVideoContext();

  const settings = {
    capture_mode: 'window',
    window: 'Overwatch:TankWindowClass:Overwatch.exe',
    priority: 2,
    limit_framerate: true,
    force_scaling: true,
    scale_res: '1920x1080',
  };
  obsInput = nodeObs.Input.create('game_capture', 'Overwatch Capture', settings);
  nodeObs.Global.setOutputSource(0, obsInput);
  obsOutput = nodeObs.Output.create(
    'frame_output',
    'Frame Output',
    {
      save_path: path.join(app.getPath('userData'), 'Captures'),
      quality: 90,
    },
  );
}

function destroyOBSCapture() {
  if (process.platform !== 'win32') {
    return;
  }
  obsOutput.release();
  nodeObs.Global.setOutputSource(0, null);
  obsInput.release();
  nodeObs.OBS_API_destroyOBS_API();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 475,
    height: 875,
    minWidth: 475,
    minHeight: 710,
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#F5F5F5',
  });

  // and load the index.html of the app.
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/build/index.html'),
    protocol: 'file:',
    slashes: true,
  });
  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    if (trackerWindow) {
      trackerWindow.webContents.send('close');
    }
    if (captureWindow) {
      captureWindow.webContents.send('close');
    }
    destroyOBSCapture();
  });

  if (process.platform === 'darwin') {
    require('./osx-menu');
  }

  setupOBSCapture();
}

function createTrackerWindow() {
  const trackerWindowURL = url.format({
    pathname: path.join(__dirname, '/src/overwatchTrackerBW.html'),
    protocol: 'file:',
    slashes: true,
  });
  trackerWindow = new BrowserWindow({ show: false });
  trackerWindow.loadURL(trackerWindowURL);
  // trackerWindow.webContents.openDevTools();
  trackerWindow.on('closed', () => {
    trackerWindow = null;
    if (captureWindow) {
      captureWindow.webContents.send('close');
    }
  });
}

function createCaptureWindow() {
  const captureWindowURL = url.format({
    pathname: path.join(__dirname, '/src/takeCaptureBW.html'),
    protocol: 'file:',
    slashes: true,
  });
  captureWindow = new BrowserWindow({ show: false });
  captureWindow.loadURL(captureWindowURL);
  // captureWindow.webContents.openDevTools();
  captureWindow.on('closed', () => {
    captureWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  createCaptureWindow();
  createTrackerWindow();
  autoUpdater.checkForUpdates();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
  if (captureWindow === null) {
    createCaptureWindow();
  }
  if (trackerWindow === null) {
    createTrackerWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
autoUpdater.on('update-downloaded', (event, info) => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  mainWindow.webContents.send('update-downloaded', info);
});

autoUpdater.on('update-not-available', (event, info) => {
  mainWindow.webContents.send('update-not-available', info);
});

ipcMain.on('install-update', (event, arg) => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('set-launch-on-startup', (event, launchOnStartup) => {
  app.setLoginItemSettings({
    openAtLogin: launchOnStartup,
  });
});

ipcMain.on('sign-in', (event, userId) => {
  if (trackerWindow) {
    trackerWindow.webContents.send('sign-in', userId);
  }
});

ipcMain.on('sign-out', (event, userId) => {
  if (trackerWindow) {
    trackerWindow.webContents.send('sign-out', userId);
  }
});

ipcMain.on('upload-capture-folder', (event, folder, userId) => {
  const backgroundWindowURL = url.format({
    pathname: path.join(__dirname, '/src/uploadCaptureFolderBW.html'),
    protocol: 'file:',
    slashes: true,
  });
  const win = new BrowserWindow({ show: false });
  win.loadURL(backgroundWindowURL);
  // win.webContents.openDevTools();
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('upload', folder, userId);
  });
});

ipcMain.on('queue-capture-folder-upload', (event, folder, userId) => {
  if (mainWindow) {
    mainWindow.webContents.send('queue-capture-folder-upload', folder, userId);
  }
});

ipcMain.on('capture-folder-upload-finished', (event, folder, userId) => {
  if (mainWindow) {
    mainWindow.webContents.send('capture-folder-upload-finished', folder, userId);
  }
});

ipcMain.on('capture-folder-uploading', (event, folder, userId, progress) => {
  if (mainWindow) {
    mainWindow.webContents.send('capture-folder-uploading', folder, userId, progress);
  }
});

ipcMain.on('capture-folder-upload-error', (event, folder, userId, uploadErr) => {
  if (mainWindow) {
    mainWindow.webContents.send('capture-folder-upload-error', folder, userId, uploadErr);
  }
});

ipcMain.on('start-capture', (event, userId) => {
  if (captureWindow) {
    captureWindow.webContents.send('start-capture', userId);
    if (mainWindow) {
      mainWindow.webContents.send('start-capture', userId);
    }
  }
});

ipcMain.on('stop-capture', () => {
  if (captureWindow) {
    captureWindow.webContents.send('stop-capture');
    if (mainWindow) {
      mainWindow.webContents.send('stop-capture');
    }
  }
});

ipcMain.on('start-obs-capture', (event, folder) => {
  obsDisplayInfo.capturing = true;
  obsOutput.update({ save_path: folder });
  obsOutput.start();
});

ipcMain.on('stop-obs-capture', (event, folder, userId) => {
  obsDisplayInfo.capturing = false;
  obsOutput.stop();
  if (mainWindow) {
    mainWindow.webContents.send('queue-capture-folder-upload', folder, userId);
  }
});

ipcMain.on('update-obs-capture-folder', (event, prevFolder, nextFolder, userId) => {
  obsOutput.update({ save_path: nextFolder });
  if (mainWindow) {
    mainWindow.webContents.send('queue-capture-folder-upload', prevFolder, userId);
  }
});

ipcMain.on('create-obs-display', () => {
  if (!obsDisplayInfo.capturing || !obsDisplayInfo.show) {
    return;
  }
  nodeObs.OBS_content_createDisplay(
    mainWindow.getNativeWindowHandle(),
    obsDisplayInfo.name,
  );
  nodeObs.OBS_content_resizeDisplay(obsDisplayInfo.name, obsDisplayInfo.width, obsDisplayInfo.height);
  nodeObs.OBS_content_moveDisplay(obsDisplayInfo.name, obsDisplayInfo.x, obsDisplayInfo.y);
});

ipcMain.on('remove-obs-display', () => (
  nodeObs.OBS_content_destroyDisplay(obsDisplayInfo.name)
));

ipcMain.on('update-obs-display', (event, show, width, height, x, y) => {
  obsDisplayInfo = Object.assign(obsDisplayInfo, { show, width, height, x, y });
  nodeObs.OBS_content_resizeDisplay(obsDisplayInfo.name, obsDisplayInfo.width, obsDisplayInfo.height);
  nodeObs.OBS_content_moveDisplay(obsDisplayInfo.name, obsDisplayInfo.x, obsDisplayInfo.y);
});
