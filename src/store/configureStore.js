import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import { routerMiddleware } from 'react-router-redux';
import { persistStore } from 'redux-persist';

import mixpanel from 'mixpanel-browser';
import MixpanelMiddleware from 'redux-mixpanel-middleware';
import thunk from 'redux-thunk';

import reducer from '../reducers';

mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN);
const mixpanelMiddleware = new MixpanelMiddleware(mixpanel);

export default function configureStore(history) {
  const composeEnhancers = composeWithDevTools({});
  const store = createStore(
    reducer,
    composeEnhancers(
      applyMiddleware(
        thunk,
        routerMiddleware(history),
        mixpanelMiddleware,
      ),
    ),
  );
  persistStore(store, { blacklist: ['notifications', 'errors', 'requests'] });
  return store;
}
