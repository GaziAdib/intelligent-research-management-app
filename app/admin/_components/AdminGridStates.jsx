'use client';

import { FaUsers, FaTasks, FaUsersCog, FaBell, FaComments } from "react-icons/fa";

const AdminStatsGrid = ({ users, teams, tasks, notifications, conversations }) => {
  const stats = [
    { title: "Users", data: users, icon: <FaUsers />, color: "bg-blue-600" },
    { title: "Teams", data: teams, icon: <FaUsersCog />, color: "bg-green-600" },
    { title: "Tasks", data: tasks, icon: <FaTasks />, color: "bg-yellow-600" },
    { title: "Notifications", data: notifications, icon: <FaBell />, color: "bg-red-600" },
    { title: "Conversations", data: conversations, icon: <FaComments />, color: "bg-purple-600" },
  ];

  return (
    <div className="min-h-screen p-10 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-xl flex flex-col items-center justify-center ${item.color} text-white transition-transform transform hover:scale-105 hover:shadow-2xl`}
          >
            <div className="text-5xl mb-4">{item.icon}</div>
            <h2 className="text-lg font-semibold uppercase">{item.title}</h2>
            <p className="text-3xl font-bold">{item.data.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStatsGrid;
