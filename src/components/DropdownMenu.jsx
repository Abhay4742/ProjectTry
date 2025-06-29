import React, { useEffect, useRef } from 'react'

const DropdownMenu = ({ items, onClose }) => {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    // Add a small delay to prevent immediate closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }, 100)
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleItemClick = (item) => {
    console.log('Dropdown item clicked:', item.label)
    if (item.onClick) {
      item.onClick()
    }
  }

  return (
    <div ref={menuRef} className="dropdown-menu">
      {items.map((item, index) => (
        <button
          key={index}
          className={`dropdown-item ${item.danger ? 'danger' : ''}`}
          onClick={() => handleItemClick(item)}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default DropdownMenu