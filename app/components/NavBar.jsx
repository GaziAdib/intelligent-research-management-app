"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaSignOutAlt, FaBell, FaUserCog, FaHome, FaUsers, FaBlog } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import Notifications from "./Notifications";

const Navbar = () => {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true); // State for unread notifications
  const notificationsRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const currentUserId = session?.data?.user?.id;
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    // When notifications are opened, mark as read
    if (!showNotifications && hasUnreadNotifications) {
      setHasUnreadNotifications(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/", label: "Home", icon: <FaHome className="mr-2" /> },
    { href: "/teams", label: "Teams", icon: <FaUsers className="mr-2" /> },
    { href: "/blogs", label: "Blogs", icon: <FaBlog className="mr-2" /> },
  ];

  return (
    <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden shadow-lg">
                <img
                  src="https://pbs.twimg.com/media/FirD77HVUAAZ4LV?format=jpg&name=small"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
                {session?.data?.user?.username || "TaskFlow"}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${pathname === item.href ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/50 relative"
              >
                <FaBell size={18} />
                {/* Unread indicator - only shows when hasUnreadNotifications is true */}
                {hasUnreadNotifications && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              {showNotifications && (
                <div ref={notificationsRef} className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                  <Notifications />
                </div>
              )}
            </div>

            {/* Admin Links */}
            {session?.data?.user?.role === "ADMIN" && (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${pathname.includes('/admin') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                >
                  <FaUserCog className="mr-2" />
                  Admin
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="mobile-menu-button p-2 text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-3 text-base font-medium rounded-lg ${pathname === item.href ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            {/* Admin Links */}
            {session?.data?.user?.role === "ADMIN" && (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center px-3 py-3 text-base font-medium rounded-lg ${pathname.includes('/admin') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                >
                  <FaUserCog className="mr-2" />
                  Admin Panel
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center w-full px-3 py-3 text-base font-medium text-gray-400 hover:text-red-400"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            )}

            {/* Mobile Notifications */}
            <button
              onClick={toggleNotifications}
              className="flex items-center w-full px-3 py-3 text-base font-medium text-gray-400 hover:text-white relative"
            >
              <FaBell className="mr-2" />
              Notifications
              {/* Mobile unread indicator */}
              {hasUnreadNotifications && (
                <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Notifications Dropdown */}
      {showNotifications && (
        <div ref={notificationsRef} className="md:hidden fixed inset-0 bg-gray-900/95 z-50 pt-16 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Notifications</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-white"
              >
                <HiX size={24} />
              </button>
            </div>
            <Notifications />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;





// "use client";

// import { signOut, useSession } from "next-auth/react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState, useRef, useEffect } from "react";
// import { FaSignOutAlt, FaBell, FaUserCog, FaHome, FaUsers, FaBlog } from "react-icons/fa";
// import { HiMenuAlt3, HiX } from "react-icons/hi";
// import Notifications from "./Notifications";

// const Navbar = () => {
//   const session = useSession();
//   const [isOpen, setIsOpen] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const notificationsRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const currentUserId = session?.data?.user?.id;
//   const pathname = usePathname();

//   const toggleMenu = () => setIsOpen(!isOpen);
//   const toggleNotifications = () => setShowNotifications(!showNotifications);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
//         setShowNotifications(false);
//       }
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Close mobile menu when navigating
//   useEffect(() => {
//     setIsOpen(false);
//   }, [pathname]);

//   const navItems = [
//     { href: "/", label: "Home", icon: <FaHome className="mr-2" /> },
//     { href: "/teams", label: "Teams", icon: <FaUsers className="mr-2" /> },
//     { href: "/blogs", label: "Blogs", icon: <FaBlog className="mr-2" /> },
//   ];

//   return (
//     <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 shadow-xl z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           {/* Logo/Brand */}
//           <div className="flex items-center space-x-3">
//             <Link href="/" className="flex items-center">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden shadow-lg">
//                 <img
//                   src="https://pbs.twimg.com/media/FirD77HVUAAZ4LV?format=jpg&name=small"
//                   alt="Logo"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
//                 {session?.data?.user?.username || "TaskFlow"}
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-6">
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${pathname === item.href ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
//               >
//                 {item.icon}
//                 {item.label}
//               </Link>
//             ))}

//             {/* Notifications */}
//             <div className="relative">
//               <button
//                 onClick={toggleNotifications}
//                 className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/50 relative"
//               >
//                 <FaBell size={18} />
//                 {/* Unread indicator - replace with actual count */}
//                 <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>
//               {showNotifications && (
//                 <div ref={notificationsRef} className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
//                   <Notifications />
//                 </div>
//               )}
//             </div>

//             {/* Admin Links */}
//             {session?.data?.user?.role === "ADMIN" && (
//               <>
//                 <Link
//                   href="/admin/dashboard"
//                   className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${pathname.includes('/admin') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
//                 >
//                   <FaUserCog className="mr-2" />
//                   Admin
//                 </Link>
//                 <button
//                   onClick={() => signOut()}
//                   className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
//                 >
//                   <FaSignOutAlt className="mr-2" />
//                   Logout
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={toggleMenu}
//               className="mobile-menu-button p-2 text-gray-400 hover:text-white focus:outline-none"
//             >
//               {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div ref={mobileMenuRef} className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
//           <div className="px-2 pt-2 pb-3 space-y-1">
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`flex items-center px-3 py-3 text-base font-medium rounded-lg ${pathname === item.href ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
//               >
//                 {item.icon}
//                 {item.label}
//               </Link>
//             ))}

//             {/* Admin Links */}
//             {session?.data?.user?.role === "ADMIN" && (
//               <>
//                 <Link
//                   href="/admin/dashboard"
//                   className={`flex items-center px-3 py-3 text-base font-medium rounded-lg ${pathname.includes('/admin') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
//                 >
//                   <FaUserCog className="mr-2" />
//                   Admin Panel
//                 </Link>
//                 <button
//                   onClick={() => signOut()}
//                   className="flex items-center w-full px-3 py-3 text-base font-medium text-gray-400 hover:text-red-400"
//                 >
//                   <FaSignOutAlt className="mr-2" />
//                   Logout
//                 </button>
//               </>
//             )}

//             {/* Mobile Notifications */}
//             <button
//               onClick={toggleNotifications}
//               className="flex items-center w-full px-3 py-3 text-base font-medium text-gray-400 hover:text-white"
//             >
//               <FaBell className="mr-2" />
//               Notifications
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Mobile Notifications Dropdown */}
//       {showNotifications && (
//         <div ref={notificationsRef} className="md:hidden fixed inset-0 bg-gray-900/95 z-50 pt-16 overflow-y-auto">
//           <div className="p-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-white">Notifications</h3>
//               <button 
//                 onClick={() => setShowNotifications(false)}
//                 className="text-gray-400 hover:text-white"
//               >
//                 <HiX size={24} />
//               </button>
//             </div>
//             <Notifications />
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;









// "use client";

// import { signOut, useSession } from "next-auth/react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState, useRef, useEffect } from "react";
// import { FaSignOutAlt, FaBell } from "react-icons/fa";
// import Notifications from "./Notifications";

// const Navbar = () => {
//   const session = useSession();
//   const [isOpen, setIsOpen] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const notificationsRef = useRef(null); // Ref for the notifications dropdown

//   const currentUserId = session?.data?.user?.id;

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const toggleNotifications = () => {
//     setShowNotifications(!showNotifications);
//   };

//   // Close notifications when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         notificationsRef.current &&
//         !notificationsRef.current.contains(event.target)
//       ) {
//         setShowNotifications(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const pathname = usePathname();

//   return (
//     <nav
//       className={`fixed top-0 w-full bg-white dark:bg-gray-900 bg-opacity-30 backdrop-blur-md shadow-lg z-50`}
//     >
//       <div className="mx-auto px-4 ml-10 mr-10 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           <div className="flex-shrink-0 flex bg-gray-900 mt-2 items-center space-x-3">
//             <div className="w-12 h-12 rounded-full shadow-md bg-gray-100 overflow-hidden">
//               <Link href="/">
//                 <img
//                   src="https://pbs.twimg.com/media/FirD77HVUAAZ4LV?format=jpg&name=small"
//                   alt="Gazi Adib Logo"
//                   className="w-full h-full object-cover"
//                 />
//               </Link>
//             </div>
//             <Link
//               href="/"
//               className="text-xl text-gray-900 font-bold dark:text-gray-200"
//             >
//               {session?.data?.user?.username
//                 ? session?.data?.user?.username
//                 : "Gazi Adib"}
//             </Link>
//           </div>
//           <div className="hidden sm:flex sm:space-x-8 items-center">
//             <Link
//               href="/"
//               className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2 text-sm lg:text-lg font-medium dark:bg-gray-900 rounded-xl shadow-lg"
//             >
//               Home
//             </Link>
//             <Link
//               href="/teams"
//               className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2 text-sm lg:text-lg font-medium"
//             >
//               Teams
//             </Link>
//             {session?.data?.user?.role === "ADMIN" && (
//               <Link
//                 href="/admin/dashboard"
//                 className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 rounded-md font-medium"
//               >
//                 Admin
//               </Link>
//             )}
//             <Link
//               href="/blogs"
//               className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2 text-sm lg:text-lg font-medium"
//             >
//               Blogs
//             </Link>

//             {/* Notification Bell Icon */}
//             <button
//               onClick={toggleNotifications}
//               className="relative text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2"
//             >
//               <FaBell size={20} />
//               {/* Unread Notification Count */}
//               {/* Replace `unreadNotificationsCount` with the actual count from your state or API */}
//               {/* <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
//                 {unreadNotificationsCount}
//               </span> */}
//             </button>

//             {session?.data?.user?.role === "ADMIN" && (
//               <Link
//                 href="/admin-panel"
//                 className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 rounded-md font-medium"
//               >
//                 Admin
//               </Link>
//             )}
//             {session?.data?.user?.role === "ADMIN" && (
//               <Link
//                 href={`/admin-panel/profile/update/${session?.data?.user?.id}`}
//                 className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 rounded-md font-medium"
//               >
//                 Settings
//               </Link>
//             )}
//             {session?.data?.user?.role === "ADMIN" && (
//               <button
//                 onClick={() => signOut()}
//                 className="text-gray-200 dark:hover:text-red-600 px-2 rounded-md text-sm font-medium flex items-center"
//               >
//                 <FaSignOutAlt className="mr-1" /> Logout
//               </button>
//             )}
//           </div>
//           <div className="-mr-2 flex sm:hidden">
//             <button
//               onClick={toggleMenu}
//               type="button"
//               className="px-3 my-1 bg-gray-300 dark:bg-gray-800 shadow-lg rounded-md text-gray-800 hover:text-white"
//             >
//               <svg
//                 className="h-6 w-6 dark:text-white"
//                 stroke="currentColor"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 {isOpen ? (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 ) : (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Notifications Dropdown */}
//       {showNotifications && (
//         <div ref={notificationsRef} className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50">
//           <Notifications  />
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;






// "use client";

// import { signOut, useSession } from 'next-auth/react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useState } from 'react';
// import { FaSignOutAlt, FaBell } from 'react-icons/fa';
// import Notifications from './Notifications';

// const Navbar = () => {
//   const session = useSession();
//   const [isOpen, setIsOpen] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const toggleNotifications = () => {
//     setShowNotifications(!showNotifications);
//   };

//   const pathname = usePathname();

//   return (
//     <nav className={`fixed top-0 w-full bg-white dark:bg-gray-900 bg-opacity-30 backdrop-blur-md shadow-lg z-50`}>
//       <div className="mx-auto px-4 ml-10 mr-10 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           <div className="flex-shrink-0 flex bg-gray-900 mt-2 items-center space-x-3">
//             <div className="w-12 h-12 rounded-full shadow-md bg-gray-100 overflow-hidden">
//               <Link href="/">
//                 <img
//                   src="https://pbs.twimg.com/media/FirD77HVUAAZ4LV?format=jpg&name=small"
//                   alt="Gazi Adib Logo"
//                   className="w-full h-full object-cover"
//                 />
//               </Link>
//             </div>
//             <Link href="/" className="text-xl text-gray-900 font-bold dark:text-gray-200">
//               {session?.data?.user?.username ? session?.data?.user?.username : 'Gazi Adib'}
//             </Link>
//           </div>
//           <div className="hidden sm:flex sm:space-x-8 items-center">
//             <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2 text-sm lg:text-lg font-medium dark:bg-gray-900 rounded-xl shadow-lg">Home</Link>
//             <Link href="/teams" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2 text-sm lg:text-lg font-medium">Teams</Link>
//             <Link href="/blogs" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2 text-sm lg:text-lg font-medium">Blogs</Link>
            
//             <button onClick={toggleNotifications} className="relative text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2">
//               <FaBell size={20} />
//               {notifications.length > 0 && (
//                 <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{notifications.length}</span>
//               )}
//             </button>
            
//             {session?.data?.user?.role === 'ADMIN' && <Link href="/admin-panel" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 rounded-md font-medium">Admin</Link>}
//             {session?.data?.user?.role === 'ADMIN' && <Link href={`/admin-panel/profile/update/${session?.data?.user?.id}`} className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 rounded-md font-medium">Settings</Link>}
//             {session?.data?.user?.role === 'ADMIN' && (
//               <button onClick={() => signOut()} className="text-gray-200 dark:hover:text-red-600 px-2 rounded-md text-sm font-medium flex items-center">
//                 <FaSignOutAlt className="mr-1" /> Logout
//               </button>
//             )}
//           </div>
//           <div className="-mr-2 flex sm:hidden">
//             <button onClick={toggleMenu} type="button" className="px-3 my-1 bg-gray-300 dark:bg-gray-800 shadow-lg rounded-md text-gray-800 hover:text-white">
//               <svg className="h-6 w-6 dark:text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
//                 {isOpen ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {showNotifications && (
//           <Notifications />
//       )}
//     </nav>
//   );
// };

// export default Navbar;






// "use client";

// import { signOut, useSession } from 'next-auth/react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useState } from 'react';
// import { FaSignOutAlt } from 'react-icons/fa';


// const Navbar = () => {

//   const session = useSession();

//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const pathname = usePathname();

//     return (
//       <nav className={`fixed top-0 w-full bg-white dark:bg-gray-900 bg-opacity-30 backdrop-blur-md shadow-lg z-50`}>
//         <div className="mx-auto px-4 ml-10 mr-10 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//           <div className="flex-shrink-0 flex bg-gray-900 mt-2 items-center space-x-3">
//               {/* Logo with shadow */}
//               <div className="w-12 h-12 rounded-full shadow-md bg-gray-100 overflow-hidden">
//                 <Link href="/">
//                   <img
//                     src="https://pbs.twimg.com/media/FirD77HVUAAZ4LV?format=jpg&name=small" // Replace with the correct path to your logo
//                     alt="Gazi Adib Logo"
//                     className="w-full h-full object-cover"
//                   />
//                 </Link>
//               </div>

//               {/* Name */}
//               <Link
//                 href="/"
//                 className="text-xl text-gray-900 font-bold dark:text-gray-200"
//               >
//                 {session?.data?.user?.username ? session?.data?.user?.username: 'Gazi Adib' }
//               </Link>
//             </div>
//             <div className="hidden mt-2 sm:ml-6 sm:flex sm:space-x-8">
//               <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2 text-sm lg:text-lg font-medium dark:bg-gray-900 rounded-xl shadow-lg">Home</Link>
//               <Link href="/teams" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2 rounded-md  text-sm lg:text-lg font-medium">Teams</Link>
//               <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2 rounded-md text-sm lg:text-lg font-medium">Blogs</Link>
              
//                 {
//                   session?.data?.user?.role === 'ADMIN' && <Link href="/admin-panel" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 my-3 rounded-md  font-medium">Admin</Link>
//                 }
//                 {
//                   session?.data?.user?.role === 'ADMIN' && <Link href={`/admin-panel/profile/update/${session?.data?.user?.id}`} className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 my-3 rounded-md  font-medium">Setting</Link>
//                 }
//                 {
//                 session?.data?.user?.role === 'ADMIN' && (
//                     <button
//                       onClick={() => signOut()} 
//                       className="text-gray-200  dark:hover:text-red-600 px-2 my-2 rounded-md text-sm font-medium flex items-center"
//                     >
//                     <FaSignOutAlt className="mr-1" /> {/* Add the icon with a margin on the right */}
//                       Logout
//                   </button>
//                 )
//               }
              
//             </div>
//             <div className="-mr-2 flex sm:hidden">
//               <button
//                 onClick={toggleMenu}
//                 type="button"
//                 className="inline-flex items-center justify-center px-3  my-1 bg-gray-300 dark:bg-gray-800 shadow-lg  rounded-md text-gray-800 hover:text-white  focus:outline-none focus:text-white"
//               >
//                 <span className="sr-only">Open main menu</span>
//                 <svg className="h-6 w-6 dark:text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
//                   {isOpen ? (
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   ) : (
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                   )}
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
  
//         {isOpen && (
//           <div className="sm:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
//               <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium">Projects</Link>
//               <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium">Courses</Link>
//               <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium">Blogs</Link>
         
//               {
//                 session?.data?.user?.role === 'ADMIN' &&  <Link href="/admin-panel" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium">Admin</Link>
//               }
//               {
//                 session?.data?.user?.role === 'ADMIN' && <Link href={`/admin-panel/profile/update/${session?.data?.user?.id}`} className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">Settings</Link>
//               }
//                {
//                 session?.data?.user?.role === 'ADMIN' && (
//                     <button
//                       onClick={() => signOut()} 
//                       className="text-gray-200  dark:hover:text-red-600 px-3 py-3 my-2 rounded-md text-sm font-medium flex items-center"
//                     >
//                     <FaSignOutAlt className="mr-2 mx-1" /> {/* Add the icon with a margin on the right */}
//                       Logout
//                   </button>
//                 )
//               }
//             </div>
//           </div>
//         )}
//       </nav>
//     );

  
// };

// export default Navbar;