import _ from 'lodash';

export default class Reducer {
  _collection = () => null;

  constructor(modules) {

    let result = {};
    _.forEach(modules, (module) => {
      result = { ...result, ...module.getReducer() };
    });

    this.collection = result;
  }

  getAll() {
    return this._collection;
  }

  set collection(value) {
    this._collection = value;
  }
}
