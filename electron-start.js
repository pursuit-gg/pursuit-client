const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const electron = require('electron');
const { autoUpdater } = require('electron-updater');
const url = require('url');
const Sentry = require('@sentry/electron');

let nodeObs;
if (process.platform === 'win32') {
  nodeObs = require('@streamlabs/obs-studio-node').NodeObs;
}

const buildFolder = process.env.NODE_ENV === 'production' ? 'build' : 'public';

const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;
const Notification = electron.Notification;
const nativeImage = electron.nativeImage;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let trackerWindow;
let trackCapturesWindow;
const uploadWindows = {};
let pendingUploadWindows = 0;
let pendingUploadCancels = 0;
let appTray;

let manualUploadNotificationTimeout = null;

let obsInput;
let obsFilter;
let obsDisplayInfo = {
  name: 'Overwatch Display',
  show: false,
  capturing: false,
  width: 174,
  height: 99,
  x: 0,
  y: 0,
  scaleRes: '1920x1080',
};
let overwatchTrackingInterval;
const obsCaptureCounts = {
  stops: 0,
  startsNoCaptures: 0,
  runningNotTracking: 0,
};
const userInfo = {
  userId: null,
  spectator: false,
  newMatchNotifications: 0,
  minimizeToTray: false,
  externalOBSCapture: null,
  notificationsBadge: false,
  manualUploadNotifications: false,
  isQuiting: false,
};

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  onFatalError: () => {
    electron.dialog.showErrorBox(
      'Unexpected Error',
      'Sorry! Something went wrong, but we are looking into it.\n' +
      'Please restart Pursuit.',
    );
    userInfo.isQuiting = true;
    app.quit();
  },
});

app.setAppUserModelId('com.revlo.pursuit');
app.setAsDefaultProtocolClient('pursuit://');
app.disableHardwareAcceleration();
const isSecondInstance = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.show();
  }
});
if (isSecondInstance) {
  app.quit();
}

const updateOBSSettings = (setting, changes) => {
  if (process.platform !== 'win32') {
    return;
  }
  const obsSettings = nodeObs.OBS_settings_getSettings(setting);
  for (const group of obsSettings) {
    for (const obsSetting of group.parameters) {
      if (changes[obsSetting.name] !== undefined) {
        obsSetting.currentValue = changes[obsSetting.name];
      }
    }
  }
  nodeObs.OBS_settings_saveSettings(setting, obsSettings);
};

const createOBSDisplay = () => {
  if (process.platform !== 'win32') {
    return;
  }
  if (!obsDisplayInfo.capturing || !obsDisplayInfo.show) {
    return;
  }
  nodeObs.OBS_content_createSourcePreviewDisplay(
    mainWindow.getNativeWindowHandle(),
    'Overwatch Capture',
    obsDisplayInfo.name,
  );
  nodeObs.OBS_content_resizeDisplay(obsDisplayInfo.name, obsDisplayInfo.width, obsDisplayInfo.height);
  nodeObs.OBS_content_moveDisplay(obsDisplayInfo.name, obsDisplayInfo.x, obsDisplayInfo.y);
};

const removeOBSDisplay = () => {
  if (process.platform !== 'win32') {
    return;
  }
  nodeObs.OBS_content_destroyDisplay(obsDisplayInfo.name);
};

const updateOBSDisplay = (show, width, height, x, y) => {
  if (process.platform !== 'win32') {
    return;
  }
  obsDisplayInfo = Object.assign(obsDisplayInfo, { show, width, height, x, y });
  nodeObs.OBS_content_resizeDisplay(obsDisplayInfo.name, obsDisplayInfo.width, obsDisplayInfo.height);
  nodeObs.OBS_content_moveDisplay(obsDisplayInfo.name, obsDisplayInfo.x, obsDisplayInfo.y);
};

const startCapture = () => {
  if (process.platform !== 'win32') {
    return;
  }
  if (userInfo.userId === null) {
    return;
  }
  if (manualUploadNotificationTimeout) {
    clearTimeout(manualUploadNotificationTimeout);
    manualUploadNotificationTimeout = null;
  }
  if (userInfo.externalOBSCapture !== null && userInfo.externalOBSCapture) {
    obsDisplayInfo.capturing = true;
    return;
  }
  if (mainWindow) {
    mainWindow.webContents.send('start-capture', obsDisplayInfo.scaleRes);
    if (obsCaptureCounts.startsNoCaptures > 60) {
      mainWindow.webContents.send('capture-error', 'no_captures');
    }
  }
  obsDisplayInfo.capturing = true;
  if (!obsFilter) {
    obsFilter = nodeObs.Filter.create(
      'pursuit_frame_capture_filter',
      'Pursuit Frame Capture Filter',
      {},
    );
    obsInput.addFilter(obsFilter);
    createOBSDisplay();
  }
};

const stopCapture = () => {
  if (process.platform !== 'win32') {
    return;
  }
  if (obsDisplayInfo.capturing) {
    manualUploadNotificationTimeout = setTimeout(() => {
      if (mainWindow) {
        mainWindow.webContents.send('pending-uploads-check');
      }
      manualUploadNotificationTimeout = null;
    }, 60000);
  }
  if (userInfo.externalOBSCapture !== null && userInfo.externalOBSCapture) {
    obsDisplayInfo.capturing = false;
    return;
  }
  if (mainWindow) {
    mainWindow.webContents.send('stop-capture');
    if (obsCaptureCounts.runningNotTracking > 1) {
      mainWindow.webContents.send('capture-error', 'not_tracking');
    }
  }
  obsDisplayInfo.capturing = false;
  if (obsFilter) {
    removeOBSDisplay();
    obsInput.removeFilter(obsFilter);
    obsFilter.release();
    obsFilter = undefined;
  }
};

const setupOBSCapture = () => {
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

  const settings = {
    capture_mode: 'window',
    window: 'Overwatch:TankWindowClass:Overwatch.exe',
    priority: 2,
    limit_framerate: true,
    force_scaling: false,
    scale_res: '0x0',
  };
  obsInput = nodeObs.Input.create('game_capture', 'Overwatch Capture', settings);
  nodeObs.Global.setOutputSource(0, obsInput);
  overwatchTrackingInterval = setInterval(() => {
    const width = obsInput.width;
    const height = obsInput.height;
    if (width !== 0 && height !== 0) {
      if (width / height < 16 / 9) {
        const xScale = 1920 / width;
        const yScale = Math.round(height * xScale) / height;
        obsDisplayInfo.scaleRes = `1920x${Math.round(height * yScale)}`;
      } else {
        const yScale = 1080 / height;
        const xScale = Math.round(width * yScale) / width;
        obsDisplayInfo.scaleRes = `${Math.round(width * xScale)}x1080`;
      }
      if (obsCaptureCounts.startsNoCaptures < 300) {
        obsCaptureCounts.startsNoCaptures += 1;
      }
      obsCaptureCounts.stops = 0;
      obsCaptureCounts.runningNotTracking = 0;
      startCapture();
    } else if (obsCaptureCounts.stops >= 5) {
      stopCapture();
    } else {
      obsCaptureCounts.stops += 1;
    }
  }, 1000);
};

const destroyOBSCapture = () => {
  if (process.platform !== 'win32') {
    return;
  }
  if (overwatchTrackingInterval) {
    clearInterval(overwatchTrackingInterval);
    overwatchTrackingInterval = undefined;
  }
  stopCapture();
  nodeObs.Global.setOutputSource(0, null);
  if (obsInput) {
    obsInput.release();
  }
  nodeObs.OBS_API_destroyOBS_API();
};

const setAppTrayContextMenu = () => {
  if (appTray) {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open',
        click: () => {
          if (mainWindow) {
            if (mainWindow.isMinimized()) {
              mainWindow.restore();
            }
            mainWindow.show();
          }
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Client Settings',
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('go-to-page', '/settings');
            if (mainWindow.isMinimized()) {
              mainWindow.restore();
            }
            mainWindow.show();
          }
        },
      },
      {
        label: `Open Match History${userInfo.newMatchNotifications > 0 ? ` (${userInfo.newMatchNotifications})` : ''}`,
        click: () => {
          electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/profile`);
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Quit',
        click: () => {
          userInfo.isQuiting = true;
          if (mainWindow) {
            mainWindow.close();
          } else {
            app.quit();
          }
        },
      },
    ]);
    appTray.setContextMenu(contextMenu);
  }
};

const setAppTrayImage = () => {
  if (appTray) {
    if (userInfo.notificationsBadge && userInfo.newMatchNotifications > 0) {
      const iconPath = process.platform === 'win32' ? `${buildFolder}/iconWithBadge.ico` : `${buildFolder}/iconWithBadge.png`;
      const nativeIcon = nativeImage.createFromPath(path.join(__dirname, iconPath));
      appTray.setImage(nativeIcon.resize({ width: 16, height: 16 }));
    } else {
      const iconPath = process.platform === 'win32' ? `${buildFolder}/icon.ico` : `${buildFolder}/icon.png`;
      const nativeIcon = nativeImage.createFromPath(path.join(__dirname, iconPath));
      appTray.setImage(nativeIcon.resize({ width: 16, height: 16 }));
    }
  }
};

const setMainWindowOverlayIcon = () => {
  if (mainWindow && process.platform === 'win32') {
    if (userInfo.notificationsBadge && userInfo.newMatchNotifications > 0) {
      const iconPath = `${buildFolder}/taskbarBadge.png`;
      const nativeIcon = nativeImage.createFromPath(path.join(__dirname, iconPath));
      mainWindow.setOverlayIcon(nativeIcon, 'New Match Processed');
    } else {
      mainWindow.setOverlayIcon(null, '');
    }
  }
};

const createMainWindow = () => {
  const iconPath = process.platform === 'win32' ? `${buildFolder}/icon.ico` : `${buildFolder}/icon.png`;
  const nativeIcon = nativeImage.createFromPath(path.join(__dirname, iconPath));
  mainWindow = new BrowserWindow({
    width: 475,
    height: 875,
    minWidth: 475,
    minHeight: 825,
    icon: nativeIcon,
    backgroundColor: '#F5F5F5',
    show: !process.argv.includes('--hidden'),
  });

  // and load the index.html of the app.
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, `${buildFolder}/index.html`),
    protocol: 'file:',
    slashes: true,
  });
  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools({ mode: 'undocked' });

  appTray = new Tray(nativeIcon.resize({ width: 16, height: 16 }));
  appTray.setToolTip('Pursuit');
  setAppTrayContextMenu();
  appTray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.show();
    }
  });

  // Emitted when the window is about to close.
  mainWindow.on('close', (event) => {
    if (userInfo.minimizeToTray && !userInfo.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    Object.keys(uploadWindows).forEach((id) => {
      if (uploadWindows[id]) {
        uploadWindows[id].webContents.send('close');
      }
    });
    if (trackCapturesWindow) {
      trackCapturesWindow.webContents.send('close');
    }
    if (trackerWindow) {
      trackerWindow.webContents.send('close');
    }
    if (userInfo.externalOBSCapture !== null && !userInfo.externalOBSCapture) {
      destroyOBSCapture();
    }
  });
};

const createTrackCapturesWindow = () => {
  const trackCapturesWindowURL = url.format({
    pathname: path.join(__dirname, `${buildFolder}/trackCapturesBW.html`),
    protocol: 'file:',
    slashes: true,
  });
  trackCapturesWindow = new BrowserWindow({ show: false });
  trackCapturesWindow.loadURL(trackCapturesWindowURL);
  // trackCapturesWindow.webContents.openDevTools();
  trackCapturesWindow.on('closed', () => {
    trackCapturesWindow = null;
  });
};

const createTrackerWindow = () => {
  const trackerWindowURL = url.format({
    pathname: path.join(__dirname, `${buildFolder}/overwatchTrackerBW.html`),
    protocol: 'file:',
    slashes: true,
  });
  trackerWindow = new BrowserWindow({ show: false });
  trackerWindow.loadURL(trackerWindowURL);
  // trackerWindow.webContents.openDevTools();
  trackerWindow.on('closed', () => {
    trackerWindow = null;
    stopCapture();
  });
};

const createUploaderWindow = (folder, userId, spectator, bandwidth) => {
  const backgroundWindowURL = url.format({
    pathname: path.join(__dirname, `${buildFolder}/uploadCaptureFolderBW.html`),
    protocol: 'file:',
    slashes: true,
  });
  const win = new BrowserWindow({ show: false });
  const winId = win.id;
  uploadWindows[winId] = win;
  win.loadURL(backgroundWindowURL);
  // win.webContents.openDevTools();
  win.webContents.on('did-finish-load', () => {
    pendingUploadWindows -= 1;
    win.webContents.send('upload', folder, userId, spectator, bandwidth);
    if (pendingUploadCancels > 0) {
      win.webContents.send('cancel');
      pendingUploadCancels -= 1;
    }
  });
  win.on('closed', () => {
    uploadWindows[winId] = null;
  });
};

const createClientUpdateNotification = () => {
  const iconPath = process.platform === 'win32' ? `${buildFolder}/icon.ico` : `${buildFolder}/icon.png`;
  const nativeIcon = nativeImage.createFromPath(path.join(__dirname, iconPath));
  const newUpdateNotif = new Notification({
    title: 'New Update!',
    body: 'Open and click the lightbulb to get the shiny, new Pursuit build now!',
    silent: true,
    icon: nativeIcon,
  });
  newUpdateNotif.on('click', () => {
    newUpdateNotif.close();
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.show();
    }
  });
  newUpdateNotif.show();
  setTimeout(() => newUpdateNotif.close(), 5000);
};

const createManualUploadNotification = () => {
  const iconPath = process.platform === 'win32' ? `${buildFolder}/icon.ico` : `${buildFolder}/icon.png`;
  const nativeIcon = nativeImage.createFromPath(path.join(__dirname, iconPath));
  const uploadNotif = new Notification({
    title: 'Good Work!',
    body: 'Practice makes perfect. Don\'t forget to upload your matches to Pursuit!',
    silent: true,
    icon: nativeIcon,
  });
  uploadNotif.on('click', () => {
    uploadNotif.close();
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.show();
    }
  });
  uploadNotif.show();
  setTimeout(() => uploadNotif.close(), 5000);
};

const createBlizzardWarningNotification = () => {
  const iconPath = process.platform === 'win32' ? `${buildFolder}/icon.ico` : `${buildFolder}/icon.png`;
  const nativeIcon = nativeImage.createFromPath(path.join(__dirname, iconPath));
  const newWarningNotif = new Notification({
    title: 'Blizzard has banned 3rd party software.',
    body: 'Open for more details.',
    silent: true,
    icon: nativeIcon,
  });
  newWarningNotif.on('click', () => {
    newWarningNotif.close();
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.show();
    }
  });
  newWarningNotif.show();
  setTimeout(() => newWarningNotif.close(), 5000);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createMainWindow();
  createTrackerWindow();
  if (process.argv.includes('--hidden')) {
    setTimeout(createBlizzardWarningNotification, 10000);
  }
  autoUpdater.checkForUpdates();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  userInfo.isQuiting = true;
  app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
autoUpdater.on('update-downloaded', () => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  mainWindow.webContents.send('update-downloaded');
  createClientUpdateNotification();
});

autoUpdater.on('update-not-available', () => {
  mainWindow.webContents.send('update-not-available');
});

ipcMain.on('install-update', (event, arg) => {
  userInfo.isQuiting = true;
  autoUpdater.quitAndInstall();
});

ipcMain.on('restart', () => {
  app.relaunch();
  userInfo.isQuiting = true;
  if (mainWindow) {
    mainWindow.close();
  } else {
    app.quit();
  }
});

ipcMain.on('set-startup-settings', (event, launchOnStartup, minimizeOnStartup) => {
  app.setLoginItemSettings({
    openAtLogin: launchOnStartup,
    args: minimizeOnStartup ? ['--hidden'] : [],
  });
});

ipcMain.on('set-minimize-to-tray', (event, minimizeToTray) => {
  userInfo.minimizeToTray = minimizeToTray;
});

ipcMain.on('set-external-obs-capture', (event, externalOBSCapture) => {
  if (userInfo.externalOBSCapture === null) {
    if (!externalOBSCapture) {
      setupOBSCapture();
    }
    userInfo.externalOBSCapture = externalOBSCapture;
  }
});

ipcMain.on('set-notifications-badge', (event, notificationsBadge) => {
  userInfo.notificationsBadge = notificationsBadge;
  setMainWindowOverlayIcon();
  setAppTrayImage();
});

ipcMain.on('set-manual-upload-notifications', (event, manualUploadNotifications) => {
  userInfo.manualUploadNotifications = manualUploadNotifications;
});

ipcMain.on('pending-uploads', (event, pendingUploadsCount, currentUpload, manualUpload) => {
  if (userInfo.userId && userInfo.manualUploadNotifications && manualUpload &&
      pendingUploadsCount >= 5 && currentUpload === null) {
    createManualUploadNotification();
  }
});

ipcMain.on('new-match-notifications', (event, newMatchNotifications) => {
  userInfo.newMatchNotifications = newMatchNotifications;
  setMainWindowOverlayIcon();
  setAppTrayImage();
  setAppTrayContextMenu();
});

ipcMain.on('upload-capture-folder', (event, folder, userId, spectator, bandwidth) => {
  pendingUploadWindows += 1;
  createUploaderWindow(folder, userId, spectator, bandwidth);
});

ipcMain.on('cancel-capture-folder-uploads', () => {
  pendingUploadCancels += pendingUploadWindows;
  Object.keys(uploadWindows).forEach((id) => {
    if (uploadWindows[id]) {
      uploadWindows[id].webContents.send('cancel');
    }
  });
});

ipcMain.on('queue-capture-folder-upload', (event, folder) => {
  if (mainWindow && userInfo.userId) {
    mainWindow.webContents.send('queue-capture-folder-upload', folder, userInfo.userId, userInfo.spectator);
  }
  obsCaptureCounts.startsNoCaptures = 0;
});

ipcMain.on('capture-folder-upload-finished', (event, folder, userId, spectator) => {
  if (mainWindow) {
    mainWindow.webContents.send('capture-folder-upload-finished', folder, userId, spectator);
  }
});

ipcMain.on('capture-folder-upload-cancelled', (event, folder, userId, spectator) => {
  if (mainWindow) {
    mainWindow.webContents.send('capture-folder-upload-cancelled', folder, userId, spectator);
  }
});

ipcMain.on('capture-folder-uploading', (event, folder, userId, spectator, progress) => {
  if (mainWindow) {
    mainWindow.webContents.send('capture-folder-uploading', folder, userId, spectator, progress);
  }
});

ipcMain.on('capture-folder-upload-error', (event, folder, userId, spectator, uploadErr) => {
  if (mainWindow) {
    mainWindow.webContents.send('capture-folder-upload-error', folder, userId, spectator, uploadErr);
  }
});

ipcMain.on('set-spectator-mode', (event, spectator) => {
  userInfo.spectator = spectator;
});

ipcMain.on('sign-in', (event, userId) => {
  userInfo.userId = userId;
  Sentry.setUserContext({ id: userId });
  if (trackCapturesWindow) {
    trackCapturesWindow.webContents.send('sign-in');
  } else {
    createTrackCapturesWindow();
  }
});

ipcMain.on('sign-out', (event, userId) => {
  userInfo.userId = null;
  Sentry.setUserContext();
  if (trackCapturesWindow) {
    trackCapturesWindow.webContents.send('sign-out');
  }
  stopCapture();
});

ipcMain.on('overwatch-running', () => {
  if (userInfo.externalOBSCapture !== null && userInfo.externalOBSCapture) {
    startCapture();
    return;
  }
  if (obsCaptureCounts.runningNotTracking < 10) {
    obsCaptureCounts.runningNotTracking += 1;
  }
});

ipcMain.on('overwatch-not-running', () => {
  if (userInfo.externalOBSCapture !== null && userInfo.externalOBSCapture) {
    stopCapture();
  }
});

ipcMain.on('create-obs-display', () => {
  createOBSDisplay();
});

ipcMain.on('remove-obs-display', () => {
  removeOBSDisplay();
});

ipcMain.on('update-obs-display', (event, show, width, height, x, y) => {
  updateOBSDisplay(show, width, height, x, y);
});
