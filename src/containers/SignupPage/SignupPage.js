/* global window */
import React from 'react';
import { Link } from 'react-router';

import SignupForm from 'components/SignupForm/SignupForm';
import DarkCard from 'components/DarkCard/DarkCard';
import './SignupPage.m.css';

const electron = window.require('electron');

const SignupPage = () => (
  <div styleName="wrapper">
    <h1 styleName="title"> Sign Up </h1>
    <DarkCard>
      <SignupForm />
      <h5><Link
        to="/login"
        className="underline inlineBlock"
      > Login </Link></h5>
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

export default SignupPage;
