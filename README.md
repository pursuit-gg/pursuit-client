# Pursuit.gg

Pursuit.gg Desktop Client

## Requirements
  - Currently only building and packaging signed/unsigned versions on Mac for 64-bit Windows is tested. Unsigned versions can be built and packaged on Windows.
  - In order to create a signed windows version you must place the digicert at this path ```~/Dev/codesigning/WindowsCodeSigningCert.p12```
  - node + npm - [nodejs.org](https://nodejs.org)

## Environment variables
These should be placed in a .env file in the pursuit-client folder:

  - ```REACT_APP_MITHRIL_ROOT_URL``` - root url for pursuit.gg api endpoints
  - ```REACT_APP_TAVERN_ROOT_URL``` - root url for pursuit.gg website
  - ```REACT_APP_MIXPANEL_TOKEN``` - mixpanel token
  - ```CSC_NAME``` - developer id name for the code signing cert

These should be placed in an awsSettings.js file in the pursuit-client folder:

  - ```AWS_REGION``` - region of s3 bucket to upload capture to
  - ```AWS_S3_CAPTURE_BUCKET``` - name of s3 bucket to upload captures to
  - ```AWS_IDENTITY_POOL_ID``` - aws identity pool id to authorize uploads to the s3 bucket

## Running in Dev
This will start an electron client running the react app with hot reloading for development purposes:

  - Navigate to pursuit-client folder in terminal
  - Run ```npm install``` to install the package dependencies
  - Run ```npm run install-plugin``` to download and copy the [obs-frame-output](https://github.com/pursuit-gg/obs-frame-output) plugin into the correct location
  - Run ```npm run dev```

## Packaging
This will package the app into a .exe file along with a .yml file for auto update purposes:

  - Navigate to pursuit-client folder in terminal
  - Run ```npm install``` to install the package dependencies
  - Run ```npm run install-plugin``` to download and copy the [obs-frame-output](https://github.com/pursuit-gg/obs-frame-output) plugin into the correct location
  - Run ```npm run build``` to create the built react app
  - Run ```npm run dist``` to create the packaged app in the dist folder

To create an unsigned version, change the following in package.json then run ```npm run dist``` again:

  - ```forceCodeSigning: true``` *->* ```forceCodeSigning: false```
  - ```"dist:win": "export CSC_LINK=~/Dev/codesigning/WindowsCodeSigningCert.p12; read -s -p \"Certificate Password: \" certPassword; export CSC_KEY_PASSWORD=\"$certPassword\"; build --win``` *->* ```"dist:win": build --win"```

## Acknowledgements
The Pursuit.gg Desktop Client is built on top of [OBS Studio](https://github.com/jp9000/obs-studio) and the [OBS Studio Node Wrapper](https://github.com/stream-labs/obs-studio-node). The hard work done by the OBS and Streamlabs teams enables us to be compatible with many different systems and minimize our performance impact.
