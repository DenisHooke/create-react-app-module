import _ from 'lodash';

/**
 * The special class wrapper which must be used each module in the app.
 */
export default class Module {
  _name = null;
  _reducer = {};
  _actions = {};
  _routes = [];
  _config = {};

  constructor(name, { routes, reducer, actions, config }) {
    if (name === undefined) {
      throw new Error('Module must have a name');
    }

    this.setName(name)
      .setRoutes(routes)
      .setActions(actions)
      .setReducer(reducer)
      .setConfig(config);
  }

  /**
   * Set reducer of a module.
   * Argument may be as one reducer and as multiple reducers list.
   * @param reducer
   * @returns {Module}
   */
  setReducer(reducer) {
    if (typeof reducer === 'function') {
      this.applyReducer(reducer, this.getName());
    }

    if (typeof reducer === 'object') {
      _(reducer).map(this.applyReducer.bind(this));
    }

    return this;
  }

  /**
   * Set one reducer
   * @param reducer
   * @param name
   * @returns {Module}
   */
  applyReducer(reducer, name) {
    this._reducer[name.toLocaleLowerCase()] = reducer;

    return this;
  }

  /**
   * Returning reducer function of a module
   * @returns {{}}
   */
  getReducer() {
    return this._reducer;
  }

  /**
   * Set router list
   * @param routes
   * @returns {Module}
   */
  setRoutes(routes) {
    this._routes = routes;

    return this;
  }

  /**
   * Get router list
   * @returns {Array}
   */
  getRoutes() {
    return this._routes;
  }

  /**
   * Set public method for exposed using
   * @param actions
   * @returns {Module}
   */
  setActions(actions) {
    this._actions = actions;

    return this;
  }

  /**
   * Returning all public methods
   * @param key
   * @returns {*}
   */
  getActionsOf(key) {
    return this._actions[key];
  }

  /**
   * Returning name of a module
   * @returns {*}
   */
  getName() {
    return this._name;
  }

  /**
   * Set name of a module
   * @param value
   * @returns {Module}
   */
  setName(value) {
    this._name = value;
    return this;
  }

  /**
   * Returning all props of module configuration or
   * returning config property by key
   * @param key
   * @returns {{}}
   */
  getConfig(key = false) {
    return key ? this._config[key] : this._config;
  }

  /**
   * Set module configuration
   * @param value
   * @returns {Module}
   */
  setConfig(value) {
    this._config = value;
    return this;
  }
}
