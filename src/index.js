import ReactDOM from 'react-dom';
import { App } from './modules/core';
import Awesome from './modules/awesome';

App.registerModules([new Awesome({})]);

ReactDOM.render(App.render(), document.getElementById('root'));
