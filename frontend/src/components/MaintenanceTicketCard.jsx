import React from 'react';
import { ClockIcon, UserIcon, WrenchScrewdriverIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const statusStyles = {
  open: 'bg-green-100 text-green-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-gray-100 text-gray-800',
};

const priorityStyles = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const MaintenanceTicketCard = ({ ticket }) => {
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />;
      case 'pending':
        return <div className="h-3 w-3 rounded-full bg-yellow-500" />;
      default:
        return <div className="h-3 w-3 rounded-full bg-green-500" />;
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">{ticket.title}</h3>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <WrenchScrewdriverIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                {ticket.category}
              </div>
              {ticket.building && (
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {ticket.building}
                </div>
              )}
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <div className="flex items-center space-x-1">
              {getStatusIcon(ticket.status)}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[ticket.status] || 'bg-gray-100 text-gray-800'}`}>
                {ticket.status.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">{ticket.description}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                <span>{ticket.assignedTo || 'Unassigned'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityStyles[ticket.priority] || 'bg-gray-100 text-gray-800'}`}>
              {ticket.priority}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Details
          </button>
          {ticket.status !== 'resolved' && (
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {ticket.status === 'in-progress' ? 'Mark as Resolved' : 'Start Working'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTicketCard;
