/* global window */

import React from 'react';
import { Link } from 'react-router';

import LoginForm from 'components/LoginForm/LoginForm';
import WhiteCard from 'components/WhiteCard/WhiteCard';
import './LoginPage.m.css';

const electron = window.require('electron');

const LoginPage = () => (
  <div styleName="wrapper">
    <h1 styleName="title"> Login </h1>
    <WhiteCard>
      <LoginForm />
      <h5><a
        className="underline inlineBlock"
        onClick={(e) => {
          e.preventDefault();
          electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/signup`);
        }}
      > Sign up </a></h5>
      <h5><a
        className="underline inlineBlock"
        onClick={(e) => {
          e.preventDefault();
          electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/users/forgot_password`);
        }}
      > Forgot your password? </a></h5>
    </WhiteCard>
  </div>
);

export default LoginPage;
