'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const MediaUploadForm = ({ taskId, onClose }) => {
  const [files, setFiles] = useState([]);
  const [mediaType, setMediaType] = useState('pdf'); // default to 'pdf'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to Array
    setFiles(selectedFiles);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setErrorMessage('Please select at least one file.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      // Send the form data to the server
      const response = await fetch(`/api/media/attach-media/${taskId}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Media attached to task successfully!');
        router.refresh()
        setFiles([]); // Clear selected files after successful upload
        setTimeout(() => {
          onClose(); // Close the modal after successful upload
        }, 2000); // Close after 2 seconds
      } else {
        setErrorMessage(data.message || 'Error attaching media to task');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to upload media. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-950 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-6 text-center text-white">
        Upload Media (Pdfs, Images)
      </h2>

      {/* Error and Success Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-500 text-white rounded-md">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-500 text-white rounded-md">
          {successMessage}
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* File Input */}
        <div className="mb-4">
          <label
            htmlFor="files"
            className="block text-md text-center my-2 py-2 font-medium text-gray-300 mb-2"
          >
            Select Files (PDFs/Images):
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center px-4 py-6 bg-gray-800 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-gray-700 transition-colors">
              <svg
                className="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className="mt-2 text-base leading-normal text-gray-300">
                {files.length > 0
                  ? `${files.length} file(s) selected`
                  : 'Choose files'}
              </span>
              <input
                type="file"
                id="files"
                name="files"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || files.length === 0}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Uploading...' : 'Upload Media'}
        </button>
      </form>
    </div>
  );
};

const MediaUploadModal = ({ taskId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open the modal
  const openModal = () => setIsModalOpen(true);

  // Close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      {/* Attach Media Button */}
      <button
        onClick={openModal}
        className="bg-gray-700 border-2 border-gray-200 my-2 text-white px-4 py-2 rounded-md hover:bg-black hover:text-white transition-colors"
      >
        Attach Media
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed mx-3 px-3 py-2 flex items-center justify-center bg-transparent  bg-opacity-50 z-50">
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Media Upload Form */}
            <MediaUploadForm taskId={taskId} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploadModal;






// 'use client';

// import React, { useState } from 'react';

// const MediaUploadForm = ({ taskId }) => {
//   const [files, setFiles] = useState([]);
//   const [mediaType, setMediaType] = useState('pdf'); // default to 'pdf'
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files); // Convert FileList to Array
//     setFiles(selectedFiles);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (files.length === 0) {
//       setErrorMessage('Please select at least one file.');
//       return;
//     }

//     setLoading(true);
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       const formData = new FormData();
//       files.forEach((file) => {
//         formData.append('files', file);
//       });

//       // Send the form data to the server
//       const response = await fetch(`/api/media/attach-media/${taskId}`, {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage('Media attached to task successfully!');
//         setFiles([]); // Clear selected files after successful upload
//       } else {
//         setErrorMessage(data.message || 'Error attaching media to task');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setErrorMessage('Failed to upload media. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4 bg-gray-950 rounded-lg shadow-md dark:bg-gray-800">
//       <h2 className="text-2xl font-bold mb-6 text-center text-white">
//         Upload Media to Task
//       </h2>

//       {/* Error and Success Messages */}
//       {errorMessage && (
//         <div className="mb-4 p-3 bg-red-500 text-white rounded-md">
//           {errorMessage}
//         </div>
//       )}
//       {successMessage && (
//         <div className="mb-4 p-3 bg-green-500 text-white rounded-md">
//           {successMessage}
//         </div>
//       )}

//       {/* Upload Form */}
//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         {/* File Input */}
//         <div className="mb-4">
//           <label
//             htmlFor="files"
//             className="block text-md text-center my-2 py-2 font-medium text-gray-300 mb-2"
//           >
//             Select Files (PDFs/Images):
//           </label>
//           <div className="flex items-center justify-center w-full">
//             <label className="flex flex-col items-center px-4 py-6 bg-gray-800 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-gray-700 transition-colors">
//               <svg
//                 className="w-8 h-8"
//                 fill="currentColor"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
//               </svg>
//               <span className="mt-2 text-base leading-normal text-gray-300">
//                 {files.length > 0
//                   ? `${files.length} file(s) selected`
//                   : 'Choose files'}
//               </span>
//               <input
//                 type="file"
//                 id="files"
//                 name="files"
//                 multiple
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </label>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading || files.length === 0}
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
//         >
//           {loading ? 'Uploading...' : 'Upload Media'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default MediaUploadForm;







// 'use client'

// import React, { useState } from 'react';

// const MediaUploadForm = ({ taskId }) => {
//   const [files, setFiles] = useState([]);
//   const [mediaType, setMediaType] = useState('pdf'); // default to 'pdf'
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selectedFiles = e.target.files;
//     setFiles(selectedFiles);
//   };

//   // Handle media type change (e.g., image, pdf)
//   const handleMediaTypeChange = (e) => {
//     setMediaType(e.target.value);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (files?.length === 0) {
//       setErrorMessage("Please select at least one file.");
//       return;
//     }

//     setLoading(true);
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       const formData = new FormData();
//       for (let i = 0; i < files.length; i++) {
//         formData.append('files', files[i]);
//       }


//       // Send the form data to the server
//       const response = await fetch(`/api/media/attach-media/${taskId}`, {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       console.log('Data', data.data)

//       if (response.ok) {
//         setSuccessMessage('Media attached to task successfully!');
//       } else {
//         setErrorMessage(data.message || 'Error attaching media to task');
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setErrorMessage('Failed to upload media. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="upload-form-container">
//       <h2>Upload Media to Task</h2>
      
//       {errorMessage && <div className="error-message">{errorMessage}</div>}
//       {successMessage && <div className="success-message">{successMessage}</div>}

//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         <div>
//           <label htmlFor="files">Select Files (PDFs/Images):</label>
//           <input
//             type="file"
//             id="files"
//             name="files"
//             multiple
//             onChange={handleFileChange}
//           />
//         </div>


//         <button type="submit" disabled={loading}>
//           {loading ? 'Uploading...' : 'Upload Media'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default MediaUploadForm;
