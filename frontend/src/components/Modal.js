import React from 'react';

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal" onClick={onClose}>
      <div className="modalContent" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
