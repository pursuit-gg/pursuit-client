const sh = require('shelljs');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const colors = require('colors/safe');
const zip = require('7zip-bin');

const OBS_FRAME_CAPTURE_FILTER_VERSION = '0.1.3';

async function runScript() {
  const zipExe = zip.path7za;
  const nodeObsPath = path.join(__dirname, '..', 'node_modules', '@streamlabs', 'obs-studio-node', 'libobs');

  const obsFrameCaptureFilterDownloadUrl = `https://github.com/pursuit-gg/obs-frame-capture-filter/releases/download/v${OBS_FRAME_CAPTURE_FILTER_VERSION}/obs-frame-capture-filter-v${OBS_FRAME_CAPTURE_FILTER_VERSION}.zip`;
  const obsFrameCaptureFilterArchivePath = path.join(os.tmpdir(), `obs-frame-capture-filter-v${OBS_FRAME_CAPTURE_FILTER_VERSION}.zip`);
  const obsFrameCaptureFilterArchive = fs.createWriteStream(obsFrameCaptureFilterArchivePath);
  const obsFrameCaptureFilterArchiveFinishPromise = new Promise(resolve => obsFrameCaptureFilterArchive.on('finish', resolve));

  sh.echo(`Downloading obs-frame-capture-filter version ${OBS_FRAME_CAPTURE_FILTER_VERSION}...`);
  https.get(obsFrameCaptureFilterDownloadUrl, redirectResponse => (
    https.get(redirectResponse.headers.location, response => response.pipe(obsFrameCaptureFilterArchive))
  ));
  await obsFrameCaptureFilterArchiveFinishPromise;

  sh.echo('Extracting obs-frame-capture-filter archive...');
  const result = sh.exec(`"${zipExe}" x "${obsFrameCaptureFilterArchivePath}" -o"${nodeObsPath}" -aoa`);

  if (result.code !== 0) {
    sh.echo(colors.red('ERROR: Extraction failed!'));
    sh.exit(1);
  }

  sh.echo('Cleaning up archives...');
  sh.rm(obsFrameCaptureFilterArchivePath);
}

runScript().then(() => sh.exit(0));
