import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import paths from './paths';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to={paths.login} />} />
        <Route path={paths.login} element={<Login />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;