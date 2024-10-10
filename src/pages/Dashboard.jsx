import React from 'react';
import MapTrack from '../components/MapTrack';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react'; // Import the Button component

export default function Dashboard() {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogout = () => {
    navigate("/"); // Go back to the previous page
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-blue-600">iTrack</h1>
            <nav className="ml-10 flex space-x-4">
              <Link className="px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700" to={"/maptrack"}>
                Online tracking
              </Link>
            </nav>
          </div>
          {/* Logout Button */}
          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
          {/* Map area */}
          <div className="flex-1 bg-white rounded-lg shadow">
            <div className="h-full p-4 text-gray-400">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
