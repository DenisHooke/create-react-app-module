import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

class Category extends Component {
    render() {
        return (
            <div>
                <nav>
                    <Link to="/">Main</Link>
                    <Link to="/dashboard">Dashboard</Link>
                </nav>
                <p>test method it works <Link to="/test">test link</Link></p>
            </div>
        )
    }
}

export default Category;
