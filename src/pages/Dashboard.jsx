import React from 'react';
import MapArea from '../components/MapArea';
export default function Dashboard() {

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-blue-600">iTrack</h1>
            <nav className="ml-10 flex space-x-4">
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700">Online tracking</a>
            </nav>
          </div>
        </div>
      </header>
      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
          {/* Map area */}
          <div className="flex-1 bg-white rounded-lg shadow">
            <div className="h-full p-4 text-gray-400">
              <MapArea/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}