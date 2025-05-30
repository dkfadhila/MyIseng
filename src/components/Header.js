import React from 'react';

function Header() {
  return (
    <header className="app-header">
      <h1 className="app-title">HEHEHE</h1>
      <nav className="app-nav">
        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="nav-link">
          X.com
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="nav-link">
          GitHub
        </a>
      </nav>
    </header>
  );
}

export default Header;