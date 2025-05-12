import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, CreditCard, Settings2, ArrowLeft, Pencil } from 'lucide-react';
import PGDetailsForm, { PGFormData } from '@/components/PGDetailsForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const [submittedUsers, setSubmittedUsers] = useState<any[]>(() => {
    const stored = localStorage.getItem('pg_submitted_users');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('pg_submitted_users', JSON.stringify(submittedUsers));
  }, [submittedUsers]);

  const handleClearUsers = () => {
    setSubmittedUsers([]);
    localStorage.removeItem('pg_submitted_users');
  };

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
        status: data.status,
        technicalContactName: data.technicalContactName,
        technicalContactEmail: data.technicalContactEmail,
        partners: selectedPartners.map(pid => ({
          id: pid,
          config: partnerConfigs[pid] || {}
        })),
        createdAt: new Date().toLocaleString(),
        isDraft: true
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

              <Separator />

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Select Payment Gateway Partners</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PARTNERS.map(partner => (
                    <div key={partner.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={partner.id}
                        checked={selectedPartners.includes(partner.id)}
                        onCheckedChange={() => handlePartnerToggle(partner.id)}
                      />
                      <Label htmlFor={partner.id}>{partner.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPartners.map(partnerId => {
                const partner = PARTNERS.find(p => p.id === partnerId);
                if (!partner) return null;

                return (
                  <div key={partnerId} className="space-y-4">
                    <Separator />
                    <h3 className="text-lg font-semibold">{partner.name} Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {partner.fields.map(field => (
                        <div key={field.id} className="space-y-2">
                          <Label htmlFor={field.id}>{field.label}</Label>
                          <Input
                            id={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={partnerConfigs[partnerId]?.[field.id] || ''}
                            onChange={e => handlePartnerFieldChange(partnerId, field.id, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Action buttons at the end of the complete form */}
              <div className="flex justify-end gap-4 pt-8">
                <Button variant="outline" onClick={() => {
                  // Save only PGDetailsForm data
                  const form = document.querySelector('form');
                  if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }}>
                  Save Configuration
                </Button>
                <Button onClick={() => {
                  // Save and send support ticket
                  const form = document.querySelector('form');
                  if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                  // Optionally, trigger support ticket logic here if needed
                }}>
                  Save & Create Support Ticket
                </Button>
              </div>
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
          <CreditCard className="h-8 w-8 text-rebecca" />
          <Settings2 className="h-8 w-8 text-rebecca" />
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
          <CardTitle>Submitted Payment Gateway Users</CardTitle>
          <CardDescription>List of users who have submitted payment gateway configurations.</CardDescription>
          <Button variant="destructive" size="sm" className="mt-2" onClick={handleClearUsers}>
            Clear User List
          </Button>
        </CardHeader>
        <CardContent>
          {submittedUsers.length === 0 ? (
            <p className="text-muted-foreground">No submissions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Merchant ID</th>
                    <th className="px-4 py-2 text-left">Business Name</th>
                    <th className="px-4 py-2 text-left">Contact Name</th>
                    <th className="px-4 py-2 text-left">Contact Email</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Partners</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedUsers.map((user, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2">{user.merchantId}
                        {user.isDraft && (
                          <span title="Draft" className="inline-flex items-center ml-2 text-yellow-600">
                            <Pencil className="h-4 w-4 mr-1" /> Draft
                          </span>
                        )}
                        <div className="text-xs text-muted-foreground">Created: {user.createdAt}</div>
                      </td>
                      <td className="px-4 py-2">{user.businessName}</td>
                      <td className="px-4 py-2">{user.technicalContactName}</td>
                      <td className="px-4 py-2">{user.technicalContactEmail}</td>
                      <td className="px-4 py-2">{user.status}</td>
                      <td className="px-4 py-2">
                        {user.partners.length === 0 ? (
                          <span className="text-muted-foreground">None</span>
                        ) : (
                          <>
                            {user.partners.map((p: any) => (
                              <div key={p.id}>
                                <span className="font-medium">{PARTNERS.find(pt => pt.id === p.id)?.name || p.id}</span>
                                <ul className="ml-4 list-disc">
                                  {Object.entries(p.config).map(([k, v]) => (
                                    <li key={String(k)}><span className="text-xs text-muted-foreground">{String(k)}:</span> {String(v)}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGateway; 