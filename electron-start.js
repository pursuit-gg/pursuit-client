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
let trackCapturesWindow;

let obsInput;
let obsScene;
let obsSceneItem;
let obsOutput;
let obsDisplayInfo = {
  name: 'Overwatch Display',
  show: false,
  capturing: false,
  width: 174,
  height: 99,
  x: 0,
  y: 0,
  scaleRes: '1920x1080',
  changingRes: false,
};
let resTrackingInterval;
const userInfo = {
  userId: null,
  externalOBSCapture: null,
};

app.disableHardwareAcceleration();

function updateOBSSettings(setting, changes) {
  const obsSettings = nodeObs.OBS_settings_getSettings(setting);
  for (const group of obsSettings) {
    for (const obsSetting of group.parameters) {
      if (changes[obsSetting.name] !== undefined) {
        obsSetting.currentValue = changes[obsSetting.name];
      }
    }
  }
  nodeObs.OBS_settings_saveSettings(setting, obsSettings);
}

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
  nodeObs.OBS_API_initAPI('en-US', path.join(app.getPath('userData'), 'obs-client'));
  updateOBSSettings('Video', {
    Base: '1920x1080',
    Output: '1920x1080',
    FPSType: 'Fractional FPS Value',
  });
  updateOBSSettings('Video', {
    FPSNum: 1,
    FPSDen: 2,
  });
  updateOBSSettings('Advanced', {
    ColorFormat: 'RGB',
  });
  nodeObs.OBS_service_resetVideoContext();

  obsScene = nodeObs.Scene.create('Overwatch Capture Scene');
  const settings = {
    capture_mode: 'window',
    window: 'Overwatch:TankWindowClass:Overwatch.exe',
    priority: 2,
    limit_framerate: true,
    force_scaling: false,
    scale_res: '0x0',
  };
  obsInput = nodeObs.Input.create('game_capture', 'Overwatch Capture', settings);
  obsSceneItem = obsScene.add(obsInput);
  nodeObs.Global.setOutputSource(0, obsScene.source);
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
  if (resTrackingInterval) {
    clearInterval(resTrackingInterval);
    resTrackingInterval = undefined;
  }
  obsOutput.release();
  nodeObs.Global.setOutputSource(0, null);
  obsSceneItem.remove();
  obsInput.release();
  obsScene.source.release();
  nodeObs.OBS_API_destroyOBS_API();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 475,
    height: 875,
    minWidth: 475,
    minHeight: 725,
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
    if (trackCapturesWindow) {
      trackCapturesWindow.webContents.send('close');
    }
    if (userInfo.externalOBSCapture !== null && !userInfo.externalOBSCapture) {
      if (trackerWindow) {
        trackerWindow.webContents.send('close');
      }
      if (captureWindow) {
        captureWindow.webContents.send('close');
      }
      destroyOBSCapture();
    }
  });

  if (process.platform === 'darwin') {
    require('./osx-menu');
  }
}

function createTrackCapturesWindow() {
  const trackCapturesWindowURL = url.format({
    pathname: path.join(__dirname, '/src/trackCapturesBW.html'),
    protocol: 'file:',
    slashes: true,
  });
  trackCapturesWindow = new BrowserWindow({ show: false });
  trackCapturesWindow.loadURL(trackCapturesWindowURL);
  // trackCapturesWindow.webContents.openDevTools();
  trackCapturesWindow.on('closed', () => {
    trackCapturesWindow = null;
  });
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
  autoUpdater.checkForUpdates();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
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

ipcMain.on('set-external-obs-capture', (event, externalOBSCapture) => {
  if (userInfo.externalOBSCapture === null) {
    if (!externalOBSCapture) {
      setupOBSCapture();
      createCaptureWindow();
      createTrackerWindow();
    }
    userInfo.externalOBSCapture = externalOBSCapture;
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

ipcMain.on('queue-capture-folder-upload', (event, folder) => {
  if (mainWindow && userInfo.userId) {
    mainWindow.webContents.send('queue-capture-folder-upload', folder, userInfo.userId);
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

ipcMain.on('sign-in', (event, userId) => {
  userInfo.userId = userId;
  if (trackCapturesWindow) {
    trackCapturesWindow.webContents.send('sign-in');
  } else {
    createTrackCapturesWindow();
  }
});

ipcMain.on('sign-out', (event, userId) => {
  userInfo.userId = null;

  if (trackCapturesWindow) {
    trackCapturesWindow.webContents.send('sign-out');
  }

  if (userInfo.externalOBSCapture !== null && !userInfo.externalOBSCapture) {
    // perform stop-capture event logic
    if (resTrackingInterval) {
      clearInterval(resTrackingInterval);
      resTrackingInterval = undefined;
    }
    if (captureWindow) {
      captureWindow.webContents.send('stop-capture');
      if (mainWindow) {
        mainWindow.webContents.send('stop-capture');
      }
    }
  }
});

ipcMain.on('start-capture', () => {
  if (userInfo.userId === null) {
    return;
  }
  if (!resTrackingInterval) {
    resTrackingInterval = setInterval(() => {
      const width = obsInput.width;
      const height = obsInput.height;
      if (width !== 0 && height !== 0) {
        let xScale = 1;
        let yScale = 1;
        if (width / height > 2.38) { // 43:18
          obsDisplayInfo.scaleRes = '2580x1080';
          xScale = 2580 / width;
          yScale = 1080 / height;
        } else if (width / height > 2.1) { // 64:27
          obsDisplayInfo.scaleRes = '2560x1080';
          xScale = 2560 / width;
          yScale = 1080 / height;
        } else if (width / height > 1.7) { // 16:9
          obsDisplayInfo.scaleRes = '1920x1080';
          xScale = 1920 / width;
          yScale = 1080 / height;
        } else if (width / height > 1.5) { // 16:10
          obsDisplayInfo.scaleRes = '1920x1200';
          xScale = 1920 / width;
          yScale = 1200 / height;
        } else if (width / height > 1.2) { // 4:3
          obsDisplayInfo.scaleRes = '1920x1440';
          xScale = 1920 / width;
          yScale = 1440 / height;
        }
        const newScale = { x: xScale, y: yScale };
        if (obsSceneItem.scale !== newScale) {
          obsSceneItem.scale = newScale;
        }
        if (`${obsScene.source.width}x${obsScene.source.height}` !== obsDisplayInfo.scaleRes && !obsDisplayInfo.changingRes) {
          obsDisplayInfo.changingRes = true;
          obsOutput.stop();
          updateOBSSettings('Video', {
            Base: obsDisplayInfo.scaleRes,
            Output: obsDisplayInfo.scaleRes,
          });
          if (resTrackingInterval) {
            if (mainWindow) {
              mainWindow.webContents.send('start-capture', obsDisplayInfo.scaleRes);
            }
            obsOutput.start();
          }
          obsDisplayInfo.changingRes = false;
        }
      }
    }, 500);
  }
  if (captureWindow) {
    captureWindow.webContents.send('start-capture');
    if (mainWindow) {
      mainWindow.webContents.send('start-capture', obsDisplayInfo.scaleRes);
    }
  }
});

ipcMain.on('stop-capture', () => {
  if (resTrackingInterval) {
    clearInterval(resTrackingInterval);
    resTrackingInterval = undefined;
  }
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

ipcMain.on('stop-obs-capture', () => {
  obsDisplayInfo.capturing = false;
  obsOutput.stop();
});

ipcMain.on('update-obs-capture-folder', (event, folder) => {
  obsOutput.update({ save_path: folder });
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
