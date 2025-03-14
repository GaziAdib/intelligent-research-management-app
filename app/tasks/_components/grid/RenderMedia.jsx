'use client';

import { useState } from 'react';

const RenderMedia = ({ mediaUrls }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to manage toggle
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Filter only PDFs from mediaUrls
  const pdfUrls = mediaUrls?.filter((url) => url.endsWith('.pdf'));

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mb-4"
      >
        {isExpanded ? 'Collapse PDFs' : 'View All PDFs'}
      </button>

      {/* PDF Container (Conditionally Rendered) */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pdfUrls?.map((url, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
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

      {/* Images (Always Visible) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {mediaUrls
          ?.filter((url) => !url.endsWith('.pdf')) // Filter out PDFs
          ?.map((url, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
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









// "use client";

// import { useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';

// // Set up PDF worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// const RenderMedia = ({ mediaUrls }) => {
//     const [selectedMedia, setSelectedMedia] = useState(null);
  
//     return (
        
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {mediaUrls?.map((url, index) => (
//                 <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
//                   {url.endsWith('.pdf') ? (
//                     // Render PDF using iframe
//                     <div className="flex flex-col items-center">
//                       <iframe
//                         src={url}
//                         title={`PDF Preview ${index}`}
//                         className="w-full h-48 rounded-md"
//                       />
//                       <a
//                         href={url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="mt-2 text-blue-400 hover:text-blue-300"
//                       >
//                         View PDF
//                       </a>
//                     </div>
//                   ) : (
//                     // Render Image
//                     <div className="flex flex-col items-center">
//                       <img
//                         src={url}
//                         alt={`Media ${index}`}
//                         className="w-full h-32 object-cover rounded-md"
//                       />
//                       <a
//                         href={url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="mt-2 text-blue-400 hover:text-blue-300"
//                       >
//                         View Image
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//     );
//   };

//   export default RenderMedia;