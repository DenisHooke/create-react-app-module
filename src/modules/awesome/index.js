import reducer from './reducer';
import routes from './routes';
import moduleConfig from './config';
import './template';
import { Module } from '../core/index';

const module = globalConfig =>
  new Module('Amesome', {
    routes,
    reducer,
    config: { ...moduleConfig, ...globalConfig },
    actions: {}
  });

export default module;
