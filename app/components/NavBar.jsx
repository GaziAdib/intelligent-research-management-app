"use client";

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';


const Navbar = () => {

  const session = useSession();

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const pathname = usePathname();

    return (
      <nav className={`fixed top-0 w-full bg-white dark:bg-gray-900 bg-opacity-30 backdrop-blur-md shadow-lg z-50`}>
        <div className="mx-auto px-4 ml-10 mr-10 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex bg-gray-900 mt-2 items-center space-x-3">
              {/* Logo with shadow */}
              <div className="w-12 h-12 rounded-full shadow-md bg-gray-100 overflow-hidden">
                <Link href="/">
                  <img
                    src="https://pbs.twimg.com/media/FirD77HVUAAZ4LV?format=jpg&name=small" // Replace with the correct path to your logo
                    alt="Gazi Adib Logo"
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>

              {/* Name */}
              <Link
                href="/"
                className="text-xl text-gray-900 font-bold dark:text-gray-200"
              >
                {session?.data?.user?.username ? session?.data?.user?.username: 'Gazi Adib' }
              </Link>
            </div>
            <div className="hidden mt-2 sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2 text-sm lg:text-lg font-medium dark:bg-gray-900 rounded-xl shadow-lg">Home</Link>
              <Link href="/teams" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2 rounded-md  text-sm lg:text-lg font-medium">Teams</Link>
              <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2 rounded-md text-sm lg:text-lg font-medium">Blogs</Link>
              
                {
                  session?.data?.user?.role === 'ADMIN' && <Link href="/admin-panel" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 my-3 rounded-md  font-medium">Admin</Link>
                }
                {
                  session?.data?.user?.role === 'ADMIN' && <Link href={`/admin-panel/profile/update/${session?.data?.user?.id}`} className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 my-3 rounded-md  font-medium">Setting</Link>
                }
                {
                session?.data?.user?.role === 'ADMIN' && (
                    <button
                      onClick={() => signOut()} 
                      className="text-gray-200  dark:hover:text-red-600 px-2 my-2 rounded-md text-sm font-medium flex items-center"
                    >
                    <FaSignOutAlt className="mr-1" /> {/* Add the icon with a margin on the right */}
                      Logout
                  </button>
                )
              }
              
            </div>
            <div className="-mr-2 flex sm:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center px-3  my-1 bg-gray-300 dark:bg-gray-800 shadow-lg  rounded-md text-gray-800 hover:text-white  focus:outline-none focus:text-white"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6 dark:text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
  
        {isOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
              <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium">Projects</Link>
              <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium">Courses</Link>
              <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium">Blogs</Link>
         
              {
                session?.data?.user?.role === 'ADMIN' &&  <Link href="/admin-panel" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium">Admin</Link>
              }
              {
                session?.data?.user?.role === 'ADMIN' && <Link href={`/admin-panel/profile/update/${session?.data?.user?.id}`} className="text-gray-800 dark:text-gray-200 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">Settings</Link>
              }
               {
                session?.data?.user?.role === 'ADMIN' && (
                    <button
                      onClick={() => signOut()} 
                      className="text-gray-200  dark:hover:text-red-600 px-3 py-3 my-2 rounded-md text-sm font-medium flex items-center"
                    >
                    <FaSignOutAlt className="mr-2 mx-1" /> {/* Add the icon with a margin on the right */}
                      Logout
                  </button>
                )
              }
            </div>
          </div>
        )}
      </nav>
    );

  
};

export default Navbar;