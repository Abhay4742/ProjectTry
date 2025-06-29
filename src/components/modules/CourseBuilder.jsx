import { useState } from 'react';

import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';

import LinkModal from './LinkModal';
import ModuleCard from './ModuleCard';
import ModuleModal from './ModuleModal';
import UploadModal from './UploadModal';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);
  const [items, setItems] = useState([]);

  // Modal states
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Current items for editing
  const [currentModule, setCurrentModule] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  const handleAddClick = type => {
    switch (type) {
      case 'module':
        setCurrentModule(null);
        setIsModuleModalOpen(true);
        break;
      case 'link':
        // This is handled through the module card now
        break;
      case 'upload':
        // This is handled through the module card now
        break;
      default:
        break;
    }
  };

  const handleCloseModuleModal = () => {
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveModule = module => {
    if (currentModule) {
      // Edit existing module
      setModules(modules.map(m => (m.id === module.id ? module : m)));
    } else {
      // Add new module
      setModules([...modules, module]);
    }
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleEditModule = module => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = moduleId => {
    setModules(modules.filter(module => module.id !== moduleId));
    // Also remove any items associated with this module
    setItems(items.filter(item => item.moduleId !== moduleId));
  };

  const handleAddItem = (moduleId, type) => {
    setCurrentModuleId(moduleId);
    if (type === 'link') {
      setIsLinkModalOpen(true);
    } else if (type === 'file') {
      setIsUploadModalOpen(true);
    }
  };

  const handleSaveLink = linkItem => {
    setItems([...items, linkItem]);
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveUpload = fileItem => {
    setItems([...items, fileItem]);
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleDeleteItem = itemId => {
    setItems(items.filter(item => item.id !== itemId));
  };

  return (
    <div className="course-builder">
      <Header onAddClick={handleAddClick} />

      <div className="builder-content">
        {modules.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="module-list">
            {modules.map(module => (
              <ModuleCard
                key={module.id}
                module={module}
                items={items}
                onEdit={handleEditModule}
                onDelete={handleDeleteModule}
                onAddItem={handleAddItem}
                onDeleteItem={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Module Modal */}
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={handleCloseModuleModal}
        onSave={handleSaveModule}
        module={currentModule}
      />

      {/* Link Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={handleCloseLinkModal}
        onSave={handleSaveLink}
        moduleId={currentModuleId}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onSave={handleSaveUpload}
        moduleId={currentModuleId}
      />
    </div>
  );
};

export default CourseBuilder;
