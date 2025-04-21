"use client";

const AddTaskModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm transition-opacity bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl p-2 rounded-full transition-colors"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default AddTaskModal;