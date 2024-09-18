import React, { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  Eye,
  FileText,
  History,
  Settings,
} from "lucide-react";

export default function Dashboard() {
  const [selectData, setSelectData] = useState([]);

  useEffect(() => {
    let processing = true;
    fetchData(processing);
    return () => {
      processing = false;
    };
  }, []);

  const fetchData = async (processing) => {
    const option = { method: "GET" };
    await fetch("http://localhost:4000/gateway1", option)
      .then((response) => response.json())
      .then((data) => {
        if (processing) {
          setSelectData(data);
        }
      })
      .catch((error) => console.log("Error: ", error));
  };

  const ShowData = () => {
    return (
      <div>
        {selectData?.map((data) => (
          <div key={data.gateway}>
            <h3>Gateway: {data.gateway}</h3>

            {data.devices.map((device, index) => (
              <div key={index}>
                <p>MAC: {device.mac}</p>
                <p>Timestamp: {device.timestamp}</p>
                <p>RSSI: {device.rssi}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-blue-600">Navigine</h1>
            <nav className="ml-10 flex space-x-4">
              <a
                href="#"
                className="px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700"
              >
                Online tracking
              </a>
              <a
                href="#"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Track history
              </a>
              <a
                href="#"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Reports
              </a>
              <a
                href="#"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Settings
              </a>
            </nav>
          </div>
          <div className="flex items-center">
            <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center">
              Factory 5
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
            <button className="ml-4 p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
          {/* Sidebar */}
          <div className="w-64 pr-8">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <select
                  id="location"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option>Factory 5</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="floor"
                  className="block text-sm font-medium text-gray-700"
                >
                  Floor
                </label>
                <select
                  id="floor"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option>Area 7</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="zone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Zone
                </label>
                <select
                  id="zone"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option>None</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="group"
                  className="block text-sm font-medium text-gray-700"
                >
                  Group
                </label>
                <select
                  id="group"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option>All</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="object"
                  className="block text-sm font-medium text-gray-700"
                >
                  Object
                </label>
                <select
                  id="object"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option>Select object</option>
                </select>
              </div>
            </div>
            <div className="mt-8">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <Eye className="mr-2 h-4 w-4" />
                Draw tracks
              </button>
            </div>
            <div className="mt-8 space-y-2">
              <p className="text-sm text-gray-500">Objects on the floor: 6</p>
              <p className="text-sm text-gray-500">
                Objects in the building: 6
              </p>
            </div>
          </div>

          {/* Map area */}
          <div className="flex-1 bg-white rounded-lg shadow">
            <div className="h-full p-4 flex items-center justify-center text-gray-400">
              Map area (not implemented)
            </div>
          </div>
        </div>
      </main>
      <div>
        <ShowData />
      </div>
    </div>
  );
}
