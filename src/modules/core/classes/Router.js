/* eslint no-param-reassign: 0 */
import _ from 'lodash';

export default class Router {
  _routes = {};

  constructor(routes) {
    this._routes = routes;
  }

  get routes() {
    return this._routes;
  }

  set routes(value) {
    this._routes = value;
  }

  getPath(key, params = {}) {
    return this._routes[key] ? this.replaceParams(this._routes[key].pattern, params) : false;
  }

  getList() {
    return _.sortBy(_.toArray(this._routes), [o => o.pattern === '*']);
  }

  getAll() {
    return this.getList();
  }

  replaceParams(pattern, params) {
    if (_.isEmpty(params)) {
      return pattern.replace(/\((.*)\)/, '');
    }

    _.map(params, (param, key) => {
      pattern = pattern.replace(`:${key}`, param);
    });

    pattern = pattern.replace(/([\)\(])/g, ''); // eslint-disable-line

    return pattern;
  }
}
