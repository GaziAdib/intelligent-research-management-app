'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill-new'; // or 'react-quill'
import 'react-quill/dist/quill.snow.css'; // Quill styles
// import 'katex/dist/katex.min.css';

//import 'highlight.js/styles/atom-one-dark.css'; // Highlight.js theme (choose your favorite)
// import hljs from 'highlight.js'; // Import highlight.js

const RichTextEditor = ({ value, onChange, placeholder, readOnly }) => {
  const [isClient, setIsClient] = useState(false);

  //Client-side rendering check
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsClient(true);
    }
  }, []);

// Syntax Highlighting initialization
// useEffect(() => {
//     if (isClient) {
//       document.querySelectorAll('pre code').forEach((block) => {
//         hljs.highlightElement(block);
//       });
//     }
//   }, [value, isClient]); // Re-run when value changes

  // Toolbar modules
  const modules = useMemo(
    () => ({
      toolbar: [
        // Fonts & Sizes
        [{ font: [] }, { size: [] }],
        // Headers
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        // Text styling
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        // Lists
        [{ list: 'ordered' }, { list: 'bullet' }],
        // Alignments
        [{ align: [] }],
        // Colors
        [{ color: [] }, { background: [] }],
        // Media & links
        ['link', 'image', 'video'],
        // Math formula
        // ['formula'],
        // Clear formatting
        ['clean'],
      ],
    //   formula: true,
      clipboard: {
        matchVisual: false, // Disable visual clipboard matching
      },
    //   syntax: {
    //     highlight: (text) => hljs.highlightAuto(text).value, // Auto detect language
    //   },
    }),
    []
  );

  // Formats
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'list', // don't need 'bullet' separately
    'align',
    'color',
    'background',
    'link',
    'image',
    'video',
    // 'formula', // math equations
  ];

  if (!isClient) return null;

  return (
    <div className="rich-text-editor w-full dark">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        readOnly={readOnly}
        placeholder={placeholder}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg"
      />
    </div>
  );
};

export default RichTextEditor;