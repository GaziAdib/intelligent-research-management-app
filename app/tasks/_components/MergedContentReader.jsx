'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FiBookOpen, FiSearch, FiCopy, FiDownload } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

const MergedContentReader = ({ mergedContent }) => {
  const { mergedContent: content, leaderId } = mergedContent || {};
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => setMounted(true), []);

  // Process content when it changes or search term changes
  useEffect(() => {
    if (content) {
      const cleaned = cleanRichTextContent(content);
      const highlighted = searchTerm ? highlightSearch(cleaned) : cleaned;
      setProcessedContent(highlighted);
    }
  }, [content, searchTerm]);

  // This function preserves HTML formatting but cleans unwanted div classes
  const cleanRichTextContent = useCallback((htmlString) => {
    if (!htmlString) return '';
    
    // Create a temporary div to manipulate the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    // Handle code blocks specially
    const codeBlocks = tempDiv.querySelectorAll('.ql-code-block-container');
    codeBlocks.forEach(container => {
      const codeLines = Array.from(container.querySelectorAll('.ql-code-block'))
        .map(block => block.textContent)
        .join('\n');
      
      // Create a pre and code element to replace the container
      const preElement = document.createElement('pre');
      const codeElement = document.createElement('code');
      codeElement.textContent = codeLines;
      
      // Add data attribute to identify language (default to javascript if unknown)
      codeElement.setAttribute('data-language', 'javascript');
      
      preElement.appendChild(codeElement);
      container.replaceWith(preElement);
    });
    
    // Remove any Quill-specific classes while keeping the HTML structure
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove Quill-specific classes
      if (el.classList) {
        const classesToKeep = Array.from(el.classList).filter(cls => !cls.startsWith('ql-'));
        el.className = classesToKeep.join(' ');
      }
      
      // Remove style attributes that might interfere with our styling
      el.removeAttribute('style');
    });
    
    return tempDiv.innerHTML;
  }, []);

  // Apply search highlighting if needed
  const highlightSearch = useCallback((htmlContent) => {
    if (!searchTerm) return htmlContent;
    
    // Create a regex for highlighting with case-insensitivity
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return htmlContent.replace(regex, '<mark>$1</mark>');
  }, [searchTerm]);

  const isLeader = session?.user?.id === leaderId;

  const handleCopy = () => {
    navigator.clipboard.writeText(content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // const exportToPDF = async () => {
  //   setIsPrinting(true);
  //   try {
  //     const element = document.getElementById('content-to-export');
  //     if (!element) return;

  //     const canvas = await html2canvas(element, {
  //       scale: 1.2,
  //       useCORS: true,
  //       backgroundColor: null,
  //     });

  //     const imgWidth = canvas.width;
  //     const imgHeight = canvas.height;

  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  //     const marginTopBottom = 3;
  //     const usableHeight = pdfHeight - 2 * marginTopBottom;

  //     const imgHeightRatio = pdfWidth / imgWidth;
  //     const fullImgHeightInPDF = imgHeight * imgHeightRatio;
  //     const totalPages = Math.ceil(fullImgHeightInPDF / usableHeight);

  //     for (let page = 0; page < totalPages; page++) {
  //       const canvasPage = document.createElement('canvas');
  //       const context = canvasPage.getContext('2d');
  //       const sliceHeight = usableHeight / imgHeightRatio;

  //       canvasPage.width = imgWidth;
  //       canvasPage.height = sliceHeight;

  //       context.drawImage(
  //         canvas,
  //         0,
  //         page * sliceHeight,
  //         imgWidth,
  //         sliceHeight,
  //         0,
  //         0,
  //         imgWidth,
  //         sliceHeight
  //       );

  //       const imgData = canvasPage.toDataURL('image/png');

  //       if (page > 0) pdf.addPage();

  //       pdf.setFillColor('#0f172a');
  //       pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
  //       pdf.addImage(imgData, 'PNG', 0, marginTopBottom, pdfWidth, usableHeight);
  //     }

  //     pdf.save('research-document.pdf');
  //   } catch (err) {
  //     console.error('PDF export error:', err);
  //   } finally {
  //     setIsPrinting(false);
  //   }
  // };

  const exportToPDF = async () => {
    setIsPrinting(true);
    try {
      const element = document.getElementById('content-to-export');
      if (!element) return;
  
      const getOptimalScale = () => {
        const width = element.offsetWidth;
        return Math.min(2, Math.max(1, 1920 / width));
      };
  
      const canvas = await html2canvas(element, {
        scale: getOptimalScale(),
        useCORS: true,
        backgroundColor: null,
        logging: false,
        quality: 0.98,
        removeContainer:true
      });
  
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
  
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const marginTopBottom = 3;
      const usableHeight = pdfHeight - 2 * marginTopBottom;
  
      const imgHeightRatio = pdfWidth / imgWidth;
      const fullImgHeightInPDF = imgHeight * imgHeightRatio;
      const totalPages = Math.ceil(fullImgHeightInPDF / usableHeight);
  
      for (let page = 0; page < totalPages; page++) {
        const canvasPage = document.createElement('canvas');
        const context = canvasPage.getContext('2d');
        const sliceHeight = usableHeight / imgHeightRatio;
  
        canvasPage.width = imgWidth;
        canvasPage.height = sliceHeight;
  
        context.drawImage(
          canvas,
          0,
          page * sliceHeight,
          imgWidth,
          sliceHeight,
          0,
          0,
          imgWidth,
          sliceHeight
        );
  
        const imgData = canvasPage.toDataURL('image/jpeg', 0.85);
  
        if (page > 0) pdf.addPage();
  
        pdf.setFillColor('#0f172a');
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
        pdf.addImage(imgData, 'JPEG', 0, marginTopBottom, pdfWidth, usableHeight);
      }
  
      pdf.save('research-document.pdf');
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsPrinting(false);
    }
  };

  if (!mounted) return null;

  if (!content) {
    return (
      <div className="text-center py-20">
        <FiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-800">
          No merged content available
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          The leader hasn't merged any approved tasks yet.
        </p>
      </div>
    );
  }

  // Custom renderer for content that processes code blocks with syntax highlighting
  const ContentRenderer = ({ htmlContent }) => {
    // Create a ref for the container
    const containerRef = useRef(null);
    
    // Process code blocks after the component mounts or content changes
    useEffect(() => {
      if (containerRef.current) {
        const codeBlocks = containerRef.current.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
          // Get language from data attribute or try to detect
          const language = block.getAttribute('data-language') || 'javascript';
          const code = block.textContent;
          
          // Create a new element with React Syntax Highlighter
          const highlighterContainer = document.createElement('div');
          highlighterContainer.className = 'code-block-wrapper';
          
          // Render the React component to a string
          const ReactDOMServer = require('react-dom/server');
          const highlightedHtml = ReactDOMServer.renderToString(
            <SyntaxHighlighter language={language} style={dracula}>
              {code}
            </SyntaxHighlighter>
          );
          
          highlighterContainer.innerHTML = highlightedHtml;
          
          // Replace the original code block with the highlighted version
          block.parentElement.replaceWith(highlighterContainer);
        });
      }
    }, [htmlContent]);
    
    return (
      <div 
        ref={containerRef}
        className="prose dark:prose-invert max-w-none prose-p:my-4 prose-headings:font-bold prose-headings:my-4 prose-ul:list-disc prose-ol:list-decimal prose-pre:bg-gray-900 prose-pre:text-white prose-strong:font-bold prose-em:italic"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  return (
    <div
      id="content-to-export"
      className="bg-white dark:bg-gray-900 dark:text-white text-gray-900"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FiBookOpen className="h-5 w-5" />
          <h1 className="text-xl font-bold">Research Project</h1>
        </div>
        <div className="flex space-x-2">
          {!isLeader && (
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md border border-gray-300"
            >
              <FiCopy className="h-4 w-4" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          )}
          <button
            onClick={exportToPDF}
            disabled={isPrinting}
            className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md bg-black text-white"
          >
            <FiDownload className="h-4 w-4" />
            <span>{isPrinting ? 'Generating...' : 'PDF'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-gray-300">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search in content..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content display with custom renderer */}
      <div className="p-6 md:p-8 lg:p-10 markdown-content">
        <ContentRenderer htmlContent={processedContent} />
      </div>
    </div>
  );
};

export default MergedContentReader;


// 'use client';

// import { useState, useEffect } from 'react';
// import { FiBookOpen, FiSearch, FiCopy, FiDownload } from 'react-icons/fi';
// import { useSession } from 'next-auth/react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
// import html2canvas from 'html2canvas-pro';
// import { jsPDF } from 'jspdf';

// const MergedContentReader = ({ mergedContent }) => {
//   const { mergedContent: content, leaderId } = mergedContent || {};
//   const { data: session } = useSession();
//   const [mounted, setMounted] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [copied, setCopied] = useState(false);
//   const [isPrinting, setIsPrinting] = useState(false);

//   useEffect(() => setMounted(true), []);
//   if (!mounted) return null;

//   const isLeader = session?.user?.id === leaderId;

//   const handleCopy = () => {
//     navigator.clipboard.writeText(content || '');
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const exportToPDF = async () => {
//     setIsPrinting(true);
//     try {
//       const element = document.getElementById('content-to-export');
//       if (!element) return;

//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: null,
//       });

//       const imgWidth = canvas.width;
//       const imgHeight = canvas.height;

//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();
//       const marginTopBottom = 3;
//       const usableHeight = pdfHeight - 2 * marginTopBottom;

//       const imgHeightRatio = pdfWidth / imgWidth;
//       const fullImgHeightInPDF = imgHeight * imgHeightRatio;
//       const totalPages = Math.ceil(fullImgHeightInPDF / usableHeight);

//       for (let page = 0; page < totalPages; page++) {
//         const canvasPage = document.createElement('canvas');
//         const context = canvasPage.getContext('2d');
//         const sliceHeight = usableHeight / imgHeightRatio;

//         canvasPage.width = imgWidth;
//         canvasPage.height = sliceHeight;

//         context.drawImage(
//           canvas,
//           0,
//           page * sliceHeight,
//           imgWidth,
//           sliceHeight,
//           0,
//           0,
//           imgWidth,
//           sliceHeight
//         );

//         const imgData = canvasPage.toDataURL('image/png');

//         if (page > 0) pdf.addPage();

//         pdf.setFillColor('#0f172a');
//         pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
//         pdf.addImage(imgData, 'PNG', 0, marginTopBottom, pdfWidth, usableHeight);
//       }

//       pdf.save('research-document.pdf');
//     } catch (err) {
//       console.error('PDF export error:', err);
//     } finally {
//       setIsPrinting(false);
//     }
//   };

//   if (!content) {
//     return (
//       <div className="text-center py-20">
//         <FiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
//         <h3 className="mt-2 text-lg font-medium text-gray-800">
//           No merged content available
//         </h3>
//         <p className="mt-1 text-sm text-gray-500">
//           The leader hasn't merged any approved tasks yet.
//         </p>
//       </div>
//     );
//   }

//   const filteredContent = searchTerm
//     ? content.replace(new RegExp(`(${searchTerm})`, 'gi'), '**==$1==**')
//     : content;

//   return (
//     <div
//       id="content-to-export"
//       className="bg-white dark:bg-gray-900 dark:text-white text-gray-900"
//     >
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <FiBookOpen className="h-5 w-5" />
//           <h1 className="text-xl font-bold">Research Project</h1>
//         </div>
//         <div className="flex space-x-2">
//           {!isLeader && (
//             <button
//               onClick={handleCopy}
//               className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md border border-gray-300"
//             >
//               <FiCopy className="h-4 w-4" />
//               <span>{copied ? 'Copied!' : 'Copy'}</span>
//             </button>
//           )}
//           <button
//             onClick={exportToPDF}
//             disabled={isPrinting}
//             className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md bg-black text-white"
//           >
//             <FiDownload className="h-4 w-4" />
//             <span>{isPrinting ? 'Generating...' : 'PDF'}</span>
//           </button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="px-6 py-4 border-b border-gray-300">
//         <div className="relative max-w-md">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiSearch className="h-5 w-5 text-gray-500" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search in content..."
//             className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Markdown Renderer */}
//       <div className="p-6 md:p-8 lg:p-10">
//         <div className="prose dark:prose-invert max-w-none prose-pre:bg-gray-900 prose-pre:text-white prose-code:bg-gray-100 prose-code:rounded-md prose-code:px-1.5 prose-code:py-0.5">
//           <ReactMarkdown
//   remarkPlugins={[remarkGfm]}
//   rehypePlugins={[rehypeRaw]}
//   components={{
//     code({ node, inline, className, children, ...props }) {
//       const match = /language-(\w+)/.exec(className || '');
//       const language = match?.[1] || '';
//       const rawCode = String(children).replace(/===(.*?)===/g, '<mark>$1</mark>');

//       return !inline ? (
//         <SyntaxHighlighter
//           language={language}
//           style={dracula}
//           PreTag="div"
//           wrapLines
//           lineProps={{
//             style: { wordBreak: 'break-word', whiteSpace: 'pre-wrap' },
//           }}
//           {...props}
//         >
//           {rawCode}
//         </SyntaxHighlighter>
//       ) : (
//         <code className="bg-gray-100 px-1.5 py-0.5 rounded">
//           {children}
//         </code>
//       );
//     },
//     mark({ children }) {
//       return <mark className="bg-yellow-200 dark:bg-yellow-600">{children}</mark>;
//     },
//   }}
// >
//   {filteredContent}
// </ReactMarkdown>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MergedContentReader;



// "use client";
// import { FiBookOpen, FiSearch, FiCopy, FiDownload } from 'react-icons/fi';
// import { useSession } from "next-auth/react";
// import { useState, useEffect } from "react";
// import html2canvas from 'html2canvas-pro';
// import { jsPDF } from 'jspdf';

// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// const MergedContentReader = ({ mergedContent }) => {
//   const { mergedContent: content, leaderId } = mergedContent || {};
//   const { data: session } = useSession();
//   const [mounted, setMounted] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [copied, setCopied] = useState(false);
//   const [isPrinting, setIsPrinting] = useState(false);

//   useEffect(() => setMounted(true), []);

//   if (!content) {
//     return (
//       <div className="text-center py-20">
//         <FiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
//         <h3 className="mt-2 text-lg font-medium text-gray-800">
//           No merged content available
//         </h3>
//         <p className="mt-1 text-sm text-gray-500">
//           The leader hasn't merged any approved tasks yet.
//         </p>
//       </div>
//     );
//   }

//   const isLeader = session?.user?.id === leaderId;
//   const processedContent = processContent(content, searchTerm);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(content);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

 

//   const exportToPDF = async () => {
//     setIsPrinting(true);
//     try {
//       const element = document.getElementById('content-to-export');
//       if (!element) return;
  
//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: null, // Set to null to capture the actual background color
//       });
  
//       const imgWidth = canvas.width;
//       const imgHeight = canvas.height;
  
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();
  
//       const marginTopBottom = 3; // mm
//       const usableHeight = pdfHeight - 2 * marginTopBottom;
  
//       const imgHeightRatio = (pdfWidth / imgWidth);
//       const fullImgHeightInPDF = imgHeight * imgHeightRatio;
//       const totalPages = Math.ceil(fullImgHeightInPDF / usableHeight);
  
//       for (let page = 0; page < totalPages; page++) {
//         const canvasPage = document.createElement('canvas');
//         const context = canvasPage.getContext('2d');
//         const sliceHeight = (usableHeight / imgHeightRatio);
  
//         canvasPage.width = imgWidth;
//         canvasPage.height = sliceHeight;
  
//         context.drawImage(
//           canvas,
//           0,
//           page * sliceHeight,
//           imgWidth,
//           sliceHeight,
//           0,
//           0,
//           imgWidth,
//           sliceHeight
//         );
  
//         const imgData = canvasPage.toDataURL('image/png');
  
//         if (page > 0) pdf.addPage();
  
//         // 💡 Draw dark background (replace with your color)
//         pdf.setFillColor('#0f172a'); // dark slate color or your app background
//         pdf.rect(0, 0, pdfWidth, pdfHeight, 'F'); // fill entire page
  
//         // Add image on top of colored background
//         pdf.addImage(
//           imgData,
//           'PNG',
//           0,
//           marginTopBottom,
//           pdfWidth,
//           usableHeight
//         );
//       }
  
//       pdf.save('research-document.pdf');
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//     } finally {
//       setIsPrinting(false);
//     }
//   };
  
  
  

//   if (!mounted) return null;

//   return (
//     <div id="content-to-export" className="bg-white dark:bg-gray-900 dark:text-white text-gray-900">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <FiBookOpen className="h-5 w-5" />
//           <h1 className="text-xl font-bold">Research Project</h1>
//         </div>
//         <div className="flex items-center space-x-4">
//           <div className="flex space-x-2">
//             {!isLeader && (
//               <button
//                 onClick={handleCopy}
//                 className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md border border-gray-300"
//               >
//                 <FiCopy className="h-4 w-4" />
//                 <span>{copied ? 'Copied!' : 'Copy'}</span>
//               </button>
//             )}
//             <button
//               onClick={exportToPDF}
//               disabled={isPrinting}
//               className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md bg-black text-white"
//             >
//               <FiDownload className="h-4 w-4" />
//               <span>{isPrinting ? 'Generating...' : 'PDF'}</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="px-6 py-4 border-b border-gray-300">
//         <div className="relative max-w-md">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiSearch className="h-5 w-5 text-gray-500" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search in content..."
//             className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-6 md:p-8 lg:p-10">
//        <div className="prose dark:prose-invert max-w-none prose-pre:bg-gray-900 prose-pre:text-white prose-code:bg-gray-100 prose-code:rounded-md prose-code:px-1.5 prose-code:py-0.5">
//       <ReactMarkdown
//         remarkPlugins={[remarkGfm]}
//         rehypePlugins={[rehypeRaw]}
//         components={{
//           code({ node, inline, className, children, ...props }) {
//             const match = /language-(\w+)/.exec(className || '');
//             const language = match?.[1] || 'javascript'; // fallback to js
//             const rawCode = String(children).replace(/===(.*?)===/g, '<mark>$1</mark>');
          
//             if (!inline) {
//               return (
//                 <SyntaxHighlighter
//                   language={language}
//                   style={dracula}
//                   PreTag="div"
//                   wrapLines
//                   lineProps={{ style: { wordBreak: 'break-word', whiteSpace: 'pre-wrap' } }}
//                   {...props}
//                 >
//                   {rawCode}
//                 </SyntaxHighlighter>
//               );
//             }
          
//             return (
//               <code
//                 dangerouslySetInnerHTML={{ __html: rawCode }}
//                 className="bg-gray-100 px-1.5 py-0.5 rounded"
//               />
//             );
//           },
          
//           mark({ children }) {
//             return <mark className="bg-gray-200 dark:bg-gray-700">{children}</mark>;
//           },
//         }}
//       >
//         {processedContent}
//       </ReactMarkdown>
//        </div>
//       </div>
//     </div>
//   );
// };

// function processContent(content, searchTerm) {
//   // Simplified black and white formatting
//   let html = content
//     .replace(/^## (.*$)/gm, '<h2 class="font-bold mt-8 mb-4 text-2xl">$1</h2>')
//     .replace(/^### (.*$)/gm, '<h3 class="font-semibold mt-6 mb-3 text-xl">$1</h3>')
//     .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded">$1</code>')
//     .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
//     .replace(/\*(.*?)\*/g, '<em>$1</em>')
//     .replace(/^\> (.*$)/gm, '<blockquote class="border-l-2 border-gray-300 pl-4 italic my-4">$1</blockquote>')
//     .replace(/\n\n/g, '</p><p>')
//     .replace(/\n/g, '<br>');

//   // Search term highlighting (gray instead of yellow)
//   if (searchTerm) {
//     const regex = new RegExp(searchTerm, 'gi');
//     html = html.replace(regex, match => `<span class="bg-gray-200">${match}</span>`);
//   }

//   return `<p>${html}</p>`;
// }

// // function processContent(content, searchTerm) {
// //   if (!searchTerm) return content;

// //   const regex = new RegExp(`(${searchTerm})`, 'gi');
// //   return content.replace(regex, '===$1===');
// // }

// export default MergedContentReader;














// "use client";
// import { FiBookOpen, FiSearch, FiCopy, FiDownload } from 'react-icons/fi';
// import { useSession } from "next-auth/react";
// import { useState, useEffect } from "react";
// import html2canvas from 'html2canvas-pro';
// import { jsPDF } from 'jspdf';

// const MergedContentReader = ({ mergedContent }) => {
//   const { mergedContent: content, leaderId } = mergedContent || {};
//   const { data: session } = useSession();
//   const [mounted, setMounted] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [copied, setCopied] = useState(false);
//   const [isPrinting, setIsPrinting] = useState(false);

//   useEffect(() => setMounted(true), []);

//   if (!content) {
//     return (
//       <div className="text-center py-20">
//         <FiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
//         <h3 className="mt-2 text-lg font-medium text-gray-800">
//           No merged content available
//         </h3>
//         <p className="mt-1 text-sm text-gray-500">
//           The leader hasn't merged any approved tasks yet.
//         </p>
//       </div>
//     );
//   }

//   const isLeader = session?.user?.id === leaderId;
//   const processedContent = processContent(content, searchTerm);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(content);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   // const exportToPDF = async () => {
//   //   setIsPrinting(true);
//   //   try {
//   //     const element = document.getElementById('content-to-export');
//   //     if (!element) return;
  
//   //     const canvas = await html2canvas(element, {
//   //       scale: 2,
//   //       useCORS: true,
//   //       backgroundColor: '#ffffff',
//   //     });
  
//   //     const imgData = canvas.toDataURL('image/png');
//   //     const pdf = new jsPDF('p', 'mm', 'a4');
//   //     const pdfWidth = pdf.internal.pageSize.getWidth();
//   //     const pdfHeight = pdf.internal.pageSize.getHeight();
  
//   //     const imgProps = {
//   //       width: canvas.width,
//   //       height: canvas.height,
//   //     };
  
//   //     const imgHeightInMM = (imgProps.height * pdfWidth) / imgProps.width;
//   //     let heightLeft = imgHeightInMM;
//   //     let position = 0;
  
//   //     // First page
//   //     pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInMM);
//   //     heightLeft -= pdfHeight;
  
//   //     // Add more pages if needed
//   //     while (heightLeft > 0) {
//   //       position = heightLeft - imgHeightInMM;
//   //       pdf.addPage();
//   //       pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInMM);
//   //       heightLeft -= pdfHeight;
//   //     }
  
//   //     pdf.save('research-document.pdf');
//   //   } catch (error) {
//   //     console.error('Error generating PDF:', error);
//   //   } finally {
//   //     setIsPrinting(false);
//   //   }
//   // };
  

//   const exportToPDF = async () => {
//     setIsPrinting(true);
//     try {
//       const element = document.getElementById('content-to-export');
//       if (!element) return;
  
//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: null, // Set to null to capture the actual background color
//       });
  
//       const imgWidth = canvas.width;
//       const imgHeight = canvas.height;
  
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();
  
//       const marginTopBottom = 3; // mm
//       const usableHeight = pdfHeight - 2 * marginTopBottom;
  
//       const imgHeightRatio = (pdfWidth / imgWidth);
//       const fullImgHeightInPDF = imgHeight * imgHeightRatio;
//       const totalPages = Math.ceil(fullImgHeightInPDF / usableHeight);
  
//       for (let page = 0; page < totalPages; page++) {
//         const canvasPage = document.createElement('canvas');
//         const context = canvasPage.getContext('2d');
//         const sliceHeight = (usableHeight / imgHeightRatio);
  
//         canvasPage.width = imgWidth;
//         canvasPage.height = sliceHeight;
  
//         context.drawImage(
//           canvas,
//           0,
//           page * sliceHeight,
//           imgWidth,
//           sliceHeight,
//           0,
//           0,
//           imgWidth,
//           sliceHeight
//         );
  
//         const imgData = canvasPage.toDataURL('image/png');
  
//         if (page > 0) pdf.addPage();
  
//         // 💡 Draw dark background (replace with your color)
//         pdf.setFillColor('#0f172a'); // dark slate color or your app background
//         pdf.rect(0, 0, pdfWidth, pdfHeight, 'F'); // fill entire page
  
//         // Add image on top of colored background
//         pdf.addImage(
//           imgData,
//           'PNG',
//           0,
//           marginTopBottom,
//           pdfWidth,
//           usableHeight
//         );
//       }
  
//       pdf.save('research-document.pdf');
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//     } finally {
//       setIsPrinting(false);
//     }
//   };
  
  
  

//   if (!mounted) return null;

//   return (
//     <div id="content-to-export" className="bg-white dark:bg-gray-900 dark:text-white text-gray-900">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <FiBookOpen className="h-5 w-5" />
//           <h1 className="text-xl font-bold">Research Project</h1>
//         </div>
//         <div className="flex items-center space-x-4">
//           <div className="flex space-x-2">
//             {!isLeader && (
//               <button
//                 onClick={handleCopy}
//                 className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md border border-gray-300"
//               >
//                 <FiCopy className="h-4 w-4" />
//                 <span>{copied ? 'Copied!' : 'Copy'}</span>
//               </button>
//             )}
//             <button
//               onClick={exportToPDF}
//               disabled={isPrinting}
//               className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md bg-black text-white"
//             >
//               <FiDownload className="h-4 w-4" />
//               <span>{isPrinting ? 'Generating...' : 'PDF'}</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="px-6 py-4 border-b border-gray-300">
//         <div className="relative max-w-md">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiSearch className="h-5 w-5 text-gray-500" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search in content..."
//             className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-6 md:p-8 lg:p-10">
//         <div
//           className="markdown-content"
//           dangerouslySetInnerHTML={{ __html: processedContent }}
//         />
//       </div>
//     </div>
//   );
// };

// function processContent(content, searchTerm) {
//   // Simplified black and white formatting
//   let html = content
//     .replace(/^## (.*$)/gm, '<h2 class="font-bold mt-8 mb-4 text-2xl">$1</h2>')
//     .replace(/^### (.*$)/gm, '<h3 class="font-semibold mt-6 mb-3 text-xl">$1</h3>')
//     .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded">$1</code>')
//     .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
//     .replace(/\*(.*?)\*/g, '<em>$1</em>')
//     .replace(/^\> (.*$)/gm, '<blockquote class="border-l-2 border-gray-300 pl-4 italic my-4">$1</blockquote>')
//     .replace(/\n\n/g, '</p><p>')
//     .replace(/\n/g, '<br>');

//   // Search term highlighting (gray instead of yellow)
//   if (searchTerm) {
//     const regex = new RegExp(searchTerm, 'gi');
//     html = html.replace(regex, match => `<span class="bg-gray-200">${match}</span>`);
//   }

//   return `<p>${html}</p>`;
// }

// export default MergedContentReader;



// "use client";

// import { FiBookOpen, FiSearch, FiCopy, FiDownload } from 'react-icons/fi';
// import { useSession } from "next-auth/react";
// import { useState, useEffect } from "react";
// import html2canvas from 'html2canvas-pro';
// import { jsPDF } from 'jspdf';

// const MergedContentReader = ({ mergedContent }) => {
//   const { mergedContent: content, leaderId } = mergedContent || {};
//   const { data: session } = useSession();
//   const [mounted, setMounted] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [copied, setCopied] = useState(false);
//   const [isPrinting, setIsPrinting] = useState(false);

//   useEffect(() => setMounted(true), []);

//   if (!content) {
//     return (
//       <div className="text-center py-20">
//         <FiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
//         <h3 className="mt-2 text-lg font-medium text-gray-800">
//           No merged content available
//         </h3>
//         <p className="mt-1 text-sm text-gray-500">
//           The leader hasn't merged any approved tasks yet.
//         </p>
//       </div>
//     );
//   }

//   const isLeader = session?.user?.id === leaderId;
//   const processedContent = processContent(content, searchTerm);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(content);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const exportToPDF = async () => {
//     setIsPrinting(true);
//     try {
//       const element = document.getElementById('content-to-export');
//       if (!element) return;

//       // Create a print-specific clone
//       const printClone = element.cloneNode(true);
//       printClone.id = 'print-clone';
      
//       // Apply print-specific styles
//       printClone.style.width = '210mm';
//       printClone.style.padding = '20mm';
//       printClone.style.backgroundColor = 'white';
//       printClone.style.color = 'black';
      
//       // Remove all color classes
//       const colorClasses = ['text-', 'bg-', 'border-', 'hover:'];
//       printClone.querySelectorAll('*').forEach(el => {
//         if (typeof el.className === 'string') {
//           el.className = el.className
//             .split(' ')
//             .filter(cls => !colorClasses.some(c => cls.startsWith(c)))
//             .join(' ');
//         }
//       });

//       document.body.appendChild(printClone);

//       const canvas = await html2canvas(printClone, {
//         scale: 2,
//         logging: false,
//         backgroundColor: '#000',
//         color: '#fff'
//       });

//       document.body.removeChild(printClone);

//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//       });

//       const imgData = canvas.toDataURL('image/png');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//       pdf.save('research-document.pdf');
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//     } finally {
//       setIsPrinting(false);
//     }
//   };

//   if (!mounted) return null;

//   return (
//     <div id="content-to-export" className="bg-white dark:bg-gray-900 dark:text-white text-gray-900">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <FiBookOpen className="h-5 w-5" />
//           <h1 className="text-xl font-bold">Research Compendium</h1>
//         </div>
//         <div className="flex items-center space-x-4">
//           <div className="flex space-x-2">
//             {!isLeader && (
//               <button
//                 onClick={handleCopy}
//                 className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md border border-gray-300"
//               >
//                 <FiCopy className="h-4 w-4" />
//                 <span>{copied ? 'Copied!' : 'Copy'}</span>
//               </button>
//             )}
//             <button
//               onClick={exportToPDF}
//               disabled={isPrinting}
//               className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md bg-black text-white"
//             >
//               <FiDownload className="h-4 w-4" />
//               <span>{isPrinting ? 'Generating...' : 'PDF'}</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="px-6 py-4 border-b border-gray-300">
//         <div className="relative max-w-md">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiSearch className="h-5 w-5 text-gray-500" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search in content..."
//             className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-6 md:p-8 lg:p-10">
//         <div
//           className="markdown-content"
//           dangerouslySetInnerHTML={{ __html: processedContent }}
//         />
//       </div>
//     </div>
//   );
// };

// function processContent(content, searchTerm) {
//   // Simplified black and white formatting
//   let html = content
//     .replace(/^## (.*$)/gm, '<h2 class="font-bold mt-8 mb-4 text-2xl">$1</h2>')
//     .replace(/^### (.*$)/gm, '<h3 class="font-semibold mt-6 mb-3 text-xl">$1</h3>')
//     .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded">$1</code>')
//     .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
//     .replace(/\*(.*?)\*/g, '<em>$1</em>')
//     .replace(/^\> (.*$)/gm, '<blockquote class="border-l-2 border-gray-300 pl-4 italic my-4">$1</blockquote>')
//     .replace(/\n\n/g, '</p><p>')
//     .replace(/\n/g, '<br>');

//   // Search term highlighting (gray instead of yellow)
//   if (searchTerm) {
//     const regex = new RegExp(searchTerm, 'gi');
//     html = html.replace(regex, match => `<span class="bg-gray-200">${match}</span>`);
//   }

//   return `<p>${html}</p>`;
// }

// export default MergedContentReader;

// "use client";

// import { FiBookOpen, FiSearch, FiCopy, FiDownload } from 'react-icons/fi';
// import { useSession } from "next-auth/react";
// import { useState, useEffect } from "react";
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';

// const MergedContentReader = ({ mergedContent }) => {
//   const { mergedContent: content, leaderId } = mergedContent || {};
//   const { data: session } = useSession();
//   const [mounted, setMounted] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [copied, setCopied] = useState(false);
//   const [isPrinting, setIsPrinting] = useState(false);

//   useEffect(() => setMounted(true), []);

//   const replaceUnsupportedColors = (html) => {
//     // Strip or replace any oklch(...) with nothing
//     return html.replace(/oklch\([^)]+\)/g, '');
//   };

//   if (!content) {
//     return (
//       <div className="text-center py-20">
//         <FiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
//         <h3 className="mt-2 text-lg font-medium text-gray-800">
//           No merged content available
//         </h3>
//         <p className="mt-1 text-sm text-gray-500">
//           The leader hasn't merged any approved tasks yet.
//         </p>
//       </div>
//     );
//   }

//   const isLeader = session?.user?.id === leaderId;
//   const processedContent = processContent(content, searchTerm);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(content);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };


  

//   const exportToPDF = async () => {
//     setIsPrinting(true);
//     try {
//       const element = document.getElementById('content-to-export');
//       if (!element) return;
  
//       const clone = element.cloneNode(true);
//       clone.style.width = '210mm';
//       clone.style.padding = '20mm';
//       document.body.appendChild(clone);
  
//       // 🔥 Remove oklch() from computed styles of all cloned elements
//       const cleanColors = (el) => {
//         const all = el.querySelectorAll('*');
//         all.forEach(node => {
//           const computed = window.getComputedStyle(node);
//           ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
//             const value = computed.getPropertyValue(prop);
//             if (value.includes('oklch')) {
//               node.style[prop] = 'initial';
//             }
//           });
//         });
//       };
//       cleanColors(clone);
  
//       const canvas = await html2canvas(clone, {
//         scale: 3,
//         useCORS: true,
//         allowTaint: true,
//         letterRendering: true,
//         backgroundColor: '#ffffff',
//       });
  
//       document.body.removeChild(clone);
  
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm' });
//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//       pdf.save('research-compendium.pdf');
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//     } finally {
//       setIsPrinting(false);
//     }
//   };
  

//   if (!mounted) return null;

//   return (
//     <div id="content-to-export" className="rounded-xl shadow-xl bg-white dark:bg-gray-900 dark:text-white text-gray-900">
//       {/* Header */}
//       <div className="px-6 py-4 border-b bg-gray-50 border-gray-200 flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <FiBookOpen className="h-5 w-5 text-indigo-600" />
//           <h1 className="text-xl font-bold">Research Compendium</h1>
//         </div>
//         <div className="flex items-center space-x-4">
//           <div className="flex space-x-2">
//             {!isLeader && (
//               <button
//                 onClick={handleCopy}
//                 className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300"
//               >
//                 <FiCopy className="h-4 w-4" />
//                 <span>{copied ? 'Copied!' : 'Copy'}</span>
//               </button>
//             )}
//             <button
//               onClick={exportToPDF}
//               disabled={isPrinting}
//               className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white"
//             >
//               <FiDownload className="h-4 w-4" />
//               <span>{isPrinting ? 'Generating...' : 'PDF'}</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="px-6 py-4 border-b bg-gray-50 border-gray-200">
//         <div className="relative max-w-md">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiSearch className="h-5 w-5 text-gray-500" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search in content..."
//             className="block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Content */}
//       <div className="prose max-w-none p-6 md:p-8 lg:p-10">
//         <div
//           className="markdown-content"
//           dangerouslySetInnerHTML={{ __html: processedContent }}
//         />
//       </div>
//     </div>
//   );
// };

// function processContent(content, searchTerm) {
//   let html = content
//     .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 text-indigo-600">$1</h2>')
//     .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-6 mb-3 text-indigo-500">$1</h3>')
//     .replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-1.5 py-0.5 rounded text-indigo-600">$1</code>')
//     .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
//     .replace(/\*(.*?)\*/g, '<em>$1</em>')
//     .replace(/^\> (.*$)/gm, '<blockquote class="border-l-4 border-indigo-500 pl-4 italic text-gray-700 my-4">$1</blockquote>')
//     .replace(/\n\n/g, '</p><p>')
//     .replace(/\n/g, '<br>');

//   if (searchTerm) {
//     const regex = new RegExp(searchTerm, 'gi');
//     html = html.replace(regex, match => `<span class="bg-yellow-200 text-yellow-800">${match}</span>`);
//   }

//   return `<p>${html}</p>`;
// }

// export default MergedContentReader;








// "use client";

// import { FiBookOpen, FiSearch, FiCopy, FiPrinter, FiDownload, FiSun, FiMoon } from 'react-icons/fi';
// import { useSession } from "next-auth/react";
// import { useState, useEffect } from "react";
// import { useTheme } from 'next-themes';
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';

// // Color conversion map for unsupported colors
// const colorConversionMap = {
//     'oklch(var(--nextui-primary))': '#006FEE', // Example conversion, adjust as needed
//     // Add other color conversions here
//   };
  

// const MergedContentReader = ({ mergedContent }) => {
//   const { mergedContent: content, leaderId } = mergedContent || {};
//   const { data: session } = useSession();
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [copied, setCopied] = useState(false);
//   const [isPrinting, setIsPrinting] = useState(false);

//   useEffect(() => setMounted(true), []);

//   const replaceUnsupportedColors = (html) => {
//     return html.replace(/oklch\([^)]+\)/g, (match) => {
//       return colorConversionMap[match] || '#000000'; // Default to black if no conversion found
//     });
//   };

//   if (!content) {
//     return (
//       <div className="text-center py-20">
//         <FiBookOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
//         <h3 className="mt-2 text-lg font-medium text-gray-800 dark:text-gray-200">
//           No merged content available
//         </h3>
//         <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//           The leader hasn't merged any approved tasks yet.
//         </p>
//       </div>
//     );
//   }

//   const isLeader = session?.user?.id === leaderId;
//   const processedContent = processContent(content, searchTerm);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(content);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };



//   const exportToPDF = async () => {
//     setIsPrinting(true);
//     try {
//       const element = document.getElementById('content-to-export');
//       if (!element) return;

//       // Clone the element to modify styles for PDF
//       const clone = element.cloneNode(true)
//       clone.style.width = '210mm'; // A4 width
//       clone.style.padding = '20mm';
//       document.body.appendChild(clone);
      
//       // Convert oklch colors to supported formats
//       const html = clone.innerHTML;
//       clone.innerHTML = replaceUnsupportedColors(html);

//       const canvas = await html2canvas(clone, {
//         scale: 3, // Higher scale for better quality
//         useCORS: true,
//         allowTaint: true,
//         letterRendering: true,
//         backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
//       });

//       document.body.removeChild(clone);

//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//       });

//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//       pdf.save('research-compendium.pdf');
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//     } finally {
//       setIsPrinting(false);
//     }
//   };

//   if (!mounted) return null;

//   return (
//     <div 
//       id="content-to-export"
//       className={`rounded-xl shadow-xl overflow-hidden transition-colors duration-300 ${
//         theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
//       }`}
//     >
//       {/* Header */}
//       <div className={`px-6 py-4 border-b flex items-center justify-between ${
//         theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
//       }`}>
//         <div className="flex items-center space-x-2">
//           <FiBookOpen className={`h-5 w-5 ${
//             theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
//           }`} />
//           <h1 className="text-xl font-bold">Research Compendium</h1>
//         </div>
        
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//             className={`p-2 rounded-full ${
//               theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
//             }`}
//             aria-label="Toggle dark mode"
//           >
//             {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
//           </button>

//           <div className="flex space-x-2">
//             {!isLeader && (
//               <button
//                 onClick={handleCopy}
//                 className={`flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md transition-colors ${
//                   theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
//                 }`}
//               >
//                 <FiCopy className="h-4 w-4" />
//                 <span>{copied ? 'Copied!' : 'Copy'}</span>
//               </button>
//             )}
            
//             <button
//               onClick={exportToPDF}
//               disabled={isPrinting}
//               className={`flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md transition-colors ${
//                 theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
//               } text-white`}
//             >
//               <FiDownload className="h-4 w-4" />
//               <span>{isPrinting ? 'Generating...' : 'PDF'}</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className={`px-6 py-4 border-b ${
//         theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
//       }`}>
//         <div className="relative max-w-md">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiSearch className={`h-5 w-5 ${
//               theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//             }`} />
//           </div>
//           <input
//             type="text"
//             placeholder="Search in content..."
//             className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
//               theme === 'dark' 
//                 ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
//                 : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
//             }`}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Content */}
//       <div className={`prose max-w-none p-6 md:p-8 lg:p-10 ${
//         theme === 'dark' ? 'prose-invert' : ''
//       }`}>
//         <div 
//           className="markdown-content"
//           dangerouslySetInnerHTML={{ __html: processedContent }}
//         />
//       </div>
//     </div>
//   );
// };

// function processContent(content, searchTerm) {
//   // Basic markdown processing
//   let html = content
//     .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 text-indigo-600 dark:text-indigo-400">$1</h2>')
//     .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-6 mb-3 text-indigo-500 dark:text-indigo-300">$1</h3>')
//     .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-300">$1</code>')
//     .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
//     .replace(/\*(.*?)\*/g, '<em>$1</em>')
//     .replace(/^\> (.*$)/gm, '<blockquote class="border-l-4 border-indigo-500 dark:border-indigo-400 pl-4 italic text-gray-700 dark:text-gray-300 my-4">$1</blockquote>')
//     .replace(/\n\n/g, '</p><p>')
//     .replace(/\n/g, '<br>');

//   // Highlight search term
//   if (searchTerm) {
//     const regex = new RegExp(searchTerm, 'gi');
//     html = html.replace(regex, match => `<span class="bg-yellow-200 dark:bg-yellow-500/30 text-yellow-800 dark:text-yellow-200">${match}</span>`);
//   }

//   return `<p>${html}</p>`;
// }

// export default MergedContentReader;

// "use client";

// import { FiBookOpen, FiSearch, FiCopy, FiPrinter } from 'react-icons/fi';
// import { useSession } from "next-auth/react";
// import { useState } from "react";

// const MergedContentReader = ({mergedContent}) => {

//     const {mergedContent:content, leaderId} = mergedContent || {}

//     const { data: session } = useSession();
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isPrintView, setIsPrintView] = useState(false);
//     const [copied, setCopied] = useState(false);

//     if (!content) {
//         return (
//           <div className="text-center py-20">
//             <FiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-2 text-lg font-medium text-gray-200">No merged content available</h3>
//             <p className="mt-1 text-sm text-gray-500">The leader hasn't merged any approved tasks yet.</p>
//           </div>
//         );
//       }

//   const isLeader = session?.user?.id === leaderId
//   const processedContent = processContent(content, searchTerm);


//   const handleCopy = () => {
//     navigator.clipboard.writeText(content);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className={`bg-gray-900 rounded-xl shadow-xl overflow-hidden ${isPrintView ? 'print-layout' : ''}`}>
//       {/* Header */}
//       <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <FiBookOpen className="h-5 w-5 text-indigo-400" />
//           <h1 className="text-xl font-bold text-white">Research Compendium</h1>
//         </div>
        
//         <div className="flex space-x-3">
//           {!isLeader && (
//             <button
//               onClick={handleCopy}
//               className="flex items-center space-x-1 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md transition-colors"
//             >
//               <FiCopy className="h-4 w-4" />
//               <span>{copied ? 'Copied!' : 'Copy'}</span>
//             </button>
//           )}
          
//           <button
//             onClick={() => setIsPrintView(!isPrintView)}
//             className="flex items-center space-x-1 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md transition-colors"
//           >
//             <FiPrinter className="h-4 w-4" />
//             <span>{isPrintView ? 'Normal View' : 'Print View'}</span>
//           </button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
//         <div className="relative max-w-md">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiSearch className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search in content..."
//             className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Content */}
//       <div className="prose prose-invert max-w-none p-6 md:p-8 lg:p-10">
//         <div 
//           className="markdown-content"
//           dangerouslySetInnerHTML={{ __html: processedContent }}
//         />
//       </div>
//     </div>
//   );
// }



// export default MergedContentReader

// function processContent(content, searchTerm) {
//     // Basic markdown processing (you might want to use a proper markdown library)
//     let html = content
//       .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 text-indigo-300">$1</h2>')
//       .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-6 mb-3 text-indigo-200">$1</h3>')
//       .replace(/`([^`]+)`/g, '<code class="bg-gray-700 px-1.5 py-0.5 rounded text-indigo-200">$1</code>')
//       .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
//       .replace(/\*(.*?)\*/g, '<em>$1</em>')
//       .replace(/^\> (.*$)/gm, '<blockquote class="border-l-4 border-indigo-500 pl-4 italic text-gray-300 my-4">$1</blockquote>')
//       .replace(/\n\n/g, '</p><p>')
//       .replace(/\n/g, '<br>');
  
//     // Highlight search term
//     if (searchTerm) {
//       const regex = new RegExp(searchTerm, 'gi');
//       html = html.replace(regex, match => `<span class="bg-yellow-500/20 text-yellow-300">${match}</span>`);
//     }
  
//     return `<p>${html}</p>`;
//   }