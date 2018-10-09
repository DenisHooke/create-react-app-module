import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => (
    <div>
        <nav>
            <Link to="/">Main</Link>
            <Link to="/dashboard">Dashboard</Link>
        </nav>
        <p>This is my new test page which you cas see</p>
    </div>
)

export default  Dashboard