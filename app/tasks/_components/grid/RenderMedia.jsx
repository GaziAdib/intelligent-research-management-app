"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillDelete } from "react-icons/ai"; // Importing delete icon

const RenderMedia = ({ mediaUrls, taskId }) => {
  const [isExpanded, setIsExpanded] = useState(false); // Toggle PDFs

  const router = useRouter()

  // Filter PDFs and Images separately
  const pdfUrls = mediaUrls?.filter((url) => url.endsWith(".pdf"));
  const imageUrls = mediaUrls?.filter((url) => !url.endsWith(".pdf"));

  const onRemoveMedia = async (url) => {

    console.log('Media to be deleted', url)
  

    let match = url.match(/(task-references\/[^\/.?]+)/);
    const publicId = match ? match[1] : null;

    try {
      const res = await fetch(`/api/media/remove-media/${taskId}/${encodeURIComponent(publicId)}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"}
      });
      const responseData = await res.json();
      console.log('Delete response:', responseData);
      if (res.ok) {
        router.refresh();
        alert("Media Deleted Succesfully");
      } else {
        alert("Error removing media from assigned tasks panel!!!");
      }
    } catch (error) {
      alert("Something went wrong!");
    }
    
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      {/* Toggle PDFs Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-center items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mb-4"
      >
        {isExpanded ? "Collapse PDFs" : "View All PDFs"}
      </button>

      {/* PDF Section (Expandable) */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pdfUrls?.map((url, index) => (
            <div key={index} className="relative bg-gray-800 p-4 rounded-lg shadow-md">
              {/* Remove Button */}
              <button
                onClick={() => onRemoveMedia(url)}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
              >
                <AiFillDelete size={18} />
              </button>

              <div className="flex flex-col items-center">
                <iframe
                  src={url}
                  title={`PDF Preview ${index}`}
                  className="w-full h-48 rounded-md"
                />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-blue-400 hover:text-blue-300"
                >
                  View PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Section (Always Visible) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {imageUrls?.map((url, index) => (
          <div key={index} className="relative bg-gray-800 p-4 rounded-lg shadow-md">
            {/* Remove Button */}
            <button
              onClick={() => onRemoveMedia(url)}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
            >
              <AiFillDelete size={18} />
            </button>

            <div className="flex flex-col items-center">
              <img
                src={url}
                alt={`Media ${index}`}
                className="w-full h-32 object-cover rounded-md"
              />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-blue-400 hover:text-blue-300"
              >
                View Image
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenderMedia;












