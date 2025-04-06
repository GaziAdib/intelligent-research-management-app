"use client";

import Title from "../ui/Title";



const ShimmerLoader = ({title}) => {
  return (

    <>
        <div className="px-4 mx-4 my-5 py-5 items-center">
            <Title title={title} />
        </div>
       

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">

        {Array.from({ length: 6 }).map((_, index) => (
            <div
                key={index}
                className="p-4 border border-gray-600 rounded-lg shadow-md dark:bg-gray-900"
            >
                {/* Header shimmer */}
                <div className="h-6 bg-gray-800 rounded w-2/3 animate-pulse mb-4"></div>

                {/* Image shimmer */}
                <div className="h-32 bg-gray-800 rounded-md animate-pulse mb-4"></div>

                {/* Body shimmer blocks */}
                <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </div>
            </div>
            ))}
        </div>
    </>
   
  );
};

export default ShimmerLoader