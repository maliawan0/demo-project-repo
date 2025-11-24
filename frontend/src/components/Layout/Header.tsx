import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="inline-block font-bold text-lg text-gray-900 dark:text-gray-100">
            AI Commercial Query
          </span>
        </Link>
        <nav className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-gray-700 dark:text-gray-300 hidden md:inline">
                Welcome, {user?.username}!
              </span>
              <Link to="/input-form">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Start New Analysis
                </Button>
              </Link>
              <Link to="/my-analyses"> {/* New link for Analysis History */}
                <Button variant="ghost" className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                  My Analyses
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                  Settings
                </Button>
              </Link>
              <Button variant="ghost" onClick={logout} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;