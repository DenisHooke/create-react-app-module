import { createStore, applyMiddleware, compose } from 'redux';
import freeze from 'redux-freeze';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

const initStore = (reducers, middlewares = []) => {

  middlewares.push(thunk);

  // add the freeze dev middleware & redux logger
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(freeze);
    middlewares.push(createLogger());
  }

  // apply the middleware
  let middleware = applyMiddleware(...middlewares);

  // add the redux dev tools
  if (process.env.NODE_ENV !== 'production' && window.devToolsExtension) {
    middleware = compose(middleware, window.devToolsExtension());
  }

  // create the store
  return createStore(reducers, middleware);
};

export default initStore;
