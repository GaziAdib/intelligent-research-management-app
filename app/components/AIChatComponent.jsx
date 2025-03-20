'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function AIChatComponent() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayedText, setDisplayedText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setDisplayedText('');

    try {
      const response = await fetch('http://localhost:8000/ask-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, topic, tone }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Typing effect animation for AI response
  useEffect(() => {
    if (result) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + result.answer[i]);
        i++;
        if (i === result?.answer?.length) clearInterval(interval);
      }, 25); // Adjust speed as needed
      return () => clearInterval(interval);
    }
  }, [result]);

  return (
    <div className="container mx-auto p-6 max-w-2xl bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-indigo-400">Custom AI Query</h1>

      {/* Query Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Query</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Tone</label>
          <input
            type="text"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Submit'
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && <div className="mt-4 text-red-500">{error}</div>}

      {/* Result Display */}
      {result && (
        <div className="mt-6 p-4 bg-gray-800 rounded-md border border-gray-700">
          <h2 className="text-lg font-semibold text-indigo-300 mb-2">Your Query:</h2>
          <p className="text-gray-300">{query}</p>

          <h2 className="text-lg font-semibold text-indigo-300 mt-4">AI Response:</h2>
          <div className="mt-2 text-gray-300">
            <ReactMarkdown>
              {displayedText}
            </ReactMarkdown>
          </div>

          <h2 className="text-lg font-semibold text-indigo-300 mt-4">AI Response:</h2>
          <div className="mt-2 text-gray-300">
          <SyntaxHighlighter language="javascript" style={dark}>
            {displayedText}
          </SyntaxHighlighter>
          </div>


        </div>
      )}
    </div>
  );
}




// 'use client';

// import { useState } from 'react';
// import ReactMarkdown from 'react-markdown';

// export default function AIChatComponent() {
//   const [query, setQuery] = useState('');
//   const [topic, setTopic] = useState('');
//   const [tone, setTone] = useState('');
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('http://localhost:8000/custom-ai', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ query, topic, tone }),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       setResult(data.answer);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6 max-w-2xl bg-gray-900 text-white rounded-lg shadow-lg">
//       <h1 className="text-3xl font-bold mb-4 text-indigo-400">Custom AI Query</h1>
      
//       {/* Query Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Query</label>
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="mt-1 block w-full p-2 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Topic</label>
//           <input
//             type="text"
//             value={topic}
//             onChange={(e) => setTopic(e.target.value)}
//             className="mt-1 block w-full p-2 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Tone</label>
//           <input
//             type="text"
//             value={tone}
//             onChange={(e) => setTone(e.target.value)}
//             className="mt-1 block w-full p-2 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           {loading ? (
//             <span className="flex justify-center items-center">
//               <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
//               </svg>
//               Generating...
//             </span>
//           ) : 'Submit'}
//         </button>
//       </form>

//       {/* Error Message */}
//       {error && <div className="mt-4 text-red-500">{error}</div>}

//       {/* Result Display */}
//       {result && (
//         <div className="mt-6 p-4 bg-gray-800 rounded-md border border-gray-700">
//           <h2 className="text-lg font-semibold text-indigo-300 mb-2">Your Query:</h2>
//           <p className="text-gray-300">{result?.query}</p>

//           <h2 className="text-lg font-semibold text-indigo-300 mt-4">AI Response:</h2>
//           <div className="mt-2 text-gray-300">
//             <ReactMarkdown>{result?.text}</ReactMarkdown>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// 'use client';

// import { useState } from 'react';
// import ReactMarkdown from 'react-markdown';

// export default function AIChatComponent() {
//   const [query, setQuery] = useState('');
//   const [topic, setTopic] = useState('');
//   const [tone, setTone] = useState('');
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('http://localhost:8000/custom-ai', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ query, topic, tone }),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       setResult(data.answer);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6 max-w-2xl bg-gray-900 text-white rounded-lg shadow-lg">
//       <h1 className="text-3xl font-bold mb-4 text-indigo-400">Custom AI Query</h1>
      
//       {/* Query Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Query</label>
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="mt-1 block w-full p-2 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Topic</label>
//           <input
//             type="text"
//             value={topic}
//             onChange={(e) => setTopic(e.target.value)}
//             className="mt-1 block w-full p-2 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Tone</label>
//           <input
//             type="text"
//             value={tone}
//             onChange={(e) => setTone(e.target.value)}
//             className="mt-1 block w-full p-2 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           {loading ? 'Generating...' : 'Submit'}
//         </button>
//       </form>

//       {/* Error Message */}
//       {error && <div className="mt-4 text-red-500">{error}</div>}

//       {/* Result Display */}
//       {result && (
//         <div className="mt-6 p-4 bg-gray-800 rounded-md border border-gray-700">
//           <h2 className="text-lg font-semibold text-indigo-300 mb-2">Your Query:</h2>
//           <p className="text-gray-300">{result.query}</p>

//           <h2 className="text-lg font-semibold text-indigo-300 mt-4">AI Response:</h2>
//           <div className="mt-2 text-gray-300">
//             <ReactMarkdown className="prose prose-invert">{result.text}</ReactMarkdown>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





// 'use client'; // Mark this component as a Client Component

// import { useState } from 'react';

// export default function AIChatComponent() {
//   const [query, setQuery] = useState('');
//   const [topic, setTopic] = useState('');
//   const [tone, setTone] = useState('');
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('http://localhost:8000/custom-ai', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ query, topic, tone }),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       setResult(data);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log('Result', result)

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Custom AI Query</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-200">Query</label>
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-200">Topic</label>
//           <input
//             type="text"
//             value={topic}
//             onChange={(e) => setTopic(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-200">Tone</label>
//           <input
//             type="text"
//             value={tone}
//             onChange={(e) => setTone(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           {loading ? 'Submitting...' : 'Submit'}
//         </button>
//       </form>

//       {error && <div className="mt-4 text-red-500">{error}</div>}

//       {result && (
//         <div className="mt-4 p-4 bg-gray-900 rounded-md">
//           <h2 className="text-xl font-semibold mb-2">Result</h2>
//           <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }