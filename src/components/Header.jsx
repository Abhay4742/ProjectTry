import React from 'react'

const Header = ({ searchTerm, onSearchChange, onCreateModule }) => {
  return (
    <div className="header">
      <h1 className="header-title">Course builder</h1>
      <div className="header-actions">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button className="add-button" onClick={onCreateModule}>
          <span>+</span>
          Add
        </button>
      </div>
    </div>
  )
}

export default Header