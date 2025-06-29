import React, { useState, useEffect } from 'react'

const ModuleModal = ({ module, onSave, onClose }) => {
  const [name, setName] = useState('')

  useEffect(() => {
    if (module) {
      setName(module.name || '')
    } else {
      setName('')
    }
  }, [module])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onSave({ name: name.trim() })
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {module ? 'Edit module' : 'Create new module'}
          </h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Module name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Introduction to Trigonometry"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="button button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="button button-primary"
              disabled={!name.trim()}
            >
              {module ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModuleModal