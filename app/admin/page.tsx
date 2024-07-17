import React from 'react';
import Link from 'next/link';
import { FaPlane, FaUsers, FaCalendarAlt, FaTools, FaTrophy, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function AeroClubAdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-68 bg-blue-800 text-white h-screen fixed">
        <div className="p-6">
          <h1 className="text-2xl font-bold">NIT KKR AERO CLUB</h1>
          <p className="text- mt-1 font-medium">Admin Dashboard</p>
        </div>
        <nav className="mt-6">
          <Link href="/admin" className="flex items-center py-3 px-6 bg-blue-900">
            <FaPlane className="mr-3" />
            Dashboard
          </Link>
          <Link href="/admin/blogs" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaUsers className="mr-3" />
            Blogs
          </Link>
          <Link href="/admin/members" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaUsers className="mr-3" />
            Members
          </Link>
          <Link href="/admin/events/create" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaCalendarAlt className="mr-3" />
            Events
          </Link>
          <Link href="/admin/projects" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaTools className="mr-3" />
            Projects
          </Link>
          <Link href="/admin/competitions" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaTrophy className="mr-3" />
            Competitions
          </Link>
          <Link href="/admin/settings" className="flex items-center py-3 px-6 hover:bg-blue-700">
            <FaCog className="mr-3" />
            Settings
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <Link href="/logout" className="flex items-center text-white opacity-75 hover:opacity-100">
            <FaSignOutAlt className="mr-3" />
            Logout
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <header className="bg-white shadow-md rounded-lg mb-8">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Aeromodelling Club Dashboard</h1>
          </div>
        </header>

        <main>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700">Total Members</h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">78</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700">Active Projects</h2>
              <p className="text-3xl font-bold text-green-600 mt-2">5</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700">Upcoming Events</h2>
              <p className="text-3xl font-bold text-yellow-600 mt-2">3</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700">Competitions Won</h2>
              <p className="text-3xl font-bold text-purple-600 mt-2">12</p>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">Recent Activities</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">2023-07-15</td>
                  <td className="px-6 py-4 whitespace-nowrap">Drone Workshop</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">2023-07-20</td>
                  <td className="px-6 py-4 whitespace-nowrap">RC Plane Build</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">In Progress</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">2023-08-05</td>
                  <td className="px-6 py-4 whitespace-nowrap">Inter-College Competition</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Upcoming</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}