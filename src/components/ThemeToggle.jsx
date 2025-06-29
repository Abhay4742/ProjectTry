import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      type="button"
    >
      {isDarkMode ? (
        // Using a sun emoji for light mode when in dark mode
        <span className="theme-icon" style={{ fontSize: '18px' }}>☀️</span>
      ) : (
        // Using a moon emoji for dark mode when in light mode
        <span className="theme-icon" style={{ fontSize: '18px' }}>🌙</span>
      )}
    </button>
  )
}

export default ThemeToggle