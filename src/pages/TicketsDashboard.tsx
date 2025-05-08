
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for tickets
const ticketsData = [
  { id: 'T1001', subject: 'KYC Document Rejection Issue', requester: 'emma.wilson@example.com', status: 'open', priority: 'high', createdAt: '2023-06-01', category: 'KYC', assignee: 'John Smith' },
  { id: 'T1002', subject: 'Account Locked After Risk Assessment', requester: 'michael.brown@example.com', status: 'in_progress', priority: 'high', createdAt: '2023-06-02', category: 'Risk', assignee: 'Sarah Johnson' },
  { id: 'T1003', subject: 'Failed Transaction After KYC Approval', requester: 'james.taylor@example.com', status: 'pending', priority: 'medium', createdAt: '2023-06-03', category: 'Transactions', assignee: 'Unassigned' },
  { id: 'T1004', subject: 'Wrong Risk Score Calculation', requester: 'lisa.johnson@example.com', status: 'open', priority: 'low', createdAt: '2023-06-03', category: 'Risk', assignee: 'Robert Chen' },
  { id: 'T1005', subject: 'Need to Upload Additional Documents', requester: 'karen.davis@example.com', status: 'in_progress', priority: 'medium', createdAt: '2023-06-04', category: 'KYC', assignee: 'John Smith' },
  { id: 'T1006', subject: 'Verification Process Taking Too Long', requester: 'daniel.lee@example.com', status: 'open', priority: 'high', createdAt: '2023-06-04', category: 'KYC', assignee: 'Sarah Johnson' },
  { id: 'T1007', subject: 'False Positive on Risk Alert', requester: 'robert.martin@example.com', status: 'closed', priority: 'medium', createdAt: '2023-06-05', category: 'Risk', assignee: 'Robert Chen' },
  { id: 'T1008', subject: 'Document Upload Failure', requester: 'patricia.white@example.com', status: 'closed', priority: 'low', createdAt: '2023-06-05', category: 'KYC', assignee: 'John Smith' },
];

const TicketsDashboard: React.FC = () => {
  useRequireAuth('viewer');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Open</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Pending</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredTickets = ticketsData.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchesCategory = categoryFilter ? ticket.category === categoryFilter : true;
    const matchesPriority = priorityFilter ? ticket.priority === priorityFilter : true;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const resetFilters = () => {
    setStatusFilter('');
    setCategoryFilter('');
    setPriorityFilter('');
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets</h1>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ticketsData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ticketsData.filter(t => t.status === 'open').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ticketsData.filter(t => t.status === 'in_progress').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ticketsData.filter(t => t.priority === 'high').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>View and manage support tickets related to KYC and Risk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search tickets..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <div className="w-full md:w-[180px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-[180px]">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="KYC">KYC</SelectItem>
                    <SelectItem value="Risk">Risk</SelectItem>
                    <SelectItem value="Transactions">Transactions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-[180px]">
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 font-medium text-left">ID</th>
                  <th className="pb-2 font-medium text-left">Subject</th>
                  <th className="pb-2 font-medium text-left hidden lg:table-cell">Requester</th>
                  <th className="pb-2 font-medium text-left">Status</th>
                  <th className="pb-2 font-medium text-left">Priority</th>
                  <th className="pb-2 font-medium text-left hidden md:table-cell">Category</th>
                  <th className="pb-2 font-medium text-left hidden lg:table-cell">Assignee</th>
                  <th className="pb-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">{ticket.id}</td>
                    <td className="py-3">{ticket.subject}</td>
                    <td className="py-3 hidden lg:table-cell">{ticket.requester}</td>
                    <td className="py-3">{getStatusBadge(ticket.status)}</td>
                    <td className="py-3">{getPriorityBadge(ticket.priority)}</td>
                    <td className="py-3 hidden md:table-cell">{ticket.category}</td>
                    <td className="py-3 hidden lg:table-cell">{ticket.assignee}</td>
                    <td className="py-3 text-right">
                      <Button
                        variant="ghost" 
                        size="sm"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTickets.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No tickets found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-500">Showing {filteredTickets.length} of {ticketsData.length} tickets</p>
          <div className="flex gap-2">
            <Button variant="outline" disabled>Previous</Button>
            <Button variant="outline">Next</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TicketsDashboard;
