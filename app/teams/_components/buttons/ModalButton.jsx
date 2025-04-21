"use client";
import { useState } from "react";
import AddTeamModal from "../modals/AddTeamModal";
import AddTeamForm from "../forms/AddTeamForm";

const ModalButton = ({buttonLabel}) => {
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
        <AddTeamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
           <AddTeamForm onSuccess={() => setIsModalOpen(false)} />
        </AddTeamModal>
      )}
    </>
  );
};

export default ModalButton;










// "use client";
// import { useState } from "react";
// import AddTeamModal from "../modals/AddTeamModal";
// import AddTeamForm from "../forms/AddTeamForm";

// const ModalButton = ({buttonLabel}) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (
//     <>
//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="bg-gray-50 text-slate-900 font-medium px-4 py-2 rounded-lg"
//       >
//         {buttonLabel}
//       </button>

//       {/* Show Modal only when opened */}
//       {isModalOpen && (
//         <AddTeamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//            <AddTeamForm />
//         </AddTeamModal>
//       )}
//     </>
//   );
// };

// export default ModalButton;