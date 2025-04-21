"use client";

import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import Pusher from "pusher-js";

const TaskLists = ({ tasks: initialTasks, teamId }) => {
  // Initialize state with initialTasks, defaulting to an empty array if undefined
  const [tasks, setTasks] = useState(initialTasks || []);

  useEffect(() => {
    // Ensure initialTasks is used to update state if it changes
    setTasks(initialTasks || []);
  }, [initialTasks]);

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "us3",
      forceTLS: true,
      enabledTransports: ["ws", "wss"],
    });

    // Subscribe to the team channel
    const channel = pusher.subscribe(`team-${teamId}`);
    
    // Bind to task-approved event
    channel.bind("task-approved", (data) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === data.taskId ? { ...task, status: data.status } : task
        )
      );
    });

    // Bind to task-rejected event
    channel.bind("task-rejected", (data) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === data.taskId ? { ...task, status: data.status } : task
        )
      );
    });

    
    return () => {
      channel.unbind_all();
      channel.unsubscribe(); 
      pusher.disconnect();
    };
  }, [teamId]); 

  return (
    <div className="min-h-screen  text-white p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskLists;


