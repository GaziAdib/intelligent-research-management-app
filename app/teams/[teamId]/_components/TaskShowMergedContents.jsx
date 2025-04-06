"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

const RichTextEditor = dynamic(() => import("./textEditor/RichTextEditor"), {
  ssr: false,
});

const TaskShowMergedContents = ({mergedContent}) => {

  let {mergedContent:content, leaderId } = mergedContent || {}

  const session = useSession();

  const userId = session?.data?.user?.id

  if (!mergedContent) {
    return <div className="max-w-3xl mx-auto p-4">No content available</div>;
  }

return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      <RichTextEditor 
        value={content} 
        readOnly={userId === leaderId ? false : true} 
        theme="snow" 
        className="dark:bg-gray-800 dark:text-white" 
      />
    </div>
    );
  
}

export default TaskShowMergedContents