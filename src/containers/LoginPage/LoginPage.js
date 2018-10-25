/* global window */
import React from 'react';
import { Link } from 'react-router';

import LoginForm from 'components/LoginForm/LoginForm';
import DarkCard from 'components/DarkCard/DarkCard';
import './LoginPage.m.css';

const electron = window.require('electron');

const LoginPage = () => (
  <div styleName="wrapper">
    <h1 styleName="title"> Login </h1>
    <DarkCard>
      <LoginForm />
      <h5><Link
        to="/signup"
        className="underline inlineBlock"
      > Sign up </Link></h5>
      <h5><a
        className="underline inlineBlock"
        onClick={(e) => {
          e.preventDefault();
          electron.shell.openExternal(`${process.env.REACT_APP_TAVERN_ROOT_URL}/users/forgot_password`);
        }}
      > Forgot your password? </a></h5>
    </DarkCard>
  </div>
);

export default LoginPage;
