import { auth } from "@/app/auth";
import AdminGridStates from "../_components/AdminGridStates";
import AdminManageConversations from "../_components/manage-datatables/AdminManageConversations";
import AdminManageNotifications from "../_components/manage-datatables/AdminManageNotifications";
import AdminManageTasks from "../_components/manage-datatables/AdminManageTasks";
import AdminManageTeams from "../_components/manage-datatables/AdminManageTeams";
import AdminManageUsers from "../_components/manage-datatables/AdminManageUsers";
import { redirect } from "next/navigation";

async function fetchAllUsers() {
    const res = await fetch(`/api/admin/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }
  
    return res.json();
}

async function fetchAllTeams() {
    const res = await fetch(`/api/admin/teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch teams");
    }
  
    return res.json();
}

async function fetchAllTasks() {
    const res = await fetch(`/api/admin/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return res.json();
}

async function fetchAllNotifications() {
    const res = await fetch(`/api/admin/notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch notifications");
    }
    return res.json();
}

async function fetchAllConversations() {
    const res = await fetch(`/api/admin/conversations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch coversations");
    }
    return res.json();
}



const AdminDashboard = async () => {

  const session = await auth();

  if(!session) {
    return redirect('/login')
  }

  if(session.user?.role !== 'ADMIN') {
    return redirect('/')
  }


  const users = await fetchAllUsers();

  const tasks = await fetchAllTasks();

  const teams = await fetchAllTeams();

  const conversations = await fetchAllConversations();
  
  const notifications = await fetchAllNotifications();


  return (
    <div className="bg-black">
        <h1 className="mt-12 py-12 mx-auto text-3xl text-center text-white">Admin Dashboard</h1>
        <div className="container mx-auto my-5 py-6">
            <AdminGridStates users={users.data} tasks={tasks.data} teams={teams.data} conversations={conversations.data} notifications={notifications.data} />
        </div>

        {/* User Management */}
        <div className="container mx-auto my-5 py-6">
            <AdminManageUsers users={users.data} />
        </div>

         {/* Teams Management */}
         <div className="container mx-auto my-5 py-6">
            <AdminManageTeams teams={teams.data} />
        </div>

          {/* Tasks Management */}
          <div className="container mx-auto my-5 py-6">
            <AdminManageTasks tasks={tasks.data} />
         </div>

         {/* Conversation Management */}
         <div className="container mx-auto my-5 py-6">
            <AdminManageConversations conversations={conversations.data} />
        </div>

        
          {/* Notifications Management */}
          <div className="container mx-auto my-5 py-6">
            <AdminManageNotifications notifications={notifications.data} />
        </div>
    </div>
  )
}

export default AdminDashboard