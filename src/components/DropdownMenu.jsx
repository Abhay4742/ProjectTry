import React, { useEffect, useRef } from 'react'

const DropdownMenu = ({ items, onClose }) => {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  return (
    <div ref={menuRef} className="dropdown-menu">
      {items.map((item, index) => (
        <button
          key={index}
          className={`dropdown-item ${item.danger ? 'danger' : ''}`}
          onClick={item.onClick}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default DropdownMenu