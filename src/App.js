import React from 'react';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import LoginPage from 'containers/LoginPage/LoginPage';
import PublicContainer from 'containers/PublicContainer/PublicContainer';
import RequireAuthContainer from 'containers/RequireAuthContainer/RequireAuthContainer';
import MainLayout from 'containers/MainLayout/MainLayout';
import HomePage from 'containers/HomePage/HomePage';
import OnboardingPage from 'containers/OnboardingPage/OnboardingPage';
import SettingsPage from 'containers/SettingsPage/SettingsPage';
import AboutPage from 'containers/AboutPage/AboutPage';
import Root from 'containers/Root/Root';
import configureStore from 'store/configureStore';
import { sendStoreToRequestUtils } from 'requests/utils';

import './App.css';
import './styles/base.css';
import './styles/textBase.css';
import './styles/helpers.css';
import './styles/tooltip.css';

const store = configureStore(hashHistory);
const history = syncHistoryWithStore(hashHistory, store);
sendStoreToRequestUtils(store);

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Root}>
        <IndexRedirect to="home" />
        <Route component={PublicContainer}>
          <Route path="login" component={LoginPage} />
        </Route>
        <Route path="onboarding" component={OnboardingPage} />
        <Route component={RequireAuthContainer} >
          <Route component={MainLayout} >
            <Route path="home" component={HomePage} />
            <Route path="settings" component={SettingsPage} />
            <Route path="about" component={AboutPage} />
          </Route>
        </Route>
      </Route>
    </Router>
  </Provider>
);

export default App;
