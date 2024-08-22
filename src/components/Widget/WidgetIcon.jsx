import { useState, useEffect, useRef } from 'react';
import { WidgetIc, WidgetIconButton } from './WidgetIcon.styled';
import Widget from './Widget';

const WidgetIcon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null); 

  const openModal = () => {
    if (!isModalOpen) { 
      setIsModalOpen(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'visible';
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div>
      <WidgetIconButton onClick={openModal} disabled={isModalOpen}> 
        <WidgetIc />
      </WidgetIconButton>
      {isModalOpen && (
        <div ref={modalRef}>
          <Widget onClose={closeModal} />
        </div>
      )}
    </div>
  );
};

export default WidgetIcon;
