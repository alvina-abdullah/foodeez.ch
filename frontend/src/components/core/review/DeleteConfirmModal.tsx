import React from 'react';
import ModalPortal from '../ModalPortal';

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const DeleteConfirmModal = ({ onConfirm, onCancel, loading }: DeleteConfirmModalProps) => {
  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
          <h3 className="text-xl font-bold mb-4 text-danger">Delete Review</h3>
          <p className="mb-6 text-text-main">Are you sure you want to delete this review? This action cannot be undone.</p>
          <div className="flex gap-4">
            <button
              className="btn-secondary flex-1"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-danger flex-1"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default DeleteConfirmModal; 