# Create React App Module


## Table of Contents
- [Introduction](#intro)
- [Installation](#install)
- [Running](#running)
- [Folder Structure](#folder-structure)
- [Module Structure](#module-structure)
- [Communication between modules](#module-communications)
- [Create a new module](#new-module)

## Introduction
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and supported all cors and features which exist in Create React App.
There's one difference that the current project has another folder structure based on module architecture. 

## Installation

From the root folder of the project run docker command:

```bash
docker build -t create-react-app-module .

```

## Running

For development mode just run docker image:

```bash
docker container run -it -p 3000:3000 -p 35729:35729 -v $(pwd):/app create-react-app-module
``` 

## Folder structure

After creation, your project should looks like this:

```
my-app/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  src/
    index.js
    serviceWorker.js
    /modules
      /awesome <- demo module
      ...
      /core
        /classes
        /helpers
        /redux
        index.js
```
The main difference between Create React App and the boilerplate that the `/src` folder contains `modules` dir with `core` module which manages the app. 


## Module structure

> Tooltip: For easier creation a new module you may use special script [cram-builder](https://www.npmjs.com/package/cram-builder). Already included as dependency of the boilerplate.

Your app should build using module architecture principals when your features are divided to independence modules as much as possible. But if your
logic is assumed communications between modules or one module is depended by other, you may use some feature which are described in special section of README.md file.

 Fullest module has next structure:
 ```
 awesome-module/
   /actions
   /components
     /elements
     /pages
       /HelloWorld
         HelloWorld.js
         index.js
         style.scss
     /forms
     /popups
   /reducer
     index.js
   config.js
   routes.js
   template.js
   index.js
 ```
 
 **/actions** - folder contains all redux actions which may be used by the module.
 
 **/components** - folder with React components. We highly recommend to use sub-dirs for components. (e.g. popups, elements, pages)
 
 **/reducer** - in bound of module architecture principle assuming that reducer will be only one. It means that in reducer folder there'll be only one `index.js` file.
 
 **config.js** - object with default settings/options of the module which could be using in any place of the module. These config may be overriding by the application which would be using this module.
 For safe getting the setting value use command:
 
 ```js
App.getModule().getConfig().get('APP_VERSION');
```
**routes.js** - file with a list of routing navigation that are implemented in this module.

Example:
```js
import Category from './components/pages/Category';
import Dashboard from './components/pages/Dashboard';
 
export default {
  category: {
    path: '/',
    exact: true,
    component: Category
  },
  dashboard: {
    path: '/dashboard',
    component: Dashboard
  }
};
```

> Note: All routing's mast have unique keys, otherwise the app returned an error.

 For safe getting the route you can use command:
 
 ```js
 App.getRouter().getPath('dashboard'); // return: '/dashboard'
```

**templates.js** - file uses for communication between modules. More details you could find in additioan section of README.md file.


**index.js** - the main file of the module which contains initialization process of the module. Simpliest module can contain only name of the module, all 
other settings are not required.

Example:

```js
import reducer from './reducer';
import routes from './routes';
import moduleConfig from './config';
import { Module } from '../core/index';
import './template';
 
const module = globalConfig =>
  new Module('Amesome', {
    routes,
    reducer,
    config: { ...moduleConfig, ...globalConfig },
    actions: {}
  });
 
export default module;

```

## Communication between modules

No description yet.

## Create a new module

No description yet.