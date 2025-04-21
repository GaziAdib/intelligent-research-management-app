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
        removeContainer:false
      });

      // const canvas = await html2canvas(element, {
      //   scale: 1.2,
      //   useCORS: true,
      //   backgroundColor: null,
      //   logging: false,
      //   allowTaint: true,
      //   ignoreElements: (element) => {
      //     // Ignore any background elements you don't want in the PDF
      //     return element.classList.contains('background-element');
      //   }
      // });
  
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
      className="bg-white dark:bg-transparent dark:text-white text-gray-900"
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


