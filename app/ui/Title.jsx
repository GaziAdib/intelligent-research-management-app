"use client";


const Title = ({ title }) => {
  return (
    <div className="relative inline-block px-8 py-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold text-lg lg:text-2xl md:text-xl uppercase shadow-lg rounded-md">
      <span className="relative z-10">{title}</span>
      <div className="absolute bg-purple-900 inset-0 transform skew-x-12">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900 opacity-90"></div>
      </div>
      {/* <div className="absolute top-0 right-0 w-2 h-2 bg-gray-700 transform rotate-45 translate-x-4 -translate-y-4 shadow-md"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-gray-600 transform rotate-45 translate-x-4 translate-y-4 shadow-md"></div> */}
    </div>
  );
};

export default Title;