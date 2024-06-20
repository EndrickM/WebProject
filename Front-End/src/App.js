import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lista from './componetes/pagina/list.jsx';
import Home from './componetes/pagina/home.jsx';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Lista/:id" element={<Lista />} />
            </Routes>
        </Router>
    );
};

export default App;
