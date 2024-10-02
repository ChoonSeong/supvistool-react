import React, { useEffect, useState } from 'react';
import MapArea from '../components/MapArea/MapArea.tsx';

export default function Dashboard() {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      // Update width and height based on the parent container
      setDimensions({
        width: window.innerWidth * 0.8,  // Example to take 80% of the screen width
        height: window.innerHeight * 0.7, // Example to take 70% of the screen height
      });
    };

    // Set initial size
    handleResize();

    // Add event listener to resize dynamically
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        </div>
      </header>
      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
          {/* Map area */}
          <div className="flex-1 bg-white rounded-lg shadow">
            <div className="h-full p-4 flex items-center justify-center text-gray-400">
              <MapArea width={dimensions.width} height={dimensions.height} gridSize={10} markers={[{x: 1, y: 2}, {x: 3, y: 4}]}/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}