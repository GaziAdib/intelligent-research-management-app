import { auth } from "@/app/auth";
import Image from "next/image";

async function fetchMergedMediaContents(teamId, userId) {
  const res = await fetch(
    `http://localhost:3000/api/leader/merged-media-content?userId=${userId}&teamId=${teamId}`,
    {
      headers: { "Content-Type": "application/json" },
      cache: "no-store"
    }
  );

  if (!res.ok) throw new Error("Failed to fetch merged media content");
  return res.json();
}

// Check if URL ends with image extension
const isImageUrl = (url) => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const cleanUrl = url.split('?')[0].toLowerCase(); // Remove query params
  return imageExtensions.some(ext => cleanUrl.endsWith(ext));
};

const MergedMediaContent = async ({ teamId }) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not authenticated");

    const { data: mediaContents = [] } = await fetchMergedMediaContents(teamId, userId);

    // Filter to only include content with valid image URLs
    const validMediaContents = mediaContents.filter(content => 
      content?.mediaUrls?.some(isImageUrl)
    );

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Team Media Gallery</h1>
        
        {validMediaContents.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No images found for this team</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {validMediaContents?.map((content) => (
              <div 
                key={content.id} 
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {/* Display only image URLs */}
                {content?.mediaUrls?.filter(isImageUrl).map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={url}
                      alt={`Media from task: ${content?.task?.taskTitle || 'Untitled'}`}
                      className="absolute w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     
                    />
                  </div>
                ))}
                <div className="p-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {content.task?.taskTitle || 'Untitled Task'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 text-center text-red-500 dark:text-red-400">
        <p>Error loading media content: {error.message}</p>
      </div>
    );
  }
};

export default MergedMediaContent;









