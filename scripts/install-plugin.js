const sh = require('shelljs');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const colors = require('colors/safe');
const zip = require('7zip-bin');

const OBS_FRAME_OUTPUT_VERSION = '0.1.2';

async function runScript() {
  const zipExe = zip.path7za;
  const nodeObsPath = path.join(__dirname, '..', 'node_modules', '@streamlabs', 'obs-studio-node', 'libobs');

  const obsFrameOutputDownloadUrl = `https://github.com/pursuit-gg/obs-frame-output/releases/download/v${OBS_FRAME_OUTPUT_VERSION}/obs-frame-output-v${OBS_FRAME_OUTPUT_VERSION}.zip`;
  const obsFrameOutputArchivePath = path.join(os.tmpdir(), `obs-frame-output-v${OBS_FRAME_OUTPUT_VERSION}.zip`);
  const obsFrameOutputArchive = fs.createWriteStream(obsFrameOutputArchivePath);
  const obsFrameOutputArchiveFinishPromise = new Promise(resolve => obsFrameOutputArchive.on('finish', resolve));

  sh.echo(`Downloading obs-frame-output version ${OBS_FRAME_OUTPUT_VERSION}...`);
  https.get(obsFrameOutputDownloadUrl, redirectResponse => (
    https.get(redirectResponse.headers.location, response => response.pipe(obsFrameOutputArchive))
  ));
  await obsFrameOutputArchiveFinishPromise;

  sh.echo('Extracting obs-frame-output archive...');
  result = sh.exec(`"${zipExe}" x "${obsFrameOutputArchivePath}" -o"${nodeObsPath}/obs-plugins/64bit" -aoa`);

  if (result.code !== 0) {
    sh.echo(colors.red('ERROR: Extraction failed!'));
    sh.exit(1);
  }

  sh.echo('Cleaning up archives...');
  sh.rm(obsFrameOutputArchivePath);
}

runScript().then(() => sh.exit(0));
