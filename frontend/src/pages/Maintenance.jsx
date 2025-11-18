import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  FunnelIcon, 
  SearchIcon, 
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import MaintenanceTicketCard from '../components/MaintenanceTicketCard';

const Maintenance = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all'
  });

  // Mock data - replace with API call
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        // Mock data
        const mockTickets = [
          {
            id: 'TKT-001',
            title: 'AC Not Working',
            description: 'The air conditioning in Room 203 is not cooling properly.',
            status: 'open',
            priority: 'high',
            category: 'HVAC',
            assignedTo: 'John Doe',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            updatedAt: new Date().toISOString(),
            building: 'Main Building',
            room: '203',
            reportedBy: 'Jane Smith',
            attachments: []
          },
          {
            id: 'TKT-002',
            title: 'Leaky Faucet',
            description: 'The faucet in the 2nd floor restroom is leaking.',
            status: 'in_progress',
            priority: 'medium',
            category: 'Plumbing',
            assignedTo: 'Mike Johnson',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            updatedAt: new Date().toISOString(),
            building: 'Science Building',
            room: '2F Restroom',
            reportedBy: 'Alex Brown',
            attachments: ['leak.jpg']
          },
          {
            id: 'TKT-003',
            title: 'Broken Chair',
            description: 'Chair in Room 105 has a broken leg.',
            status: 'completed',
            priority: 'low',
            category: 'Furniture',
            assignedTo: 'Sarah Wilson',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            building: 'Arts Building',
            room: '105',
            reportedBy: 'Robert Chen',
            attachments: []
          },
          {
            id: 'TKT-004',
            title: 'Flickering Lights',
            description: 'Lights in the hallway are flickering on the 3rd floor.',
            status: 'open',
            priority: 'high',
            category: 'Electrical',
            assignedTo: 'David Kim',
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            updatedAt: new Date().toISOString(),
            building: 'Main Building',
            room: '3F Hallway',
            reportedBy: 'Lisa Wang',
            attachments: ['lights.jpg']
          }
        ];
        
        setTickets(mockTickets);
      } catch (error) {
        console.error('Error fetching maintenance tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    // Search filter
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status === 'all' || ticket.status === filters.status;
    
    // Priority filter
    const matchesPriority = filters.priority === 'all' || ticket.priority === filters.priority;
    
    // Category filter
    const matchesCategory = filters.category === 'all' || ticket.category === filters.category;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getStatusCount = (status) => {
    return tickets.filter(ticket => ticket.status === status).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Tickets</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Ticket
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Open Tickets</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{getStatusCount('open')}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <WrenchScrewdriverIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{getStatusCount('in_progress')}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{getStatusCount('completed')}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                <XCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">0</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="priority-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredTickets.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <MaintenanceTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(filters).some(f => f !== 'all')
                ? 'Try adjusting your search or filter criteria.'
                : 'No tickets have been created yet.'}
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
