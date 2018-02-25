/* global window */

import React from 'react';
import { Link } from 'react-router';

import twitter from 'images/genericIcons/twitterDarkLogo.png';
import discord from 'images/genericIcons/discordDarkLogo.png';
import xIcon from 'images/genericIcons/darkGreyX.svg';
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
      <h3> Pursuit </h3>
      <h5 styleName="linkSpacing"> v{appVersion}</h5>
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
