
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Mock ticket data for demonstration
const mockTickets = [
  { 
    id: 1, 
    subject: 'Cannot verify identity document', 
    requester: 'Emma Wilson', 
    requesterId: 'U10004',
    status: 'open', 
    priority: 'high', 
    created: '2023-05-28', 
    description: 'I uploaded my passport but it keeps getting rejected. Please help.',
    type: 'kyc'
  },
  { 
    id: 2, 
    subject: 'Transaction wrongly flagged as suspicious', 
    requester: 'John Doe', 
    requesterId: 'U10001',
    status: 'pending', 
    priority: 'medium', 
    created: '2023-05-29', 
    description: 'My withdrawal was flagged as suspicious but it was a regular transfer. Please review.',
    type: 'transaction'
  },
  { 
    id: 3, 
    subject: 'Need to update personal information', 
    requester: 'Sarah Smith', 
    requesterId: 'U10002',
    status: 'open', 
    priority: 'low', 
    created: '2023-05-30', 
    description: 'I need to update my address information. How can I do this?',
    type: 'account'
  },
  { 
    id: 4, 
    subject: 'App keeps crashing on upload', 
    requester: 'Michael Brown', 
    requesterId: 'U10003',
    status: 'resolved', 
    priority: 'medium', 
    created: '2023-05-27', 
    description: 'Every time I try to upload my proof of address, the app crashes.',
    type: 'technical'
  },
  { 
    id: 5, 
    subject: 'Question about risk level', 
    requester: 'Emma Wilson', 
    requesterId: 'U10004',
    status: 'pending', 
    priority: 'medium', 
    created: '2023-05-26', 
    description: 'Why is my account marked as high-risk? I need more information.',
    type: 'risk'
  },
];

const TicketsDashboard: React.FC = () => {
  useRequireAuth('viewer');
  const [tickets, setTickets] = useState(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Open</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'kyc':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">KYC</Badge>;
      case 'transaction':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Transaction</Badge>;
      case 'account':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Account</Badge>;
      case 'technical':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Technical</Badge>;
      case 'risk':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Risk</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    // Apply search filter
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(ticket.id).includes(searchTerm);
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    // Apply priority filter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    // Apply type filter
    const matchesType = typeFilter === 'all' || ticket.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const refreshTickets = () => {
    setLoading(true);
    
    // Simulate API call to Freshdesk
    setTimeout(() => {
      setLoading(false);
      toast.success('Tickets refreshed successfully!');
    }, 1000);
  };

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  const updateTicketStatus = (status: string) => {
    if (!selectedTicket) return;
    
    // Update the ticket in the local state
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === selectedTicket.id ? { ...ticket, status } : ticket
      )
    );
    
    // Update the selected ticket
    setSelectedTicket({ ...selectedTicket, status });
    
    toast.success(`Ticket #${selectedTicket.id} status updated to ${status}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <Button 
          onClick={refreshTickets} 
          className="flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Sync with Freshdesk
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {tickets.filter(t => t.status === 'open').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {tickets.filter(t => t.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resolved Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedTicket ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setSelectedTicket(null)}>Back to Tickets</Button>
            <div className="flex gap-2">
              <Select
                value={selectedTicket.status}
                onValueChange={updateTicketStatus}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button>Assign</Button>
              <Button variant="outline">Reply</Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ticket #{selectedTicket.id}: {selectedTicket.subject}</CardTitle>
                  <CardDescription>
                    Created on {selectedTicket.created} by{' '}
                    <a href={`/dashboard/users/${selectedTicket.requesterId}`} className="text-blue-600 hover:underline">
                      {selectedTicket.requester}
                    </a>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(selectedTicket.status)}
                  {getPriorityBadge(selectedTicket.priority)}
                  {getTypeBadge(selectedTicket.type)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p>{selectedTicket.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Conversation</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{selectedTicket.requester}</p>
                      <span className="text-xs text-gray-500">{selectedTicket.created}</span>
                    </div>
                    <p>{selectedTicket.description}</p>
                  </div>

                  {selectedTicket.status !== 'open' && (
                    <div className="bg-blue-50 p-4 rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">Support Agent</p>
                        <span className="text-xs text-gray-500">Today</span>
                      </div>
                      <p>We're looking into your issue and will get back to you shortly.</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Add a Reply</h3>
                <div className="space-y-4">
                  <textarea 
                    className="w-full border rounded-md p-2 min-h-24"
                    placeholder="Type your reply here..."
                  ></textarea>
                  <Button>Send Reply</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <CardTitle>All Tickets</CardTitle>
                <CardDescription>Manage support tickets from Freshdesk</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <div className="w-full md:w-40">
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-40">
                  <Select 
                    value={priorityFilter} 
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-40">
                  <Select 
                    value={typeFilter} 
                    onValueChange={setTypeFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="kyc">KYC</SelectItem>
                      <SelectItem value="transaction">Transaction</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="risk">Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Tabs defaultValue="list" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="board">Board View</TabsTrigger>
              </TabsList>

              <TabsContent value="list">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-2 font-medium text-left">ID</th>
                        <th className="pb-2 font-medium text-left">Subject</th>
                        <th className="pb-2 font-medium text-left">Requester</th>
                        <th className="pb-2 font-medium text-left hidden md:table-cell">Created</th>
                        <th className="pb-2 font-medium text-left">Status</th>
                        <th className="pb-2 font-medium text-left">Priority</th>
                        <th className="pb-2 font-medium text-left hidden md:table-cell">Type</th>
                        <th className="pb-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.map((ticket) => (
                        <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3">{ticket.id}</td>
                          <td className="py-3 max-w-xs truncate">{ticket.subject}</td>
                          <td className="py-3">{ticket.requester}</td>
                          <td className="py-3 hidden md:table-cell">{ticket.created}</td>
                          <td className="py-3">{getStatusBadge(ticket.status)}</td>
                          <td className="py-3">{getPriorityBadge(ticket.priority)}</td>
                          <td className="py-3 hidden md:table-cell">{getTypeBadge(ticket.type)}</td>
                          <td className="py-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewTicket(ticket)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {filteredTickets.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-6 text-center text-gray-500">
                            No tickets found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="board">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="text-md">Open</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      {filteredTickets.filter(t => t.status === 'open').map(ticket => (
                        <div 
                          key={ticket.id}
                          className="border p-3 mb-2 rounded-md hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleViewTicket(ticket)}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">#{ticket.id}</span>
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <p className="mb-1 font-medium truncate">{ticket.subject}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{ticket.requester}</span>
                            <span className="text-xs text-gray-500">{ticket.created}</span>
                          </div>
                        </div>
                      ))}
                      {filteredTickets.filter(t => t.status === 'open').length === 0 && (
                        <div className="py-6 text-center text-gray-500">
                          No open tickets found.
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-yellow-50">
                      <CardTitle className="text-md">Pending</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      {filteredTickets.filter(t => t.status === 'pending').map(ticket => (
                        <div 
                          key={ticket.id}
                          className="border p-3 mb-2 rounded-md hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleViewTicket(ticket)}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">#{ticket.id}</span>
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <p className="mb-1 font-medium truncate">{ticket.subject}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{ticket.requester}</span>
                            <span className="text-xs text-gray-500">{ticket.created}</span>
                          </div>
                        </div>
                      ))}
                      {filteredTickets.filter(t => t.status === 'pending').length === 0 && (
                        <div className="py-6 text-center text-gray-500">
                          No pending tickets found.
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-green-50">
                      <CardTitle className="text-md">Resolved</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      {filteredTickets.filter(t => t.status === 'resolved').map(ticket => (
                        <div 
                          key={ticket.id}
                          className="border p-3 mb-2 rounded-md hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleViewTicket(ticket)}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">#{ticket.id}</span>
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <p className="mb-1 font-medium truncate">{ticket.subject}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{ticket.requester}</span>
                            <span className="text-xs text-gray-500">{ticket.created}</span>
                          </div>
                        </div>
                      ))}
                      {filteredTickets.filter(t => t.status === 'resolved').length === 0 && (
                        <div className="py-6 text-center text-gray-500">
                          No resolved tickets found.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TicketsDashboard;
