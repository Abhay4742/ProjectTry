import React, { useState } from 'react'

const ResourceModal = ({ type, onSave, onClose }) => {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (type === 'link' && name.trim() && url.trim()) {
      onSave({
        name: name.trim(),
        url: url.trim()
      })
    } else if (type === 'file' && name.trim() && file) {
      onSave({
        name: name.trim(),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      })
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      if (!name.trim()) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const isValid = type === 'link' 
    ? name.trim() && url.trim()
    : name.trim() && file

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {type === 'link' ? 'Add a link' : 'Upload file'}
          </h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                {type === 'link' ? 'Link title' : 'File title'}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder={type === 'link' ? 'Link title' : 'File title'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            
            {type === 'link' ? (
              <div className="form-group">
                <label className="form-label">URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Select file</label>
                <div className="file-input">
                  <input
                    type="file"
                    onChange={handleFileChange}
                  />
                  <div>
                    {file ? (
                      <div>
                        <strong>{file.name}</strong>
                        <br />
                        <small>{Math.round(file.size / 1024)} KB</small>
                      </div>
                    ) : (
                      <div>
                        <span>📁</span>
                        <br />
                        Click to select a file
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="button button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="button button-primary"
              disabled={!isValid}
            >
              {type === 'link' ? 'Add link' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResourceModal