"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaComments } from "react-icons/fa";

export default function ChatPopup({ conversationId, teamId, messages }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession();
  const currentUserId = session?.data?.user?.id;

  const messagesEndRef = useRef(null);

  // Scroll to the bottom of messages when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (message.trim()) {
      try {
        setLoading(true);
        const res = await fetch(`/api/messages/send-message/${conversationId}/${teamId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: message }),
        });

        if (res.ok) {
          setLoading(false);
          router.refresh(); // This should trigger fetching the new messages
          setMessage(""); // Clear input
        } else {
          const errorData = await res.json();
          alert('Error', errorData.message);
          setLoading(false);
        }
      } catch (error) {
        alert('Something went wrong!');
        console.error(error);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50"
      >
        <FaComments />
      </button>

      {isChatOpen && (
        <div className="fixed bottom-16 right-6 w-100 bg-[#1a1a1a] text-white shadow-xl rounded-lg p-4 z-50 border border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">Chat</h2>
            <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white">X</button>
          </div>

          <div className="h-72 overflow-y-auto mb-4 bg-gradient-to-br from-gray-960 via-gray-800 to-indigo-900">
            {messages?.length === 0 ? (
              <div className="text-center text-gray-400">No messages yet.</div>
            ) : (
              messages?.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 ${msg.senderId === currentUserId ? "text-right" : "text-left"}`}
                >
                  <div className={`flex items-start space-x-2 ${msg.senderId === currentUserId ? "justify-end" : ""}`}>
                    {msg.senderId !== currentUserId && (
                      <img
                        src={msg?.sender?.profileImageUrl || "/default-avatar.png"}
                        alt={`${msg?.sender?.username}'s profile`}
                        className="w-8 h-8 mx-2 rounded-full object-cover"
                      />
                    )}
                    <div className={`max-w-xs px-2 py-2`}>
                      {msg.senderId !== currentUserId && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{msg?.sender?.username}</span>
                        </div>
                      )}
                      <div
                        className={`inline-block px-4 py-2 text-justify rounded-xl mt-1 ${
                          msg.senderId === currentUserId
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-800 text-white"
                        }`}
                      >
                        {msg?.content}
                      </div>
                    </div>
                    {msg.senderId === currentUserId && (
                      <img
                        src={msg?.sender?.profileImageUrl || "/default-avatar.png"}
                        alt={`${msg?.sender?.username}'s profile`}
                        className="w-8 h-8 rounded-full my-3 mx-2 object-cover"
                      />
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} /> {/* 👈 Scroll target */}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-gray-800 text-white p-3 rounded-lg placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="ml-3 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}




// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { FaComments } from "react-icons/fa";

// export default function ChatPopup({ conversationId, teamId, messages}) {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const session = useSession();
//   const currentUserId = session?.data?.user?.id;

// //   console.log("Messages", messagess);

//   // Fetch messages when the chat is opened
// //   useEffect(() => {
// //     const fetchMessages = async () => {
// //       try {
// //         const response = await fetch(`/api/messages/fetch-messages/${conversationId}`, {
// //           method: "GET",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //         });

// //         if (!response.ok) {
// //           throw new Error("Failed to fetch messages");
// //         }

// //         const data = await response.json();
// //         setMessages(data.data); // Replace the messages with the fetched ones
// //       } catch (error) {
// //         console.error(error);
// //       }
// //     };

// //     if (isChatOpen) {
// //       fetchMessages();
// //     }
// //   }, [isChatOpen, conversationId]); // Only trigger when isChatOpen or conversationId changes




//   // Handle sending messages
//   const handleSendMessage = async (e) => {
//     e.preventDefault();

//     if (message.trim()) {
//       try {
//         setLoading(true)
//         const res = await fetch(`/api/messages/send-message/${conversationId}/${teamId}`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ content: message }),
//         });

//         if (res.ok) {
//             setLoading(false)
//             router.refresh();
//           //alert("Message sent");
//           // Simulate bot response after sending a message
//         //   setMessages((prevMessages) => [
//         //     ...prevMessages,
//         //     { content: message, senderId: currentUserId },
//         //   ]);
//           setMessage(""); // Clear the input field after sending the message
//         } else {
//           const errorData = await res.json();
//           alert('Error', errorData.message);
//           setLoading(false)
//         }
//       } catch (error) {
//         alert('Something went wrong!');
//         console.error(error);
//         setLoading(false)
//       }
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={() => setIsChatOpen(!isChatOpen)}
//         className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50"
//       >
//         <FaComments />
//       </button>

//       {isChatOpen && (
//         <div
//           className="fixed bottom-16 right-6 w-100 bg-[#1a1a1a] text-white shadow-xl rounded-lg p-4 z-50 border border-gray-700"
//         >
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="text-xl font-bold">Chat</h2>
//             <button
//               onClick={() => setIsChatOpen(false)}
//               className="text-gray-400 hover:text-white"
//             >
//               X
//             </button>
//           </div>

//           <div className="h-72 overflow-y-auto mb-4">
//   {messages?.length === 0 ? (
//     <div className="text-center text-gray-400">No messages yet.</div>
//   ) : (
//     messages?.map((msg, index) => (
//       <div
//         key={index}
//         className={`mb-3 ${
//           msg.senderId === currentUserId ? "text-right" : "text-left"
//         }`}
//       >
//         <div className={`flex items-start space-x-2 ${msg.senderId === currentUserId ? "justify-end" : ""}`}>
//           {/* Display sender's profile image */}
//           {msg.senderId !== currentUserId && (
//             <img
//               src={msg?.sender?.profileImageUrl || "/default-avatar.png"} // Default image if not provided
//               alt={`${msg?.sender?.username}'s profile`}
//               className="w-8 h-8 mx-2 rounded-full object-cover"
//             />
//           )}

//           <div className={`max-w-xs px-2 py-2 ${msg.senderId === currentUserId ? "text-right" : "text-left"}`}>
//             {/* Display sender's username on the same line */}
//             {msg.senderId !== currentUserId && (
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm">{msg?.sender?.username}</span>
//               </div>
//             )}

//             {/* Display message content */}
//             <div
//               className={`inline-block px-4 py-2 rounded-xl mt-1 ${
//                 msg.senderId === currentUserId
//                   ? "bg-indigo-600 rounded-2xl text-white"
//                   : "bg-gray-800 rounded-2xl text-white"
//               }`}
//             >
//               {msg?.content}
//             </div>
//           </div>

//           {/* Display the current user's profile image on the right */}
//           {msg.senderId === currentUserId && (
//             <img
//               src={msg?.sender?.profileImageUrl || "/default-avatar.png"} // Default image if not provided
//               alt={`${msg?.sender?.username}'s profile`}
//               className="w-8 h-8 rounded-full my-3 mx-2 object-cover"
//             />
//           )}
//         </div>
//       </div>
//     ))
//   )}
// </div>





//           <form onSubmit={handleSendMessage} className="flex items-center">
//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type your message..."
//               className="w-full bg-gray-800 text-white p-3 rounded-lg placeholder-gray-400 focus:outline-none"
//             />
//             <button
//               type="submit"
//               className="ml-3 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all"
//             >
//               {loading ? 'Sending' : 'Send'}
//             </button>
//           </form>
//         </div>
//       )}
//     </>
//   );
// }



// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { FaComments } from "react-icons/fa";

// export default function ChatPopup({conversationId, teamId}) {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
// //   const [messages, setMessages] = useState([
// //     { text: "Hi! How can I assist you today?", sender: "bot" },
// //   ]);


//   const router = useRouter();

//   const session = useSession();

//   const currentUserId = session?.data?.user?.id;

//   console.log('Messages', messages);

//   useEffect(() => {

//     const fetchMessages = async () => {
//         try {
//           const response = await fetch(`/api/messages/fetch-messages/${conversationId}`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           });
  
//           if (!response.ok) {
//             throw new Error("Failed to fetch messages");
//           }
  
//           const data = await response.json();
//           setMessages(data.data);
//         } catch (error) {
//           console.error(error);
//         }
//     }

//     if (isChatOpen) {
//          fetchMessages();
//       }
//   }, [isChatOpen, messages])
  
//   const handleSendMessage = async (e) => {
//     e.preventDefault();

//     try {
//         const res = await fetch(`/api/messages/send-message/${conversationId}/${teamId}`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({content: message}),
//         });
//         if (res.ok) {
//             //alert("Message sent");
//             setMessages((prevMessages) => [
//                 ...prevMessages,
//                 { content: message, senderId: currentUserId },
//               ]);
//             // toast.success("Registration successful!");
//             // router.refresh()
//             // const messageData = await res.data;
//             // setMessages((prevMessage) => [...prevMessage, messageData]);
//         } else {
//             const errorData = await res.json();
//             alert('Error', errorData.message)
//             // toast.error(errorData.message);
//         }
//     } catch (error) {
//         alert('Something went wrong!')
//         // toast.error("Something went wrong");
//     }
//     // if (message.trim()) {
//     //   setMessages([...messages, { text: message, sender: "user" }]);
//     //   setMessage("");

//     //   // Simulate bot response
//     //   setTimeout(() => {
//     //     setMessages((prevMessages) => [
//     //       ...prevMessages,
//     //       { text: "I am here to help!", sender: "bot" },
//     //     ]);
//     //   }, 1000);
//     // }
//   };

//   return (
//     <>
//       <button
//         onClick={() => setIsChatOpen(!isChatOpen)}
//         className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50"
//       >
//         <FaComments />
//       </button>

//       {isChatOpen && (
//         <div
//           className="fixed bottom-16 right-6 w-80 bg-[#1a1a1a] text-white shadow-xl rounded-lg p-4 z-50 border border-gray-700"
//         >
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="text-xl font-bold">Chat</h2>
//             <button
//               onClick={() => setIsChatOpen(false)}
//               className="text-gray-400 hover:text-white"
//             >
//               X
//             </button>
//           </div>
//           <div className="h-72 overflow-y-auto mb-4">
//             {messages?.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`mb-3 ${
//                   msg?.senderId === currentUserId  ? "text-right" : "text-left"
//                 }`}
//               >
//                 <div
//                   className={`inline-block px-4 py-2 rounded-xl ${
//                     !msg?.senderId
//                       ? "bg-indigo-600 text-white"
//                       : "bg-gray-800 text-white"
//                   }`}
//                 >
//                   {msg?.content}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <form onSubmit={handleSendMessage} className="flex items-center">
//             <input
//               type="text"
//               value={message}
//               name="content"
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type your message..."
//               className="w-full bg-gray-800 text-white p-3 rounded-lg placeholder-gray-400 focus:outline-none"
//             />
//             <button
//               type="submit"
//               className="ml-3 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all"
//             >
//               Send
//             </button>
//           </form>
//         </div>
//       )}
//     </>
//   );
// }
