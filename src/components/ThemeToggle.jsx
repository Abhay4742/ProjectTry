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
        <img 
          src="/src/assets/sun-icon.svg" 
          alt="Light mode" 
          className="theme-icon"
          width="18"
          height="18"
        />
      ) : (
        <img 
          src="/src/assets/moon-icon.svg" 
          alt="Dark mode" 
          className="theme-icon"
          width="18"
          height="18"
        />
      )}
    </button>
  )
}

export default ThemeToggle