"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useSession } from "next-auth/react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const session = useSession();
  const currentUserId = session?.data?.user?.id;

  // Fetch notifications for the logged-in user
  useEffect(() => {
    if (!currentUserId) return; // Don't fetch if userId is not available

    const getNotifications = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3000/api/notifications/fetch-notifications?userId=${currentUserId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch notifications");

        const data = await res.json();
        setNotifications(data.data); // Set the fetched notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    getNotifications(); // Fetch notifications
  }, [currentUserId]); // Re-run effect if currentUserId changes

  // Subscribe to Pusher for real-time notifications
  useEffect(() => {
    if (!currentUserId) return; // Don't subscribe if userId is not available

    const pusher = new Pusher("fbd04a7c8844115f0fd9", {
      cluster: "us3",
      forceTLS: true,
    });

    //const channel = pusher.subscribe(`team-${currentUserId}`); // Subscribe to a user-specific channel
    //console.log("Subscribed to notifications channel:", `user-${currentUserId}`);

    const channel = pusher.subscribe(`user`)

    // Listen for new notifications
    channel.bind("send-notification", (data) => {
      console.log("New notification received:", data.notification);
      setNotifications((prev) => [data.notification, ...prev]); // Add new notification to the list
    });



    // Cleanup
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [currentUserId]); // Re-run effect if currentUserId changes

  return (
    <div className="notifications-container bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>

      {loading ? (
        <p className="text-gray-400">Loading notifications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-400">No new notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="notification-item p-2  mb-2 rounded-lg shadow-md hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {/* Notification Icon */}
                <div className="flex-shrink-0">
                  {notification.type === "TASK_APPROVED" ? (
                    <span className="bg-green-500 text-white p-2 rounded-full">
                      ✔️
                    </span>
                  ) : notification.type === "TASK_REJECTED" ? (
                    <span className="bg-red-500 text-white p-2 rounded-full">
                      ❌
                    </span>
                  ) : (
                    <span className="bg-blue-500 text-white p-2 rounded-full">
                      ℹ️
                  </span>
                  )}
                </div>

                {/* Notification Content */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-200">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;















// "use client";

// import { useEffect, useState } from "react";
// import Pusher from "pusher-js";
// import { useSession } from "next-auth/react";



// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const session = useSession();
//   const currentUserId = session?.data?.user?.id;

//   useEffect(() => {
//     if (!currentUserId) return; // Don't fetch if userId is not available

//     const getNotifications = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`http://localhost:3000/api/notifications/fetch-notifications?userId=${currentUserId}`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           });
        
//         if (!res.ok) throw new Error("Failed to fetch messages");
//         const data = await res.json();
//         setNotifications(data.data); // Set the fetched notifications
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//         setError("Failed to fetch notifications");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getNotifications(); // Fetch notifications
//   }, [currentUserId]); // Re-run effect if currentUserId changes

  


// //   notification: {
// //     id: newNotification?.id,
// //     message: newNotification?.message,
// //     type: newNotification?.type,
// //     taskId: newNotification?.taskId,
// //     teamId: newNotification?.teamId,
// //     createdAt: newNotification?.createdAt,
// //   },

// console.log('Notifications', notifications)

// //   useEffect(() => {
// //     const pusher = new Pusher("fbd04a7c8844115f0fd9", {
// //       cluster: "us3",
// //       forceTLS: true,
// //     });


// //     const channel = pusher.subscribe(`team`);
// //    // console.log("Subscribed to notifications channel:", `team-${teamId}`);

// //     // Listen for new notifications
// //     channel.bind("send-notification", (data) => {
// //       console.log("New notification received:", data.notification);
// //       setNotifications((prev) => [data.notification, ...prev]);
// //     });

// //     // Cleanup
// //     return () => {
// //       channel.unbind_all();
// //       channel.unsubscribe();
// //       pusher.disconnect();
// //     };
// //   }, [teamId]);

//   return (
//     <div className="notifications-container">
//       <h2>Notifications</h2>
//       {notifications?.length === 0 ? (
//         <p>No new notifications.</p>
//       ) : (
//         <ul>
//           {notifications?.map((notification) => (
//             <li key={notification?.id} className="notification-item">
//               <p>{notification?.message}</p>
//               <small>
//                 {new Date(notification?.createdAt).toLocaleString()}
//               </small>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Notifications;

// {/* <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{notifications.length}</span> */}