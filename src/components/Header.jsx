import React, { useState, useRef, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

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

  const handleAddClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Header Add button clicked, current dropdown state:', showDropdown)
    setShowDropdown(!showDropdown)
  }

  const handleCreateModule = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Create module clicked from header')
    onCreateModule()
    setShowDropdown(false)
  }

  const handleAddLink = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Add link clicked from header')
    onAddResource('link')
    setShowDropdown(false)
  }

  const handleUploadFile = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Upload file clicked from header')
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
        <div className="header-buttons">
          <ThemeToggle />
          <div className="add-dropdown" ref={dropdownRef}>
            <button 
              className="add-button" 
              onClick={handleAddClick}
              type="button"
            >
              <span>+</span>
              Add
              <span className="dropdown-arrow">▼</span>
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button 
                  className="dropdown-item" 
                  onClick={handleCreateModule}
                  type="button"
                >
                  <span>📄</span>
                  Create module
                </button>
                <button 
                  className="dropdown-item" 
                  onClick={handleAddLink}
                  type="button"
                >
                  <span>🔗</span>
                  Add a link
                </button>
                <button 
                  className="dropdown-item" 
                  onClick={handleUploadFile}
                  type="button"
                >
                  <span>📁</span>
                  Upload
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header