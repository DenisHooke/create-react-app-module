import _ from 'lodash';

/**
 * Class which is helping to build router list throughout of the all app.
 */
export default class Router {
  _routes = {};

  constructor(routes) {
    this._routes = routes;
  }

  /**
   * Getting
   * @returns {{}}
   */
  get routes() {
    return this._routes;
  }

  /**
   * Set one router object
   * @param value
   */
  set routes(value) {
    this._routes = value;
  }

  /**
   * Returning route by key. Optional is supporting change router params to dynamic values.
   * @param key
   * @param params
   * @returns {boolean}
   */
  getPath(key, params = {}) {
    return this._routes[key]
      ? this.replaceParams(this._routes[key].pattern, params)
      : false;
  }

  /**
   * Returning list of all routing list
   * @returns {*}
   */
  getAll() {
    return _.sortBy(_.toArray(this._routes), [o => o.pattern === '*']);
  }

  /**
   * Internal method which helps to replace router params
   * @param pattern
   * @param params
   * @returns {*}
   * @private
   */
  _replaceParams(pattern, params) {
    if (_(params).isEmpty()) {
      return pattern.replace(/\((.*)\)/, '');
    }

    _(params).each((param, key) => {
      pattern.replace(`:${key}`, param);
    });

    pattern = pattern.replace(/([)(])/g, '');

    return pattern;
  }
}
