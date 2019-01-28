import _ from 'lodash';
import React from 'react';
import Module from './Module';
import Router from './Router';
import Reducer from './Reducer';
import initStore from '../redux/store';
import initReducers from '../redux/reducers';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

function App() {
  const _this = this;
  _this.router = new Router();
  _this.reducer = new Reducer();
  _this.modules = {};

  /**
   * Returning reducer
   * @returns {Reducer}
   */
  _this.getReducer = () => {
    return _this.reducer;
  };

  /**
   * Returning list of registered modules
   * @returns {{}}
   */
  _this.getModules = () => _this.modules;

  /**
   * Method which is register router list from all registered modules
   * @param modules
   * @returns {{}}
   */
  _this.registerRoutes = modules => {
    const result = {};

    _(modules).each(module =>
      _(module.getRoutes()).each((route, key) => {
        if (result[key] && !route.rewriteDefault) {
          throw new Error(
            `In module "${module.getName()}" route with name "${key}" already registered in system. Specify another name for route.`
          );
        }

        result[key] = { ...result[key], ...route };
      })
    );

    return result;
  };

  /**
   * Register one module among all modules
   * @param module
   */
  _this.setModule = module => {
    const name = module.getName();
    if (!(module instanceof Module)) {
      throw new Error('Register module should be an object of class Module');
    }

    if (_this.modules[name]) {
      throw new Error('Module of this name is exist');
    }

    _this.modules[name] = module;
  };

  return {
    /**
     * Method initialized all app routings and union reducer
     */
    init(config = {}) {
      const routers = _this.registerRoutes(_this.getModules());

      _this.router = new Router(routers);
      _this.reducer = new Reducer(_this.getModules());
    },

    /**
     * Return router list
     * @returns {Router}
     */
    getRouter() {
      return _this.router;
    },

    /**
     * Return module
     * @param name
     * @returns {*}
     */
    getModule(name) {
      return _this.modules[name];
    },

    /**
     * Register modules in the app.
     * @param modules
     */
    registerModules(modules) {
      modules.map(_this.setModule);
    },

    /**
     * Method which is built initial React app
     * In the app has already included
     * - Redux
     * - Browser routing
     * @returns {*}
     */
    render() {
      return (
        <Provider store={initStore(initReducers(_this.getReducer().getAll()))}>
          <BrowserRouter>
            <Switch>
              {this.getRouter()
                .getAll()
                .map((props, key) => (
                  <Route key={key} {...props} />
                ))}
            </Switch>
          </BrowserRouter>
        </Provider>
      );
    }
  };
}

export default new App();
