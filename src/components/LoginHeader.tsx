import React from 'react';
import '../styles/header.css';

const LoginHeader: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src="/esmorga-icon.svg" alt="Esmorga Logo" className="logo" draggable="false"/>
        <span className="app-name">Esmorga</span>
      </div>
    </header>
  );
};

export default LoginHeader;