import _ from 'lodash';
import React from 'react';

const subscribers = Symbol('subscribers');

class Subscriber {
  constructor() {
    this[subscribers] = {};
  }

  subscribe(key, order, handler = null) {
    const subscriberList = this[subscribers];
    if (!subscriberList[key]) {
      subscriberList[key] = {};
    }

    if (typeof order !== 'number') {
      handler = order;
      order = 10 + Object.keys(subscriberList[key]).length * 10;
    }

    subscriberList[key][order] = handler;
  }

  unsubscribe(key, order = null) {
    const list = this[subscribers][key];
    if (!list) {
      return null;
    }
    order ? delete list[order] : delete this[subscribers][key];
  }
}

class Resolver extends Subscriber {
  resolve(key, data) {
    if (!key) {
      throw new Error('Invalid property key provided!');
    }

    const subscriberList = this[subscribers];

    if (!subscriberList[key]) {
      return data;
    }

    const func = _.flow(_.toArray(subscriberList[key]));

    return func(data);
  }
}

class Collector extends Subscriber {
  collect(key, params) {
    if (!key) {
      throw new Error('Invalid property key provided!');
    }
    const subscriberList = this[subscribers];
    if (!subscriberList[key]) {
      return [];
    }
    return _.map(subscriberList[key], subscriber => subscriber({ ...params }));
  }
}

export const resolver = new Resolver();
export const collector = new Collector();

export const PlaceholderHOC = (key, cmp) =>
  class Enhancer extends React.Component {
    render() {
      const Result = resolver.resolve(key, cmp);
      return <Result {...this.props} />;
    }
  };

export class HookComponent extends React.Component {
  render() {
    const { collectKey, params, ...otherProps } = this.props;
    const items = collector.collect(collectKey, params);
    return <div {...otherProps}>{items}</div>;
  }
}
