import React, { useState, useRef, useEffect } from 'react'

const Header = ({ searchTerm, onSearchChange, onCreateModule, onAddResource }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleAddClick = () => {
    setShowDropdown(!showDropdown)
  }

  const handleCreateModule = () => {
    onCreateModule()
    setShowDropdown(false)
  }

  const handleAddLink = () => {
    onAddResource('link')
    setShowDropdown(false)
  }

  const handleUploadFile = () => {
    onAddResource('file')
    setShowDropdown(false)
  }

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
        <div className="add-dropdown" ref={dropdownRef}>
          <button className="add-button" onClick={handleAddClick}>
            <span>+</span>
            Add
            <span className="dropdown-arrow">▼</span>
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleCreateModule}>
                <span>📄</span>
                Create module
              </button>
              <button className="dropdown-item" onClick={handleAddLink}>
                <span>🔗</span>
                Add a link
              </button>
              <button className="dropdown-item" onClick={handleUploadFile}>
                <span>📁</span>
                Upload
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header