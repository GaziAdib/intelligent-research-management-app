"use client";
import { useState } from "react";
import AddTaskModal from "../modals/AddTaskModal";
import AddTaskForm from "../forms/AddTaskForm";

const ModalTaskButton = ({buttonLabel, teamInfo}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-gray-50 text-slate-900 font-medium px-4 py-2 rounded-lg"
      >
        {buttonLabel}
      </button>

      {/* Show Modal only when opened */}
      {isModalOpen && (
        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
           <AddTaskForm teamInfo={teamInfo} onSuccess={() => setIsModalOpen(false)}  />
        </AddTaskModal>
      )}
    </>
  );
};

export default ModalTaskButton;