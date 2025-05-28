"use client";

import { getUserInfo, isLoggedIn } from "@/services/auth.service";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { isLoggedIn, getUserInfo } from "@/services/auth"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
    const [user, setUser] = useState(null);


  // const user = null; // Use this to test logged-out state
useEffect(() => {
    if (isLoggedIn()) {
      const userInfo = getUserInfo();
      setUser(userInfo);
    } else {
      setUser(null);
    }
  }, []);


  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-gray-800 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and menu */}
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl">
              YourLogo
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Profile or Login, and mobile menu toggle */}
          <div className="flex items-center">
            {user ? (
              // Profile dropdown
              <div className="ml-3 relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.image}
                    alt="User profile"
                  />
                </button>

                {profileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <Link
                      href="/logout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              // Login link
              <div className="ml-3">
                <Link
                  href="/login"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <div className="md:hidden ml-3">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"} px-4 pb-4`}>
        <div className="flex flex-col items-start space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {user ? (
          <>
            <div className="mt-4 border-t border-gray-700 pt-4">
              <div className="flex items-center px-3">
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.image}
                  alt=""
                />
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user.name}</div>
                  <div className="text-sm font-medium text-gray-400">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-col items-start space-y-1 px-3">
                <Link
                  href="/profile"
                  className="text-gray-400 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Your Profile
                </Link>
                <Link
                  href="/settings"
                  className="text-gray-400 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Settings
                </Link>
                <Link
                  href="/logout"
                  className="text-gray-400 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign out
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4 border-t border-gray-700 pt-4 px-3">
            <Link
              href="/login"
              className="text-gray-400 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
