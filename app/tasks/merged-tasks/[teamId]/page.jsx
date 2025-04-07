import { auth } from "@/app/auth";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import MergedContentReader from "../../_components/MergedContentReader";

async function fetchMergeContents(teamId, userId) {
  const res = await fetch(
    `http://localhost:3000/api/leader/merged-contents?userId=${userId}&teamId=${teamId}`,
    {
      headers: { "Content-Type": "application/json" },
      cache: "no-store"
    }
  );

  if (!res.ok) throw new Error("Failed to fetch merged content");
  return res.json();
}

// Loading component for the content area
const ContentLoader = () => (
  <div className="h-64 flex flex-col items-center justify-center space-y-4">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-cyan-500 border-dashed rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-cyan-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582M20 20v-5h-.581M5.582 9A7.978 7.978 0 0112 4a7.978 7.978 0 016.418 3M18.418 15A7.978 7.978 0 0112 20a7.978 7.978 0 01-6.418-3"
          />
        </svg>
      </div>
    </div>
    <p className="text-sm text-gray-400 animate-pulse">Loading team content...</p>
  </div>
);


// Loading component for the full page
const FullPageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-cyan-400">Loading Team Workspace...</p>
    </div>
  </div>
);

const MergedTasksPage = async ({ params }) => {
  const { teamId } = await params;
  const { user } = await auth();

  if (!user) return redirect('/login');
  if (user?.role === 'ADMIN') return redirect('/admin/dashboard');
  if (user?.role === 'USER') return redirect('/');

  const mergedContentData = await fetchMergeContents(teamId, user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Particle background */}
      <div className="fixed inset-0 overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-cyan-500/30"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s infinite ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing orb effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[80px]" />
        <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-violet-500/10 rounded-full filter blur-[80px]" />
      </div>

      {/* Main content wrapped in Suspense */}
      <Suspense fallback={<FullPageLoader />}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
          {/* Glass panel with subtle border gradient */}
          <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-transparent">
            <div className="absolute inset-0 p-[1px] rounded-[inherit] bg-gradient-to-br from-cyan-500/20 via-transparent to-violet-500/20 -z-10" />
            
            {/* Panel header */}
            <div className="px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px] shadow-cyan-500/50" />
                <h1 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  Team Leader's Workspace
                </h1>
              </div>
              <p className="text-gray-400 mt-1 text-sm">
                Collaborative space for {user?.username}'s team
              </p>
            </div>

            {/* Content area with Suspense */}
            <div className="p-6">
              <Suspense fallback={<ContentLoader />}>
                <MergedContentReader mergedContent={mergedContentData.data} />
              </Suspense>
            </div>

            {/* Status bar */}
            <div className="px-4 py-2 bg-gray-900/50 text-xs text-gray-400 flex justify-between items-center border-t border-gray-700/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Connected</span>
              </div>
              <div>
                Last synced: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default MergedTasksPage;




// import { auth } from "@/app/auth";
// import { redirect } from "next/navigation";
// import MergedContentReader from "../../_components/MergedContentReader";

// async function fetchMergeContents(teamId, userId) {
//   const res = await fetch(
//     `http://localhost:3000/api/leader/merged-contents?userId=${userId}&teamId=${teamId}`,
//     {
//       headers: { "Content-Type": "application/json" },
//       cache: "no-store",
//     }
//   );

//   if (!res.ok) throw new Error("Failed to fetch merged content");
//   return res.json();
// }

// const MergedTasksPage = async ({ params }) => {
//   const { teamId } = await params;
//   const { user } = await auth();

//   if (!user) return redirect("/login");
//   if (user?.role === "ADMIN") return redirect("/admin/dashboard");
//   if (user?.role === "USER") return redirect("/");

//   const mergedContentData = await fetchMergeContents(teamId, user.id);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       {/* Particle background */}
//       <div className="fixed inset-0 overflow-hidden opacity-20">
//         {[...Array(20)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute rounded-full bg-cyan-500/30"
//             style={{
//               width: `${Math.random() * 10 + 5}px`,
//               height: `${Math.random() * 10 + 5}px`,
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//               animation: `float ${Math.random() * 10 + 10}s infinite ${Math.random() * 5}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Glowing orb effects */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[80px]" />
//         <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-violet-500/10 rounded-full filter blur-[80px]" />
//       </div>

//       {/* Main content */}
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
//         <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-transparent">
//           <div className="absolute inset-0 p-[1px] rounded-[inherit] bg-gradient-to-br from-cyan-500/20 via-transparent to-violet-500/20 -z-10" />
          
//           {/* Panel header */}
//           <div className="px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
//             <div className="flex items-center gap-3">
//               <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px] shadow-cyan-500/50" />
//               <h1 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
//                 Team Workspace
//               </h1>
//             </div>
//             <p className="text-gray-400 mt-1 text-sm">
//               Collaborative space for {user?.username}'s team
//             </p>
//           </div>

//           {/* Content area */}
//           <div className="p-6">
//             <MergedContentReader mergedContent={mergedContentData.data} />
//           </div>

//           {/* Status bar */}
//           <div className="px-4 py-2 bg-gray-900/50 text-xs text-gray-400 flex justify-between items-center border-t border-gray-700/50">
//             <div className="flex items-center gap-2">
//               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//               <span>Connected</span>
//             </div>
//             <div>Last synced: {new Date().toLocaleTimeString()}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MergedTasksPage;






// import { auth } from "@/app/auth";
// import MergedContentReader from "../../_components/MergedContentReader";
// import { redirect } from "next/navigation";

// async function fetchMergeContents(teamId, userId) {
//   const res = await fetch(
//     `http://localhost:3000/api/leader/merged-contents?userId=${userId}&teamId=${teamId}`,
//     {
//       headers: { "Content-Type": "application/json" },
//       cache: "no-store"
//     }
//   );

//   if (!res.ok) throw new Error("Failed to fetch merged content");
//   return res.json();
// }

// const MergedTasksPage = async ({ params }) => {
//   const { teamId } = await params;
//   const { user } = await auth();

//   if (!user) return redirect('/login');
//   if (user?.role === 'ADMIN') return redirect('/admin/dashboard');
//   if (user?.role === 'USER') return redirect('/');

//   const mergedContentData = await fetchMergeContents(teamId, user.id);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       {/* Particle background */}
//       <div className="fixed inset-0 overflow-hidden opacity-20">
//         {[...Array(20)].map((_, i) => (
//           <div 
//             key={i}
//             className="absolute rounded-full bg-cyan-500/30"
//             style={{
//               width: `${Math.random() * 10 + 5}px`,
//               height: `${Math.random() * 10 + 5}px`,
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//               animation: `float ${Math.random() * 10 + 10}s infinite ${Math.random() * 5}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Glowing orb effects */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[80px]" />
//         <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-violet-500/10 rounded-full filter blur-[80px]" />
//       </div>

//       {/* Main content */}
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
//         {/* Glass panel with subtle border gradient */}
//         <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-transparent">
//           <div className="absolute inset-0 p-[1px] rounded-[inherit] bg-gradient-to-br from-cyan-500/20 via-transparent to-violet-500/20 -z-10" />
          
//           {/* Panel header */}
//           <div className="px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
//             <div className="flex items-center gap-3">
//               <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px] shadow-cyan-500/50" />
//               <h1 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
//                 Team Workspace
//               </h1>
//             </div>
//             <p className="text-gray-400 mt-1 text-sm">
//               Collaborative space for {user?.username}'s team
//             </p>
//           </div>

//           {/* Content area */}
//           <div className="p-6">
//             <MergedContentReader mergedContent={mergedContentData.data} />
//           </div>

//           {/* Status bar */}
//           <div className="px-4 py-2 bg-gray-900/50 text-xs text-gray-400 flex justify-between items-center border-t border-gray-700/50">
//             <div className="flex items-center gap-2">
//               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//               <span>Connected</span>
//             </div>
//             <div>
//               Last synced: {new Date().toLocaleTimeString()}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MergedTasksPage;



// import { auth } from "@/app/auth";
// import MergedContentReader from "../../_components/MergedContentReader";
// import { redirect } from "next/navigation";

// async function fetchMergeContents(teamId, userId) {
//     const res = await fetch(`http://localhost:3000/api/leader/merged-contents?userId=${userId}&teamId=${teamId}`, {
//       headers: { "Content-Type": "application/json" },
//     });
  
//     if (!res.ok) throw new Error("Failed to fetch merged content");
//     return res.json();
//   }


// const MergedTasksPage = async ({params}) => {

//     const { teamId } = await params;
//     const { user } = await auth();

//     if (!user) return redirect('/login');
//     if (user?.role === 'ADMIN') return redirect('/admin/dashboard');
//     if (user?.role === 'USER') return redirect('/');
  
//     const mergedContentData = await fetchMergeContents(teamId, user.id);

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//     <MergedContentReader
//       mergedContent={mergedContentData.data} 
//     />
//   </div>
//   )
// }

// export default MergedTasksPage