'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaComments } from "react-icons/fa";  // Import React Icon for a chat icon

export default function ModalConversationButton({ teamInfo, currentUserId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");


  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    try {
        const res = await fetch(`/api/leader/conversation/create-conversation/${teamInfo?.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({title: title})
          });
      
          if (res.ok) {
            alert("Conversation Created!");
            router.refresh()
            setIsOpen(false);
          } else {
            const errData = await res.json();
            alert(errData.message)
            console.log("Failed to create conversation");
          }
    } catch (error) {
        console.log("Failed to create conversation", error);
    }

    
  };

  //Check if current user is the leader
    const isLeader = teamInfo?.leaderId === currentUserId;
    if (!isLeader) return null;

  return (
    <>
      <button
        disabled={teamInfo?.conversation?.teamId === teamInfo?.id}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gray-900 text-slate-200 rounded-lg shadow-lg px-4 py-2 hover:bg-indigo-700 disabled:bg-gray-500 transition duration-200"
      >
        <FaComments className="text-white" /> {/* React Icon for conversation */}
        + Create Conversation
      </button>

      {/* Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-[#1e1e1e] rounded-xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-white text-2xl font-bold mb-4">New Conversation</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Conversation Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
                />

                {/* <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="4"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
                /> */}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-200"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
