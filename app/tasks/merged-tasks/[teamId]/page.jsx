import { auth } from "@/app/auth";
import MergedContentReader from "../../_components/MergedContentReader";

async function fetchMergeContents(leaderId) {
    const res = await fetch(`http://localhost:3000/api/leader/merged-contents?userId=${leaderId}`, {
      headers: { "Content-Type": "application/json" },
    });
  
    if (!res.ok) throw new Error("Failed to fetch merged content");
    return res.json();
  }


const MergedTasksPage = async ({params}) => {

    const { teamId } = await params;
    const { user } = await auth();

    if (!user) return redirect('/login');
    if (user?.role === 'ADMIN') return redirect('/admin/dashboard');
    if (user?.role === 'USER') return redirect('/');
  
    const mergedContentData = await fetchMergeContents(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <MergedContentReader
      mergedContent={mergedContentData.data} 
    />
  </div>
  )
}

export default MergedTasksPage