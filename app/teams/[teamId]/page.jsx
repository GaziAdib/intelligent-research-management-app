import { auth } from "@/app/auth";
import { Suspense, lazy } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

// Lazy loaded components
const ModalTaskButton = lazy(() => import("./_components/buttons/ModalTaskButton"));
const TaskLists = lazy(() => import("./_components/TaskLists"));
const MemberLists = lazy(() => import("../_components/MemberLists"));
const ModalConversationButton = lazy(() => import("./_components/modals/ConversationModalButton"));
const ChatPopup = lazy(() => import("@/app/components/ChatPopup"));
const Pagination = lazy(() => import("./_components/pagination/Pagination"));
const SearchTasks = lazy(() => import("./_components/search/SearchTasks"));
const FilterTasks = lazy(() => import("./_components/filter/FilterTasks"));
const MergeTasks = lazy(() => import("./_components/buttons/MergeTasks"));

// Improved API caller for real-time data
async function fetchAPI(url) {
  try {
    // Using timestamp to ensure we always get fresh data
    const timestamp = Date.now();
    const separator = url.includes('?') ? '&' : '?';
    const urlWithTimestamp = `${url}${separator}_t=${timestamp}`;
    
    const res = await fetch(urlWithTimestamp, {
      cache: 'no-store',
      next: { revalidate: 0 }, // Disable Next.js caching completely
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!res.ok) {
      console.error(`Error response: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch: ${url}`);
    }
    
    return res.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return { data: null, error: error.message };
  }
}

// Optimized fetchers with better real-time support
async function fetchSingleTeamInfo(teamId) {
  return fetchAPI(`http://localhost:3000/api/teams/${teamId}`);
}

async function fetchTasks(teamId, pageNumber, status, query = "") {

  const baseUrl = new URL(`http://localhost:3000/api/tasks/${teamId}`);
  

  if (query && query.trim() !== '') baseUrl.searchParams.append("query", query);
  if (pageNumber) baseUrl.searchParams.append("pageNumber", pageNumber.toString());
  if (status && status !== 'undefined' && status !== 'null') {
    baseUrl.searchParams.append("status", status);
  }
  
  
  return fetchAPI(baseUrl.toString());
}

async function fetchConversationMessages(conversationId, teamId) {
  return fetchAPI(`http://localhost:3000/api/messages/fetch-messages/${conversationId}/${teamId}`);
}

async function fetchMergeContents(teamId, userId) {
  return fetchAPI(`http://localhost:3000/api/leader/merged-contents?userId=${userId}&teamId=${teamId}`);
}

// Loading fallback components
const LoadingTaskList = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-12 bg-gray-700 rounded w-full"></div>
    <div className="h-12 bg-gray-700 rounded w-full"></div>
    <div className="h-12 bg-gray-700 rounded w-full"></div>
  </div>
);

const LoadingMembers = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-10 bg-gray-700 rounded w-full"></div>
    <div className="h-10 bg-gray-700 rounded w-full"></div>
  </div>
);

const TeamDetail = async ({ params, searchParams }) => {

  const { teamId } = await params;
  const { user } = await auth();
  const currentUserId = user?.id;

  // Handle auth and role wide redirection

  if (!user) return redirect('/login');
  if (user?.role === 'ADMIN') return redirect('/admin/dashboard');
  if (user?.role === 'USER') return redirect('/');
  
 
  const search = await searchParams || {};

  const status = search.status ?? null;
  const query = search.query ?? "";
  const pageNumber = search.pageNumber ? Number(search.pageNumber) : 1;



  // Force revalidation for each request by adding a unique timestamp
  const requestTimestamp = Date.now();

  // Parallel data fetching with proper error handling
  let teamInfo, tasks = [], totalPages = 1;
  
  try {
    // Fetch team info and tasks in parallel
    const [teamInfoResult, tasksResult] = await Promise.all([
      fetchSingleTeamInfo(teamId),
      fetchTasks(teamId, pageNumber, status, query)
    ]);

    teamInfo = teamInfoResult.data;
    tasks = tasksResult?.data || [];
    totalPages = tasksResult?.totalPages || 1;
    
  } catch (error) {
    console.error("Error loading data:", error);

  }

  // Only fetch conversation messages if a conversation exists
  let messages = { data: [] };
  if (teamInfo?.conversation?.id) {
    try {
      const messagesResult = await fetchConversationMessages(teamInfo?.conversation?.id, teamId);
      messages = messagesResult || { data: [] };
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }

  // Only fetch merged content if needed
  let mergedContentData = { data: null };
  try {
    mergedContentData = await fetchMergeContents(teamInfo?.id, user?.id);
  } catch (error) {
    console.error("Error loading merged content:", error);
  }

  return (
    <div className="container mx-auto py-8 mt-5">
      <div className="min-h-screen  text-white p-4 md:p-6">
        {/* Debug info - remove in production */}
        <div className="text-xs text-gray-500 mb-2">
          Request time: {new Date(requestTimestamp).toISOString()}
          {status && <span> | Status filter: {status}</span>}
        </div>
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold">📋 Team Tasks</h1>
          <Suspense fallback={<div className="w-36 h-10 bg-gray-700 rounded animate-pulse"></div>}>
            <ModalConversationButton teamInfo={teamInfo} currentUserId={currentUserId} />
          </Suspense>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center sm:justify-start mb-4">
          <Suspense fallback={<div className="w-28 h-10 bg-gray-700 rounded animate-pulse"></div>}>
            <ModalTaskButton buttonLabel="+ Add task" teamInfo={teamInfo} />
          </Suspense>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tasks Section */}
          <div className="md:col-span-2 lg:col-span-3 bg-[#131319] rounded-2xl p-4 shadow-xl">
            <div className="flex flex-col md:flex-row gap-6 items-center mt-2 mb-6">
              <Suspense fallback={<div className="w-full h-10 bg-gray-700 rounded animate-pulse"></div>}>
                <SearchTasks />
              </Suspense>
              <Suspense fallback={<div className="w-full h-10 bg-gray-700 rounded animate-pulse"></div>}>
                <FilterTasks currentStatus={status} />
              </Suspense>
              
            </div>

            {tasks?.length === 0 ? (
              <div className="text-gray-400 text-center mt-10">
                <h2 className="text-xl">
                  {status ? `No tasks with status "${status}" found.` : "No tasks created yet."}
                </h2>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <Suspense fallback={<div className="w-full h-10 bg-gray-700 rounded animate-pulse"></div>}>
                  <MergeTasks teamId={teamId}  leaderId={teamInfo?.leaderId} mergedData={mergedContentData?.data} />
                </Suspense>

                {mergedContentData?.data && (
                  <Link
                    href={`/tasks/merged-tasks/${mergedContentData?.data?.teamId}`}
                    className="inline-flex items-center px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-shadow duration-300 shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 4h1a2 2 0 001-3.732M12 6v6h4l1 2h-5.268a4.992 4.992 0 01-.732-1.732M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                    View Merged Content
                  </Link>
                )}
              </div>
              
                <Suspense fallback={<LoadingTaskList />}>
                  <TaskLists tasks={tasks} teamId={teamId} />
                </Suspense>

          
                
                {tasks?.length > 0 && (
                  <div className="mt-4">
                    <Suspense fallback={<div className="w-full h-10 bg-gray-700 rounded animate-pulse"></div>}>
                      <Pagination totalPages={totalPages} currentStatus={status} />
                    </Suspense>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Members Section */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg lg:text-2xl font-bold mb-4 text-center">👥 Members</h2>
            <Suspense fallback={<LoadingMembers />}>
              <MemberLists members={teamInfo?.teamMembers} />
            </Suspense>
          </div>
        </div>

        {/* Chat Popup */}
        <div className="fixed bottom-4 right-4 lg:static lg:mt-6">
          {teamInfo?.conversation?.id && (
            <Suspense fallback={<div className="w-16 h-16 rounded-full bg-gray-700 animate-pulse"></div>}>
              <ChatPopup 
                conversationId={teamInfo.conversation.id} 
                teamId={teamId} 
                messages={messages.data} 
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;


















// import { auth } from "@/app/auth";
// import ModalTaskButton from "./_components/buttons/ModalTaskButton";
// import TaskLists from "./_components/TaskLists";
// import MemberLists from "../_components/MemberLists";
// import ModalConversationButton from "./_components/modals/ConversationModalButton";
// import ChatPopup from "@/app/components/ChatPopup";
// import Pagination from "./_components/pagination/Pagination";
// import SearchTasks from "./_components/search/SearchTasks";
// import FilterTasks from "./_components/filter/FilterTasks";
// import { redirect } from "next/navigation";
// import MergeTasks from "./_components/buttons/MergeTasks";
// import MergedContentReader from "@/app/tasks/_components/MergedContentReader";

// async function fetchSingleTeamInfo(teamid) {
//   const res = await fetch(`http://localhost:3000/api/teams/${teamid}`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   });

//   if (!res.ok) throw new Error("Failed to fetch teams");

//   return res.json();
// }

// const fetchTasks = async (teamId, pageNumber, currentStatus, query = "") => {
//   try {
//     const baseUrl = `http://localhost:3000/api/tasks/${teamId}`;
//     const url = new URL(baseUrl);

//     if (query) url.searchParams.append("query", query);
//     if (pageNumber) url.searchParams.append("pageNumber", pageNumber);
//     if (currentStatus) url.searchParams.append("status", currentStatus);

//     const res = await fetch(url, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     });

//     if (!res.ok) throw new Error("Failed to fetch tasks");

//     return res.json();
//   } catch (error) {
//     console.log("Error fetching tasks:", error);
//     return [];
//   }
// };

// async function fetchConversationMessages(conversationId, teamId) {
//   const res = await fetch(
//     `http://localhost:3000/api/messages/fetch-messages/${conversationId}/${teamId}`,
//     {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     }
//   );

//   if (!res.ok) throw new Error("Failed to fetch messages");

//   return res.json();
// }


// async function fetchMergeContents(teamId, userId) {
//   const res = await fetch(`http://localhost:3000/api/leader/merged-contents?userId=${userId}&teamId=${teamId}`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   });

//   if (!res.ok) throw new Error("Failed to fetch teams");

//   return res.json();
// }

// const TeamDetail = async ({ params, searchParams }) => {
//   const { teamId } = await params;
//   const { user } = await auth();
//   const currentUserId = user?.id;

//    if(!user) {
//       return redirect('/login')
//     }

//     if(user?.role === 'ADMIN') {
//       return redirect('/admin/dashboard')
//     }
    
//     if(user?.role === 'USER') {
//       return redirect('/')
//     }  
  
//   const { status, query, pageNumber } = await searchParams;

//   let pageNumber1 = pageNumber ? Number(pageNumber) : 1;

//   // this is for single tean Info 
//   let teamInfo = await fetchSingleTeamInfo(teamId);
//   teamInfo = teamInfo.data;

//   // fetch tasks by sttaus or pagination etc or query
//   let data = await fetchTasks(teamId, pageNumber1, status, query);
//   let tasks = data?.data;
//   let totalPages = data?.totalPages;


//   // this is for comversations for chat messages
//   let conversationsId = teamInfo?.conversation?.id;
//   let messages = await fetchConversationMessages(conversationsId, teamId);

//   // merge approved tasks

//   const mergedContentData = await fetchMergeContents(teamInfo.id, user.id)

//   console.log('Merged contentsss', mergedContentData?.data);


//   return (
//     <div className="container mx-auto py-10 mt-5">
//   <div className="min-h-screen text-white p-4 md:p-6">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <h1 className="text-3xl sm:text-4xl font-extrabold">📋 Team Tasks</h1>
//         <ModalConversationButton teamInfo={teamInfo} currentUserId={currentUserId} />
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-center sm:justify-start mb-4">
//         <ModalTaskButton buttonLabel={"+ Add task"} teamInfo={teamInfo} />
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {/* Tasks Section */}
//         <div className="md:col-span-2 lg:col-span-3 bg-[#1a1a1a] rounded-2xl p-4 shadow-xl">
//           <div className="flex flex-col md:flex-row gap-6 items-center mt-2 mb-6">
//             <SearchTasks />
//             <FilterTasks />
//           </div>

//           {tasks?.length === 0 ? (
//             <div className="text-gray-400 text-center mt-10">
//               <h2 className="text-xl">No tasks created yet.</h2>
//             </div>
//           ) : (
//             <>
//               <MergeTasks teamId={teamId} leaderId={teamInfo?.leaderId} />

//               <TaskLists tasks={tasks} teamId={teamId} />

//               <div className="">
//                 <MergedContentReader mergedContent={mergedContentData?.data}/>
//               </div>
              
//               {tasks?.length > 0 && (
//                 <div className="mt-4">
//                   <Pagination totalPages={totalPages} />
//                 </div>
//               )}
//             </>
//           )}
//         </div>

        

//         {/* Members Section */}
//         <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-xl">
//           <h2 className="text-lg lg:text-2xl font-bold mb-4 text-center">👥 Members</h2>
//           <MemberLists members={teamInfo?.teamMembers} />
//         </div>
//       </div>

//       {/* Chat Popup */}
//       <div className="fixed bottom-4 right-4 lg:static lg:mt-6">
//         {
//           teamInfo?.conversation?.id &&  <ChatPopup conversationId={teamInfo?.conversation?.id} teamId={teamId} messages={messages.data} />
//         }
//       </div>
//     </div>
//     </div>
   
//   );
// };

// export default TeamDetail;





// import { auth } from "@/app/auth";
// import ModalTaskButton from "./_components/buttons/ModalTaskButton";
// import TaskLists from "./_components/TaskLists";
// import MemberLists from "../_components/MemberLists";
// import ModalConversationButton from "./_components/modals/ConversationModalButton";
// import ChatPopup from "@/app/components/ChatPopup";
// import Pagination from "./_components/pagination/Pagination";
// import SearchTasks from "./_components/search/SearchTasks";
// import FilterTasks from "./_components/filter/FilterTasks";
// import { redirect } from "next/navigation";
// import MergeTasks from "./_components/buttons/MergeTasks";
// import TaskShowMergedContents from "./_components/TaskShowMergedContents";

// async function fetchSingleTeamInfo(teamid) {
//   const res = await fetch(`http://localhost:3000/api/teams/${teamid}`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   });

//   if (!res.ok) throw new Error("Failed to fetch teams");

//   return res.json();
// }

// const fetchTasks = async (teamId, pageNumber, currentStatus, query = "") => {
//   try {
//     const baseUrl = `http://localhost:3000/api/tasks/${teamId}`;
//     const url = new URL(baseUrl);

//     if (query) url.searchParams.append("query", query);
//     if (pageNumber) url.searchParams.append("pageNumber", pageNumber);
//     if (currentStatus) url.searchParams.append("status", currentStatus);

//     const res = await fetch(url, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     });

//     if (!res.ok) throw new Error("Failed to fetch tasks");

//     return res.json();
//   } catch (error) {
//     console.log("Error fetching tasks:", error);
//     return [];
//   }
// };

// async function fetchConversationMessages(conversationId, teamId) {
//   const res = await fetch(
//     `http://localhost:3000/api/messages/fetch-messages/${conversationId}/${teamId}`,
//     {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     }
//   );

//   if (!res.ok) throw new Error("Failed to fetch messages");

//   return res.json();
// }


// async function fetchMergeContents(leaderId) {
//   const res = await fetch(`http://localhost:3000/api/leader/merged-contents?userId=${leaderId}`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   });

//   if (!res.ok) throw new Error("Failed to fetch teams");

//   return res.json();
// }

// const TeamDetail = async ({ params, searchParams }) => {
//   const { teamId } = await params;
//   const { user } = await auth();
//   const currentUserId = user?.id;

//    if(!user) {
//       return redirect('/login')
//     }

//     if(user?.role === 'ADMIN') {
//       return redirect('/admin/dashboard')
//     }
    
//     if(user?.role === 'USER') {
//       return redirect('/')
//     }  
  
//   const { status, query, pageNumber } = await searchParams;

//   let pageNumber1 = pageNumber ? Number(pageNumber) : 1;

//   // this is for single tean Info 
//   let teamInfo = await fetchSingleTeamInfo(teamId);
//   teamInfo = teamInfo.data;

//   // fetch tasks by sttaus or pagination etc or query
//   let data = await fetchTasks(teamId, pageNumber1, status, query);
//   let tasks = data?.data;
//   let totalPages = data?.totalPages;


//   // this is for comversations for chat messages
//   let conversationsId = teamInfo?.conversation?.id;
//   let messages = await fetchConversationMessages(conversationsId, teamId);

//   // merge approved tasks

//   const mergedContentData = await fetchMergeContents(teamInfo?.leaderId)

//   console.log('Merged contentsss', mergedContentData?.data);


//   return (
//     <div className="container mx-auto py-10 mt-5">
//   <div className="min-h-screen text-white p-4 md:p-6">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <h1 className="text-3xl sm:text-4xl font-extrabold">📋 Team Tasks</h1>
//         <ModalConversationButton teamInfo={teamInfo} currentUserId={currentUserId} />
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-center sm:justify-start mb-4">
//         <ModalTaskButton buttonLabel={"+ Add task"} teamInfo={teamInfo} />
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {/* Tasks Section */}
//         <div className="md:col-span-2 lg:col-span-3 bg-[#1a1a1a] rounded-2xl p-4 shadow-xl">
//           <div className="flex flex-col md:flex-row gap-6 items-center mt-2 mb-6">
//             <SearchTasks />
//             <FilterTasks />
//           </div>

//           {tasks?.length === 0 ? (
//             <div className="text-gray-400 text-center mt-10">
//               <h2 className="text-xl">No tasks created yet.</h2>
//             </div>
//           ) : (
//             <>
//               <MergeTasks teamId={teamId} leaderId={teamInfo?.leaderId} />

//               <TaskLists tasks={tasks} teamId={teamId} />

//               <div className="">
//                 <TaskShowMergedContents mergedContent={mergedContentData?.data}/>
//              </div>
              
//               {tasks?.length > 0 && (
//                 <div className="mt-4">
//                   <Pagination totalPages={totalPages} />
//                 </div>
//               )}
//             </>
//           )}
//         </div>

        

//         {/* Members Section */}
//         <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-xl">
//           <h2 className="text-lg lg:text-2xl font-bold mb-4 text-center">👥 Members</h2>
//           <MemberLists members={teamInfo?.teamMembers} />
//         </div>
//       </div>

//       {/* Chat Popup */}
//       <div className="fixed bottom-4 right-4 lg:static lg:mt-6">
//         {
//           teamInfo?.conversation?.id &&  <ChatPopup conversationId={teamInfo?.conversation?.id} teamId={teamId} messages={messages.data} />
//         }
//       </div>
//     </div>
//     </div>
   
//   );
// };

// export default TeamDetail;




// import { auth } from "@/app/auth";
// import ModalTaskButton from "./_components/buttons/ModalTaskButton";
// import TaskLists from "./_components/TaskLists";
// import MemberLists from "../_components/MemberLists";
// import ModalConversationButton from "./_components/modals/ConversationModalButton";
// import ChatPopup from "@/app/components/ChatPopup";
// import Pagination from "./_components/pagination/Pagination";
// import SearchTasks from "./_components/search/SearchTasks";
// import FilterTasks from "./_components/filter/FilterTasks";



// async function fetchSingleTeamInfo(teamid) {
//   const res = await fetch(`http://localhost:3000/api/teams/${teamid}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!res.ok) throw new Error("Failed to fetch teams");

//   return res.json();
// }


// // async function fetchTasks(teamId, pageNumber, currentStatus) {
// //   // Use a ternary operator to conditionally construct the URL
// //   // const url = pageNumber
// //   //   ? `http://localhost:3000/api/tasks/${teamId}?pageNumber=${pageNumber.toString()}`
// //   //   : `http://localhost:3000/api/tasks/${teamId}`;

// //   const url = `http://localhost:3000/api/tasks/${teamId}?pageNumber=${pageNumber.toString()}&status=${currentStatus ? currentStatus: ''}`
// //   const res = await fetch(url, {
// //     method: "GET",
// //     headers: {
// //       "Content-Type": "application/json",
// //     }
// //   });

// //   if (!res.ok) throw new Error("Failed to fetch tasks");

// //   return res.json();
// // }


// const fetchTasks = async (teamId, pageNumber, currentStatus, query = '') => {
//   try {

//     // Construct the URL with query parameters
//     const baseUrl = `http://localhost:3000/api/tasks/${teamId}`;
//     const url = new URL(baseUrl);

//     // if query is available
//     if (query) {
//       url.searchParams.append('query', query); // Add query filter
//     }

//     if (pageNumber) {
//       url.searchParams.append('pageNumber', pageNumber); // Add query filter
//     }

//     if (currentStatus) {
//       url.searchParams.append('status', currentStatus); // Add query filter
//     }

//     // Fetch data
//     const res = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });

//     if (res.ok) {
//       const tasks = await res.json();
//       return tasks; // Return products data
//     } else {
//       console.log('Failed to fetch roadmaps');
//     }
//   } catch (error) {
//     console.log('Error fetching roadmaps:', error);
//   }

//   return [];
// };




//  async function fetchConversationMessages(conversationId, teamId) {
//     const res = await fetch(`http://localhost:3000/api/messages/fetch-messages/${conversationId}/${teamId}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
  
//     if (!res.ok) throw new Error("Failed to fetch messages");
  
//     return res.json();
//   }


// const TeamDetail = async ({ params, searchParams }) => {

//   const { teamId } = await params;

//   const { user } = await auth();
  
//   const currentUserId = user?.id;

//   const { status } = await searchParams;

//   const { query } = await searchParams;

//   let { pageNumber } = await searchParams;

//   let pageNumber1 = pageNumber ? Number(pageNumber) : 1; // Ensure pageNumber is a number

//   // fetch single team info
//   let teamInfo = await fetchSingleTeamInfo(teamId);
//   teamInfo = teamInfo.data;

//   // fetch all tasks 
//   let data = await fetchTasks(teamId, pageNumber1, status, query);
//   let tasks =  data?.data;
//   let totalPages =  data?.totalPages;


//   // fetch conversations for the team
//   let conversationsId = teamInfo?.conversation?.id;
//   let messages = await fetchConversationMessages(conversationsId, teamId);

//   return (
//     <div className="min-h-screen text-white p-6">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
//         <h1 className="text-3xl sm:text-4xl font-extrabold mt-8">📋 Team Tasks</h1>
//         <ModalConversationButton teamInfo={teamInfo} currentUserId={currentUserId} />
//       </div>

//       <div className="my-2 py-2 mx-10 px-2">
//         <ModalTaskButton buttonLabel={"+ Add task"} teamInfo={teamInfo} />
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-col lg:flex-row gap-6">
        
//         {/* Task List */}
//         <div className="w-full lg:w-3/4 rounded-2xl p-6 shadow-xl max-h-[80vh]">
//         <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
//           <SearchTasks  />
//           <FilterTasks  />
//         </div>
//           {tasks?.length === 0 ? (
//             <div className="text-gray-400 text-center mt-10">
//               <h2 className="text-xl">No tasks created yet.</h2>
//             </div>
//           ) : (
//             <>
//               <TaskLists tasks={tasks} teamId={teamId} />
//               <div className="my-10 py-2">
//                 {tasks?.length > 0 && <Pagination totalPages={totalPages} />}
//               </div>
//             </>
//           )}
//         </div>

//         <div>
//           <ChatPopup conversationId={teamInfo?.conversation?.id} teamId={teamId} messages={messages.data} />
//         </div>

//         {/* Members List */}
//         <div className="w-full lg:w-1/4 bg-[#1a1a1a] rounded-2xl p-6 shadow-xl max-h-[80vh] overflow-y-auto">
//           <h2 className="text-lg lg:text-2xl font-bold mb-4 text-center">👥 Members</h2>
//           <MemberLists members={teamInfo?.teamMembers} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeamDetail;













// // import { auth } from "@/app/auth";
// // import ModalTaskButton from "./_components/buttons/ModalTaskButton";
// // import TaskLists from "./_components/TaskLists";
// // import MemberLists from "../_components/MemberLists";
// // import ModalConversationButton from "./_components/modals/ConversationModalButton";
// // import ChatPopup from "@/app/components/ChatPopup";
// // import Pagination from "./_components/pagination/Pagination";

// // async function fetchSingleTeamInfo(teamid) {
// //   const res = await fetch(`http://localhost:3000/api/teams/${teamid}`, {
// //     method: "GET",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //   });

// //   if (!res.ok) throw new Error("Failed to fetch teams");

// //   return res.json();
// // }

// // async function fetchTasks(teamId, pageNumber) {
// //   // Use a ternary operator to conditionally construct the URL
// //   const url = pageNumber
// //     ? `http://localhost:3000/api/tasks/${teamId}?pageNumber=${pageNumber.toString()}`
// //     : `http://localhost:3000/api/tasks/${teamId}`;

// //     const res = await fetch(url, {
// //       method: "GET",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //   });

// //   if (!res.ok) throw new Error("Failed to fetch tasks");

// //   return res.json();
// // }

// // async function fetchConversationMessages(conversationId, teamId) {
// //   const res = await fetch(`http://localhost:3000/api/messages/fetch-messages/${conversationId}/$`, {
// //     method: "GET",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //   });

// //   if (!res.ok) throw new Error("Failed to fetch messages");

// //   return res.json();
// // }

// // const TeamDetail = async ({ params, searchParams }) => {

// //   const { teamId } = await params;
// //   const { user } = await auth();
  
// //   const currentUserId = user?.id;



// //   let { pageNumber } = await searchParams;

// //   console.log('page number', pageNumber)
  


// //   let teamInfo = await fetchSingleTeamInfo(teamId);
// //   teamInfo = teamInfo.data;

// //   // let currentPage = 1

// //   pageNumber = pageNumber ? pageNumber : 1



// //   let data = await fetchTasks(teamId, Number(pageNumber));
// //   let tasks = data?.data;
// //   let totalPages = data?.totalPages


// //   console.log('tasks length', tasks?.length)
// //   console.log('Total Pages', totalPages)


  
// //   let conversationsId = teamInfo?.conversation?.id;
// //   let messages = await fetchConversationMessages(conversationsId, teamId);


// //   return (
// //     <div className="min-h-screen  text-white p-6">
// //       {/* Header Section */}
// //       <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
// //         <h1 className="text-3xl sm:text-4xl font-extrabold mt-8">📋 Team Tasks</h1>
// //         <ModalConversationButton teamInfo={teamInfo} currentUserId={currentUserId} />
// //       </div>

// //       <div className="my-2 py-2 mx-10 px-2">
// //         <ModalTaskButton buttonLabel={'+ Add task'} teamInfo={teamInfo} />
// //       </div>


      

// //       {/* Main Content */}
// //       <div className="flex flex-col lg:flex-row gap-6">
// //         {/* Task List */}
// //         <div className="w-full lg:w-3/4  rounded-2xl p-6 shadow-xl  max-h-[80vh]">
// //           {tasks?.length === 0 ? (
// //             <div className="text-gray-400 text-center mt-10">
// //               <h2 className="text-xl">No tasks created yet.</h2>
// //             </div>
// //           ) : (
// //             <>
// //               <TaskLists tasks={tasks} teamId={teamId} />
// //               <div className="my-10 py-10">
// //               {tasks?.length > 0 && <Pagination totalPages={totalPages} />} 
// //               </div>
// //             </>
// //           )}
// //         </div>
        

// //         <div>
      
// //           <ChatPopup conversationId={teamInfo?.conversation?.id} teamId={teamId} messages={messages.data} /> 
           
// //         </div>

// //         {/* Members List */}
// //         <div className="w-full lg:w-1/4 bg-[#1a1a1a] rounded-2xl p-6 shadow-xl max-h-[80vh] overflow-y-auto">
// //           <h2 className="text-lg  lg:text-2xl font-bold mb-4 text-center">👥 Members</h2>
// //           <MemberLists members={teamInfo?.teamMembers} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default TeamDetail;


























// // import { auth } from "@/app/auth";
// // import ModalTaskButton from "./_components/buttons/ModalTaskButton";
// // import TaskLists from "./_components/TaskLists";
// // import MemberLists from "../_components/MemberLists";
// // import ModalConversationButton from "./_components/modals/ConversationModalButton";
// // import ChatPopup from "@/app/components/ChatPopup";

// // async function fetchSingleTeamInfo(teamid) {
// //   const res = await fetch(`http://localhost:3000/api/teams/${teamid}`, {
// //     method: "GET",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //   });

// //   if (!res.ok) throw new Error("Failed to fetch teams");

// //   return res.json();
// // }

// // async function fetchTasks(teamId, pageNum) {
// //   const res = await fetch(`http://localhost:3000/api/tasks/${teamId}?pageNumber=${pageNum}`, {
// //     method: "GET",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //   });

// //   if (!res.ok) throw new Error("Failed to fetch tasks");

// //   return res.json();
// // }


// // async function fetchConversationMessages(conversationId) {
// //   const res = await fetch(`http://localhost:3000/api/messages/fetch-messages/${conversationId}`, {
// //     method: "GET",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //   });

// //   if (!res.ok) throw new Error("Failed to fetch messages");

// //   return res.json();
// // }

// // const TeamDetail = async ({ params, searchParams }) => {

// //   const { teamId } = await params;
// //   const { user } = await auth();
  
// //   const currentUserId = user?.id;

// //   const { pageNumber } = await searchParams;
  
// //   let teamInfo = await fetchSingleTeamInfo(teamId);
// //   teamInfo = teamInfo.data;



// //   let data = await fetchTasks(teamId, pageNumber);
// //   let tasks = data?.data;

  

// //   let conversationsId = teamInfo?.conversation?.id;
// //   let messages = await fetchConversationMessages(conversationsId);


// //   return (
// //     <div className="min-h-screen  text-white p-6">
// //       {/* Header Section */}
// //       <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
// //         <h1 className="text-3xl sm:text-4xl font-extrabold mt-8">📋 Team Tasks</h1>
// //         <ModalConversationButton teamInfo={teamInfo} currentUserId={currentUserId} />
// //       </div>

// //       <div className="my-2 py-2 mx-10 px-2">
// //         <ModalTaskButton buttonLabel={'+ Add task'} teamInfo={teamInfo} />
// //       </div>


      

// //       {/* Main Content */}
// //       <div className="flex flex-col lg:flex-row gap-6">
// //         {/* Task List */}
// //         <div className="w-full lg:w-3/4  rounded-2xl p-6 shadow-xl  max-h-[80vh]">
// //           {tasks?.length === 0 ? (
// //             <div className="text-gray-400 text-center mt-10">
// //               <h2 className="text-xl">No tasks created yet.</h2>
// //             </div>
// //           ) : (
// //             <TaskLists tasks={tasks} teamId={teamId} />
// //           )}
// //         </div>
        

// //         <div>
      
// //           <ChatPopup conversationId={teamInfo?.conversation?.id} teamId={teamId} messages={messages.data} /> 
           
// //         </div>

// //         {/* Members List */}
// //         <div className="w-full lg:w-1/4 bg-[#1a1a1a] rounded-2xl p-6 shadow-xl max-h-[80vh] overflow-y-auto">
// //           <h2 className="text-lg  lg:text-2xl font-bold mb-4 text-center">👥 Members</h2>
// //           <MemberLists members={teamInfo?.teamMembers} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default TeamDetail;









// // // fetch teams from backend 

// // import { auth } from "@/app/auth";
// // import ModalTaskButton from "./_components/buttons/ModalTaskButton";
// // import TaskLists from "./_components/TaskLists";
// // import MemberLists from "../_components/MemberLists";
// // // import TaskLists from "./_components/TaskLists";


// // // async function fetchTeamsByUserId(userid) {
// // //   const res = await fetch(`http://localhost:3000/api/teams/fetch-teams/${userid}`, {
// // //     method: "GET",
// // //     headers: {
// // //       "Content-Type": "application/json",
// // //     },
// // //   });

// // //   if (!res.ok) {
// // //     throw new Error("Failed to fetch teams");
// // //   }

// // //   return res.json();
// // // }

// // async function fetchSingleTeamInfo(teamid) {
// //     // const token = localStorage.getItem("token"); // Assuming you store your token in localStorage or sessionStorage
  
// //     const res = await fetch(`http://localhost:3000/api/teams/${teamid}`, {
// //       method: "GET",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //     });
  
// //     if (!res.ok) {
// //       throw new Error("Failed to fetch teams");
// //     }
  
// //     return res.json();
// //   }

// // // async function fetchTeamsByUserId(userid) {
// // //   const res = await fetch(`http://localhost:3000/api/teams/fetch-teams/${userid}`, {
// // //     method: "GET",
// // //     headers: {
// // //       "Content-Type": "application/json",
// // //     },
// // //   });

// // //   if (!res.ok) {
// // //     throw new Error("Failed to fetch teams");
// // //   }

// // //   return res.json();
// // // }  


// // async function fetchTasks(teamId) {
// //   const res = await fetch(`http://localhost:3000/api/tasks/${teamId}`, {
// //     method: "GET",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //   });

// //   if (!res.ok) {
// //     throw new Error("Failed to fetch teams");
// //   }

// //   return res.json();
// // } 

// // const TeamDetail = async ({params}) => {

// //   const {teamId} = await params

// //   const { user } = await auth();

// //   const currentUserId = user?.id;


// //   let teamInfo = await fetchSingleTeamInfo(teamId)
// //    teamInfo = teamInfo.data

// //    console.log('TeamInfo', teamInfo)



// //     let data = await fetchTasks(teamId)
// //     let tasks = data?.data

// //     console.log('Tasks-----coming', tasks)

// //   return (
// //     <div className="min-h-screen bg-black text-white  p-6">
// //       <div className="flex mt-8 justify-between  items-center mb-8">
// //         <h1 className="text-4xl font-bold">Tasks</h1>
// //         <ModalTaskButton buttonLabel={'+ Add task'}  teamInfo={teamInfo} />
// //       </div>

// //       {/* {tasks?.length === 0 && <div className="text-gray-400 text-center mt-10">
// //         <h2>No tasks created yet.</h2>
// //       </div>} */}

// //         {/* <TaskLists tasks={tasks} /> */}
// //         <div className="w-1/3">
// //           <MemberLists members={teamInfo?.teamMembers} />
// //         </div>


// //         <TaskLists tasks={tasks} />

       
      
// //     </div>
// //   );
// // };

// // export default TeamDetail;














// // import { auth } from "@/app/auth";
// // import ModalTaskButton from "./_components/buttons/ModalTaskButton";
// // import TaskLists from "./_components/TaskLists";
// // import MemberLists from "../_components/MemberLists";

// // async function fetchSingleTeamInfo(teamid) {
// //   const res = await fetch(`http://localhost:3000/api/teams/${teamid}`, {
// //     method: "GET",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //   });

// //   if (!res.ok) throw new Error("Failed to fetch teams");

// //   return res.json();
// // }

// // async function fetchTasks(teamId) {
// //   const res = await fetch(`http://localhost:3000/api/tasks/${teamId}`, {
// //     method: "GET",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //   });

// //   if (!res.ok) throw new Error("Failed to fetch tasks");

// //   return res.json();
// // }

// // const TeamDetail = async ({ params }) => {
// //   const { teamId } = params;
// //   const { user } = await auth();
// //   const currentUserId = user?.id;

// //   let teamInfo = await fetchSingleTeamInfo(teamId);
// //   teamInfo = teamInfo.data;

// //   let data = await fetchTasks(teamId);
// //   let tasks = data?.data;

// //   return (
// //     <div className="min-h-screen  text-white p-6">
// //       {/* Header Section */}
// //       <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
// //         <h1 className="text-3xl sm:text-4xl font-extrabold mt-8">📋 Team Tasks</h1>
// //         <ModalTaskButton buttonLabel={'+ Add task'} teamInfo={teamInfo} />
// //       </div>

// //       {/* Main Content */}
// //       <div className="flex flex-col lg:flex-row gap-6">
// //         {/* Task List */}
// //         <div className="w-full lg:w-3/4  rounded-2xl p-6 shadow-xl  max-h-[80vh]">
// //           {tasks?.length === 0 ? (
// //             <div className="text-gray-400 text-center mt-10">
// //               <h2 className="text-xl">No tasks created yet.</h2>
// //             </div>
// //           ) : (
// //             <TaskLists tasks={tasks} />
// //           )}
// //         </div>

// //         {/* Members List */}
// //         <div className="w-full lg:w-1/4 bg-[#1a1a1a] rounded-2xl p-6 shadow-xl max-h-[80vh] overflow-y-auto">
// //           <h2 className="text-lg  lg:text-2xl font-bold mb-4 text-center">👥 Members</h2>
// //           <MemberLists members={teamInfo?.teamMembers} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default TeamDetail;









// // // // fetch teams from backend 

// // // import { auth } from "@/app/auth";
// // // import ModalTaskButton from "./_components/buttons/ModalTaskButton";
// // // import TaskLists from "./_components/TaskLists";
// // // import MemberLists from "../_components/MemberLists";
// // // // import TaskLists from "./_components/TaskLists";


// // // // async function fetchTeamsByUserId(userid) {
// // // //   const res = await fetch(`http://localhost:3000/api/teams/fetch-teams/${userid}`, {
// // // //     method: "GET",
// // // //     headers: {
// // // //       "Content-Type": "application/json",
// // // //     },
// // // //   });

// // // //   if (!res.ok) {
// // // //     throw new Error("Failed to fetch teams");
// // // //   }

// // // //   return res.json();
// // // // }

// // // async function fetchSingleTeamInfo(teamid) {
// // //     // const token = localStorage.getItem("token"); // Assuming you store your token in localStorage or sessionStorage
  
// // //     const res = await fetch(`http://localhost:3000/api/teams/${teamid}`, {
// // //       method: "GET",
// // //       headers: {
// // //         "Content-Type": "application/json",
// // //       },
// // //     });
  
// // //     if (!res.ok) {
// // //       throw new Error("Failed to fetch teams");
// // //     }
  
// // //     return res.json();
// // //   }

// // // // async function fetchTeamsByUserId(userid) {
// // // //   const res = await fetch(`http://localhost:3000/api/teams/fetch-teams/${userid}`, {
// // // //     method: "GET",
// // // //     headers: {
// // // //       "Content-Type": "application/json",
// // // //     },
// // // //   });

// // // //   if (!res.ok) {
// // // //     throw new Error("Failed to fetch teams");
// // // //   }

// // // //   return res.json();
// // // // }  


// // // async function fetchTasks(teamId) {
// // //   const res = await fetch(`http://localhost:3000/api/tasks/${teamId}`, {
// // //     method: "GET",
// // //     headers: {
// // //       "Content-Type": "application/json",
// // //     },
// // //   });

// // //   if (!res.ok) {
// // //     throw new Error("Failed to fetch teams");
// // //   }

// // //   return res.json();
// // // } 

// // // const TeamDetail = async ({params}) => {

// // //   const {teamId} = await params

// // //   const { user } = await auth();

// // //   const currentUserId = user?.id;


// // //   let teamInfo = await fetchSingleTeamInfo(teamId)
// // //    teamInfo = teamInfo.data

// // //    console.log('TeamInfo', teamInfo)



// // //     let data = await fetchTasks(teamId)
// // //     let tasks = data?.data

// // //     console.log('Tasks-----coming', tasks)

// // //   return (
// // //     <div className="min-h-screen bg-black text-white  p-6">
// // //       <div className="flex mt-8 justify-between  items-center mb-8">
// // //         <h1 className="text-4xl font-bold">Tasks</h1>
// // //         <ModalTaskButton buttonLabel={'+ Add task'}  teamInfo={teamInfo} />
// // //       </div>

// // //       {/* {tasks?.length === 0 && <div className="text-gray-400 text-center mt-10">
// // //         <h2>No tasks created yet.</h2>
// // //       </div>} */}

// // //         {/* <TaskLists tasks={tasks} /> */}
// // //         <div className="w-1/3">
// // //           <MemberLists members={teamInfo?.teamMembers} />
// // //         </div>


// // //         <TaskLists tasks={tasks} />

       
      
// // //     </div>
// // //   );
// // // };

// // // export default TeamDetail;