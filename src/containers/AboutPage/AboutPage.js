/* global window */

import React from 'react';
import { Link } from 'react-router';

import twitter from 'images/genericIcons/twitterLogo.png';
import discord from 'images/genericIcons/discordLogo.png';
import xIcon from 'images/genericIcons/lightGreyX.svg';
import './AboutPage.m.css';

const electron = window.require('electron');
const { app } = electron.remote;
const appVersion = app.getVersion();

const AboutPage = () => (
  <div styleName="wrapper">
    <div styleName="header">
      <h1 styleName="headerText"> ABOUT </h1>
      <Link to="/home" styleName="xIconWrapper">
        <img src={xIcon} alt="close" styleName="xIcon" />
      </Link>
    </div>
    <div styleName="pursuitInfo">
      <h3 className="bold"> Pursuit Client</h3>
      <h5 styleName="linkSpacing"> v{appVersion}</h5>
      <h5 className="largeText">
        The Pursuit client is open source and available on <a
          styleName="underlinedLink"
          onClick={(e) => {
            e.preventDefault();
            electron.shell.openExternal('https://github.com/pursuit-gg/pursuit-client');
          }}
        >Github</a>.
      </h5>
      <h5 className="bold" styleName="acknowledgements"> Acknowledgements </h5>
      <h5>
        The Pursuit client is built on top of <a
          styleName="underlinedLink"
          onClick={(e) => {
            e.preventDefault();
            electron.shell.openExternal('https://github.com/jp9000/obs-studio');
          }}
          target="_blank"
        >OBS Studio</a> and the <a
          styleName="underlinedLink"
          onClick={(e) => {
            e.preventDefault();
            electron.shell.openExternal('https://github.com/stream-labs/obs-studio-node');
          }}
          target="_blank"
        >OBS Studio Node Wrapper</a>.
        The hard work done by the OBS and Streamlabs teams makes this project possible.
      </h5>
      <div styleName="otherLinks">
        <h5 styleName="linkSpacing"><a
          styleName="underlinedLink"
          onClick={(e) => {
            e.preventDefault();
            electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/faq`);
          }}
        > FAQ </a></h5>
        <h5 styleName="linkSpacing"><a
          styleName="underlinedLink"
          onClick={(e) => {
            e.preventDefault();
            electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/terms`);
          }}
        > Terms of Service </a></h5>
        <h5 styleName="linkSpacing"><a
          styleName="underlinedLink"
          onClick={(e) => {
            e.preventDefault();
            electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/privacy`);
          }}
        > Privacy Policy </a></h5>
      </div>
      <a
        styleName="socialIconWrapper"
        onClick={(e) => {
          e.preventDefault();
          electron.shell.openExternal('https://twitter.com/pursuitgg');
        }}
      ><img styleName="socialIcon" src={twitter} alt="twitter" /></a>
      <a
        styleName="socialIconWrapper"
        onClick={(e) => {
          e.preventDefault();
          electron.shell.openExternal('https://discord.gg/wqymsEZ');
        }}
      ><img styleName="socialIcon" src={discord} alt="discord" /></a>
    </div>
  </div>
);

export default AboutPage;
