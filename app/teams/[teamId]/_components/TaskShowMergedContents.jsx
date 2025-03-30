"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("./textEditor/RichTextEditor"), {
  ssr: false,
});

const TaskShowMergedContents = ({mergedContent}) => {

return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      <RichTextEditor 
        value={mergedContent} 
        readOnly={true} 
        theme="snow" 
        className="dark:bg-gray-800 dark:text-white" 
      />
    </div>
    );
  
}

export default TaskShowMergedContents