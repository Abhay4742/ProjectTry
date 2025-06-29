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

    // Position the dropdown using fixed positioning to ensure it appears outside module boundaries
    const positionDropdown = () => {
      if (menuRef.current) {
        const menuButton = menuRef.current.parentElement?.querySelector('.menu-button')
        if (menuButton) {
          const rect = menuButton.getBoundingClientRect()
          const dropdown = menuRef.current
          
          // Position dropdown below and to the right of the button
          dropdown.style.position = 'fixed'
          dropdown.style.top = `${rect.bottom + 4}px`
          dropdown.style.left = `${rect.right - 160}px` // Align right edge with button
          dropdown.style.right = 'auto'
          
          // Ensure dropdown doesn't go off screen
          const dropdownRect = dropdown.getBoundingClientRect()
          if (dropdownRect.right > window.innerWidth) {
            dropdown.style.left = `${window.innerWidth - dropdownRect.width - 10}px`
          }
          if (dropdownRect.left < 0) {
            dropdown.style.left = '10px'
          }
        }
      }
    }

    // Position immediately and on scroll/resize
    positionDropdown()
    window.addEventListener('scroll', positionDropdown)
    window.addEventListener('resize', positionDropdown)

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('scroll', positionDropdown)
      window.removeEventListener('resize', positionDropdown)
    }
  }, [onClose])

  const handleItemClick = (item) => {
    console.log('Dropdown item clicked:', item.label)
    if (item.onClick) {
      item.onClick()
    }
  }

  return (
    <div ref={menuRef} className="dropdown-menu positioned">
      {items.map((item, index) => (
        <button
          key={index}
          className={`dropdown-item ${item.danger ? 'danger' : ''}`}
          onClick={() => handleItemClick(item)}
          type="button"
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default DropdownMenu