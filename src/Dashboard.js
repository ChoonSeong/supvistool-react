import React from 'react';

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-blue-600">iTrack</h1>
            <nav className="ml-10 flex space-x-4">
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700">Online tracking</a>
            </nav>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
          {/* Map area */}
          <div className="flex-1 bg-white rounded-lg shadow">
            <div className="h-full p-4 flex items-center justify-center text-gray-400">
              Map area (not implemented)
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}