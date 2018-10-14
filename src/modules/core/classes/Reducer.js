import _ from 'lodash';

/**
 * Class which is collected all reducers from all modules to the one list of reducers. At the end
 * it uses for automatically include reducers to the app
 */
export default class Reducer {
  _collection = () => null;

  constructor(modules) {
    let result = {};
    _.forEach(modules, module => {
      result = { ...result, ...module.getReducer() };
    });

    this.collection = result;
  }

  /**
   * Returning the list of all reducers
   * @returns {function(): null}
   */
  getAll() {
    return this._collection;
  }

  /**
   * Set list of reducers
   * @param value
   */
  set collection(value) {
    this._collection = value;

    return this;
  }
}
