import ReactDOM from 'react-dom';
import { App } from './modules/core';
import Awesome from './modules/awesome';

/**
 * Building the app using modules. It's like bricks which are used for building a house.
 */
App.registerModules([new Awesome()]);

/**
 * Set up configuration based on environment
 */
App.init({});

/**
 * Render the app
 */
ReactDOM.render(App.render(), document.getElementById('root'));
