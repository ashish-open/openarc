import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, CreditCard, Settings2, ArrowLeft, Pencil, Eye, FileText, Ticket, Edit2, Download, X, Search, ArrowUpDown, Filter } from 'lucide-react';
import PGDetailsForm, { PGFormData } from '@/components/PGDetailsForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PartnerConfig {
  id: string;
  name: string;
  fields: {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
  }[];
}

interface UserSubmission {
  merchantId: string;
  businessName: string;
  companyName: string;
  website: string;
  status: string;
  technicalContactName: string;
  technicalContactEmail: string;
  technicalContactPhone: string;
  applicationDate: string;
  partners: {
    id: string;
    config: Record<string, string>;
  }[];
  createdAt: string;
  isDraft: boolean;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: string;
    uploadedAt: string;
  }[];
}

const PARTNERS: PartnerConfig[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    fields: [
      { id: 'stripe_api_key', label: 'API Key', type: 'text', placeholder: 'sk_test_...' },
      { id: 'stripe_webhook_secret', label: 'Webhook Secret', type: 'text', placeholder: 'whsec_...' },
      { id: 'stripe_currency', label: 'Default Currency', type: 'text', placeholder: 'USD' }
    ]
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    fields: [
      { id: 'razorpay_key_id', label: 'Key ID', type: 'text', placeholder: 'rzp_test_...' },
      { id: 'razorpay_key_secret', label: 'Key Secret', type: 'text', placeholder: '...' },
      { id: 'razorpay_webhook_secret', label: 'Webhook Secret', type: 'text', placeholder: '...' }
    ]
  },
  {
    id: 'paypal',
    name: 'PayPal',
    fields: [
      { id: 'paypal_client_id', label: 'Client ID', type: 'text', placeholder: '...' },
      { id: 'paypal_client_secret', label: 'Client Secret', type: 'text', placeholder: '...' },
      { id: 'paypal_mode', label: 'Mode', type: 'text', placeholder: 'sandbox/live' }
    ]
  }
];

const PaymentGateway: React.FC = () => {
  const [pgData, setPgData] = useState<null | { merchantId: string; businessName: string; status: string }>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [partnerConfigs, setPartnerConfigs] = useState<Record<string, Record<string, string>>>({});
  const [submittedUsers, setSubmittedUsers] = useState<UserSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock attachments data - this will be replaced with actual S3 data later
  const mockAttachments = [
    {
      id: '1',
      name: 'Business Registration.pdf',
      url: '#',
      type: 'application/pdf',
      size: '2.5 MB',
      uploadedAt: '2024-03-20 10:30 AM'
    },
    {
      id: '2',
      name: 'Bank Statement.pdf',
      url: '#',
      type: 'application/pdf',
      size: '1.8 MB',
      uploadedAt: '2024-03-20 10:35 AM'
    },
    {
      id: '3',
      name: 'Company Logo.png',
      url: '#',
      type: 'image/png',
      size: '500 KB',
      uploadedAt: '2024-03-20 10:40 AM'
    }
  ];

  const handlePGSave = (data: PGFormData) => {
    setPgData({
      merchantId: data.merchantId,
      businessName: data.businessName,
      status: data.status,
    });
    setSubmittedUsers(prev => [
      ...prev,
      {
        merchantId: data.merchantId,
        businessName: data.businessName,
        companyName: data.companyName || data.businessName,
        website: data.website || '',
        status: data.status,
        technicalContactName: data.technicalContactName,
        technicalContactEmail: data.technicalContactEmail,
        technicalContactPhone: data.technicalContactPhone,
        applicationDate: new Date().toLocaleDateString(),
        partners: selectedPartners.map(pid => ({
          id: pid,
          config: partnerConfigs[pid] || {}
        })),
        createdAt: new Date().toLocaleString(),
        isDraft: true,
        attachments: mockAttachments
      }
    ]);
    setIsEditing(false);
  };

  const handlePGSaveAndSend = (data: PGFormData) => {
    handlePGSave(data);
    console.log('Creating Freshdesk ticket for PG integration:', { ...data, partnerConfigs });
  };

  const handlePartnerToggle = (partnerId: string) => {
    setSelectedPartners(prev => {
      if (prev.includes(partnerId)) {
        const newPartners = prev.filter(id => id !== partnerId);
        const newConfigs = { ...partnerConfigs };
        delete newConfigs[partnerId];
        setPartnerConfigs(newConfigs);
        return newPartners;
      } else {
        return [...prev, partnerId];
      }
    });
  };

  const handlePartnerFieldChange = (partnerId: string, fieldId: string, value: string) => {
    setPartnerConfigs(prev => ({
      ...prev,
      [partnerId]: {
        ...prev[partnerId],
        [fieldId]: value
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'inactive':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  // Filter and sort users
  const filteredAndSortedUsers = React.useMemo(() => {
    let filtered = [...submittedUsers];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.businessName.toLowerCase().includes(query) ||
        user.companyName.toLowerCase().includes(query) ||
        user.technicalContactName.toLowerCase().includes(query) ||
        user.technicalContactEmail.toLowerCase().includes(query) ||
        user.merchantId.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(user => statusFilter.includes(user.status.toLowerCase()));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [submittedUsers, searchQuery, sortOrder, statusFilter]);

  if (isEditing) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(false)}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payment Gateway Configuration</h1>
            <p className="text-muted-foreground mt-1">
              {pgData ? 'Update your payment gateway settings' : 'Set up your payment gateway integration'}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-8">
              <PGDetailsForm
                initialData={pgData}
                onSave={handlePGSave}
                onSaveAndSend={handlePGSaveAndSend}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Gateway</h1>
          <p className="text-muted-foreground mt-1">
            Configure and manage your payment gateway integration
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsEditing(true)} className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-3 rounded-md shadow">
            Create MID Request
          </Button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {submittedUsers.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {submittedUsers.filter(u => u.isDraft).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {submittedUsers.filter(u => u.status && u.status.toLowerCase() === 'rejected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Status Card remains */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>
            Monitor your payment gateway integration health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">Connection Status</h3>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${pgData?.status && pgData.status.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span>{pgData?.status || 'Not Configured'}</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">Last Updated</h3>
              <p className="text-sm text-muted-foreground">
                {pgData ? new Date().toLocaleString() : 'Never'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">Support</h3>
              <p className="text-sm text-muted-foreground">
                Need help with your payment gateway integration? Contact our support team.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submitted User List Section */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
          <CardTitle>Submitted Payment Gateway Users</CardTitle>
          <CardDescription>List of users who have submitted payment gateway configurations.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={sortOrder}
                onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <SelectValue placeholder="Sort by date" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                    {statusFilter.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {statusFilter.length}
                      </Badge>
                    )}
          </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Status</h4>
                    <div className="space-y-2">
                      {['pending', 'active', 'suspended'].map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={status}
                            checked={statusFilter.includes(status)}
                            onCheckedChange={(checked) => {
                              setStatusFilter(prev =>
                                checked
                                  ? [...prev, status]
                                  : prev.filter(s => s !== status)
                              );
                            }}
                          />
                          <Label
                            htmlFor={status}
                            className="text-sm font-normal capitalize"
                          >
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              {searchQuery || statusFilter.length > 0
                ? "No users match your search criteria"
                : "No submissions yet."}
            </p>
          ) : (
            <div className="space-y-6">
              {filteredAndSortedUsers.map((user, idx) => (
                <div key={idx} className="border rounded-lg p-6 space-y-6">
                  {/* Header Section */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">{user.businessName}</h3>
                        {user.isDraft && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Pencil className="h-3 w-3" /> Draft
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Application Date: {user.applicationDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Attachments">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              Attachments
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 space-y-4">
                            {user.attachments?.length === 0 ? (
                              <p className="text-muted-foreground text-center py-4">No attachments found</p>
                            ) : (
                              <div className="space-y-2">
                                {user.attachments?.map((attachment) => (
                                  <div
                                    key={attachment.id}
                                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                                  >
                                    <div className="flex items-center gap-3">
                                      <FileText className="h-5 w-5 text-muted-foreground" />
                                      <div>
                                        <p className="font-medium">{attachment.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {attachment.size} • {attachment.uploadedAt}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        title="Download"
                                        onClick={() => window.open(attachment.url, '_blank')}
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="View Ticket">
                        <Ticket className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Company Details</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Company Name</p>
                            <p className="font-medium">{user.companyName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Website</p>
                            <p className="font-medium truncate">{user.website || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Merchant ID</p>
                            <p className="font-medium">{user.merchantId}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Contact Name</p>
                            <p className="font-medium">{user.technicalContactName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium truncate">{user.technicalContactEmail}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">{user.technicalContactPhone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Status Information</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-medium">{user.status}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Created At</p>
                            <p className="font-medium">{user.createdAt}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Gateway Partners */}
                  <div className="border-t pt-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">Payment Gateway Partners</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {user.partners.map((partner) => (
                        <div key={partner.id} className="bg-muted/50 p-4 rounded-md">
                          <p className="font-medium mb-2">{PARTNERS.find(p => p.id === partner.id)?.name || partner.id}</p>
                          <div className="space-y-1">
                            {Object.entries(partner.config).map(([key, value]) => (
                              <p key={key} className="text-sm">
                                <span className="text-muted-foreground">{key}:</span> {value}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGateway; 