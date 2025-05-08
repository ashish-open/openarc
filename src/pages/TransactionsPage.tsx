
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock transaction data
const transactionData = [
  { id: 'T100123', userId: 'U10001', date: '2023-06-01', amount: 500, type: 'deposit', status: 'completed' },
  { id: 'T100124', userId: 'U10002', date: '2023-06-01', amount: 1200, type: 'withdrawal', status: 'completed' },
  { id: 'T100125', userId: 'U10003', date: '2023-06-02', amount: 350, type: 'deposit', status: 'pending' },
  { id: 'T100126', userId: 'U10004', date: '2023-06-02', amount: 1400, type: 'withdrawal', status: 'flagged' },
  { id: 'T100127', userId: 'U10001', date: '2023-06-03', amount: 200, type: 'withdrawal', status: 'completed' },
  { id: 'T100128', userId: 'U10005', date: '2023-06-03', amount: 750, type: 'deposit', status: 'completed' },
  { id: 'T100129', userId: 'U10002', date: '2023-06-04', amount: 1800, type: 'withdrawal', status: 'flagged' },
  { id: 'T100130', userId: 'U10004', date: '2023-06-04', amount: 900, type: 'withdrawal', status: 'declined' },
  { id: 'T100131', userId: 'U10003', date: '2023-06-05', amount: 1100, type: 'deposit', status: 'completed' },
  { id: 'T100132', userId: 'U10005', date: '2023-06-05', amount: 2500, type: 'withdrawal', status: 'pending' }
];

const TransactionsPage: React.FC = () => {
  useRequireAuth('viewer');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'flagged':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Flagged</Badge>;
      case 'declined':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Declined</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Deposit</Badge>;
      case 'withdrawal':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Withdrawal</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  const filteredTransactions = transactionData.filter(tx => {
    // Apply search filter
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    
    // Apply type filter
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button className="flex items-center gap-2" variant="outline">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>Monitor and review all transactions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search transactions..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <div className="w-full md:w-48">
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select 
                  value={typeFilter} 
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 font-medium text-left">Transaction ID</th>
                  <th className="pb-2 font-medium text-left">User</th>
                  <th className="pb-2 font-medium text-left">Date</th>
                  <th className="pb-2 font-medium text-left">Amount</th>
                  <th className="pb-2 font-medium text-left">Type</th>
                  <th className="pb-2 font-medium text-left">Status</th>
                  <th className="pb-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">{tx.id}</td>
                    <td className="py-3">{tx.userId}</td>
                    <td className="py-3">{tx.date}</td>
                    <td className="py-3">${tx.amount.toLocaleString()}</td>
                    <td className="py-3">{getTypeBadge(tx.type)}</td>
                    <td className="py-3">{getStatusBadge(tx.status)}</td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500">
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
