import _ from 'lodash';

export default class Module {
  _reducer = {};
  _actions = {};
  _routes = [];
  _name = null;
  _props = {};
  _config = {};

  constructor(name, { routes, reducer, actions, config, props = {} }) {
    if (name === undefined) {
      throw new Error('Module must have a name');
    }

    this.setName(name)
      .setRoutes(routes)
      .setActions(actions)
      .setReducer(reducer)
      .setConfig(config)
      .setProps(props);
  }

  setReducer(reducer) {
    if (typeof reducer === 'function') {
      this._reducer[this.getName().toLowerCase()] = reducer;
    }

    if (typeof reducer === 'object') {
      _.map(reducer, (element, name) => {
        this._reducer[name.toLowerCase()] = element;
      });
    }

    return this;
  }

  getReducer() {
    return this._reducer;
  }

  setRoutes(routes) {
    const newRoutes = routes && routes.default ? routes.default : routes;

    if (newRoutes) {
      this._routes = { ...this._routes, ...newRoutes };
    }

    return this;
  }

  getRoutes() {
    return this._routes;
  }

  setProps(props) {
    this._props = props;
    return this;
  }

  setActions(value) {
    if (value === undefined) return this;
    this._actions = value;
    return this;
  }

  getActionsOf(key) {
    return this._actions[key];
  }

  getName() {
    return this._name;
  }

  getProps() {
    return this._props;
  }

  setName(value) {
    this._name = value;
    return this;
  }

  getConfig(key = false) {
    return key ? this._config[key] : this._config;
  }

  setConfig(value) {
    this._config = value;
    return this;
  }
}
