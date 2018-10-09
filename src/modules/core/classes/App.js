import _ from 'lodash';
import React from 'react';
import Module from './Module';
import Router from './Router';
import Reducer from './Reducer';
import initStore from "../redux/store";
import initReducers from "../redux/reducers";
import {Provider} from 'react-redux';
import {BrowserRouter, Switch, Route} from 'react-router-dom'

function App() {
    const _this = this;
    _this.router = new Router();
    _this.reducer = new Reducer();
    _this.modules = {};

    _this.init = () => {
        const routers = _this.registerRoutes(_this.getModules());

        _this.router = new Router(routers);
        _this.reducer = new Reducer(_this.getModules());
    };

    _this.getReducer = () => {
        return _this.reducer;
    };

    _this.getModules = () => _this.modules;

    _this.registerRoutes = (modules) => {
        const result = {};

        _(modules).each(module => (
            _(module.getRoutes()).each((route, key) => {
                if (result[key] && !route.rewriteDefault) {
                    throw new Error(`
                        In module "${module.getName()}" route with name "${key}" already registered in system. 
                        Specify another name for route.
                    `);
                }

                result[key] = {...result[key], ...route};
            })
        ));

        return result;
    };

    _this.setModule = (module) => {
        const name = module.getName();
        if (!(module instanceof Module)) {
            throw new Error('Register module should be an object of class Module');
        }

        if (_this.modules[name]) {
            throw new Error('Module of this name is exist');
        }

        _this.modules[name] = module;
    };

    return {
        getRouter() {
            return _this.router;
        },

        getModule(name) {
            return _this.modules[name];
        },

        registerModules(modules) {
            modules.map(_this.setModule);
            _this.init();
        },

        render() {
            return (
                <Provider store={initStore(initReducers(_this.getReducer().getAll()))}>
                    <BrowserRouter>
                        <Switch>
                            {this.getRouter().getAll().map(
                                (props, key) => (<Route key={key} {...props} />)
                            )}
                        </Switch>
                    </BrowserRouter>
                </Provider>
            )
        }
    };
}

export default new App();
