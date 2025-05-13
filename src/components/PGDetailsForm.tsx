import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, ArrowLeft } from 'lucide-react';

interface PGDetailsFormProps {
  onSave: (data: PGFormData) => void;
  onSaveAndSend: (data: PGFormData) => void;
  initialData?: Partial<PGFormData>;
}

export interface PGFormData {
  merchantId: string;
  businessName: string;
  companyName: string;
  website: string;
  status: string;
  technicalContactName: string;
  technicalContactEmail: string;
  technicalContactPhone: string;
  remarks: string;
  partners: {
    id: string;
    name: string;
    config: Record<string, string>;
  }[];
}

const AVAILABLE_PARTNERS = [
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    fields: [
      { id: 'merchant_id', label: 'Merchant ID', type: 'text', placeholder: 'Enter HDFC Merchant ID' },
      { id: 'api_key', label: 'API Key', type: 'text', placeholder: 'Enter API Key' },
      { id: 'secret_key', label: 'Secret Key', type: 'text', placeholder: 'Enter Secret Key' }
    ]
  },
  {
    id: 'atom',
    name: 'Atom Technologies',
    fields: [
      { id: 'merchant_id', label: 'Merchant ID', type: 'text', placeholder: 'Enter Atom Merchant ID' },
      { id: 'login_id', label: 'Login ID', type: 'text', placeholder: 'Enter Login ID' },
      { id: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
    ]
  },
  {
    id: 'tpsl',
    name: 'TPSL',
    fields: [
      { id: 'merchant_id', label: 'Merchant ID', type: 'text', placeholder: 'Enter TPSL Merchant ID' },
      { id: 'terminal_id', label: 'Terminal ID', type: 'text', placeholder: 'Enter Terminal ID' },
      { id: 'access_code', label: 'Access Code', type: 'text', placeholder: 'Enter Access Code' }
    ]
  },
  {
    id: 'zaakpay',
    name: 'Zaakpay',
    fields: [
      { id: 'merchant_id', label: 'Merchant ID', type: 'text', placeholder: 'Enter Zaakpay Merchant ID' },
      { id: 'secret_key', label: 'Secret Key', type: 'text', placeholder: 'Enter Secret Key' },
      { id: 'mode', label: 'Mode', type: 'text', placeholder: 'test/live' }
    ]
  },
  {
    id: 'digio',
    name: 'Digio',
    fields: [
      { id: 'merchant_id', label: 'Merchant ID', type: 'text', placeholder: 'Enter Digio Merchant ID' },
      { id: 'api_key', label: 'API Key', type: 'text', placeholder: 'Enter API Key' },
      { id: 'client_id', label: 'Client ID', type: 'text', placeholder: 'Enter Client ID' }
    ]
  }
];

const PGDetailsForm: React.FC<PGDetailsFormProps> = ({
  onSave,
  onSaveAndSend,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<PGFormData>({
    merchantId: '',
    businessName: '',
    companyName: '',
    website: '',
    status: 'pending',
    technicalContactName: '',
    technicalContactEmail: '',
    technicalContactPhone: '',
    remarks: '',
    partners: [],
    ...initialData,
  });

  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [partnerConfigs, setPartnerConfigs] = useState<Record<string, Record<string, string>>>({});

  const handleChange = (field: keyof PGFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleAddPartner = () => {
    if (!selectedPartner) return;

    const partner = AVAILABLE_PARTNERS.find(p => p.id === selectedPartner);
    if (!partner) return;

    setFormData(prev => ({
      ...prev,
      partners: [
        ...prev.partners,
        {
          id: partner.id,
          name: partner.name,
          config: partnerConfigs[partner.id] || {}
        }
      ]
    }));

    setSelectedPartner('');
    setPartnerConfigs(prev => {
      const newConfigs = { ...prev };
      delete newConfigs[partner.id];
      return newConfigs;
    });
  };

  const handleRemovePartner = (partnerId: string) => {
    setFormData(prev => ({
      ...prev,
      partners: prev.partners.filter(p => p.id !== partnerId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleSaveAndSend = () => {
    onSaveAndSend(formData);
  };

  const getAvailablePartners = () => {
    return AVAILABLE_PARTNERS.filter(
      partner => !formData.partners.some(p => p.id === partner.id)
    );
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* Basic Details Section */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-6">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="merchantId">Merchant ID</Label>
              <Input
                id="merchantId"
                value={formData.merchantId}
                onChange={e => handleChange('merchantId', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={e => handleChange('businessName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={e => handleChange('companyName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://"
                value={formData.website}
                onChange={e => handleChange('website', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label>Technical Contact</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Name"
                value={formData.technicalContactName}
                onChange={e => handleChange('technicalContactName', e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                value={formData.technicalContactEmail}
                onChange={e => handleChange('technicalContactEmail', e.target.value)}
              />
              <Input
                placeholder="Phone"
                value={formData.technicalContactPhone}
                onChange={e => handleChange('technicalContactPhone', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="remarks">Additional Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={e => handleChange('remarks', e.target.value)}
              placeholder="Enter any additional information or requirements..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateway Partners Section */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-6">Payment Gateway Partners</h2>
          
          {/* Existing Partners */}
          {formData.partners.map((partner) => (
            <div key={partner.id} className="mb-6 p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{partner.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemovePartner(partner.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(partner.config).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}
                    </Label>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Add New Partner */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Select
                value={selectedPartner}
                onValueChange={setSelectedPartner}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a payment gateway partner" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailablePartners().map(partner => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={handleAddPartner}
                disabled={!selectedPartner}
              >
                Add Partner
              </Button>
            </div>

            {/* Partner Configuration Fields */}
            {selectedPartner && (
              <div className="mt-4 p-4 border rounded-lg">
                <h3 className="font-medium mb-4">
                  {AVAILABLE_PARTNERS.find(p => p.id === selectedPartner)?.name} Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AVAILABLE_PARTNERS.find(p => p.id === selectedPartner)?.fields.map(field => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={partnerConfigs[selectedPartner]?.[field.id] || ''}
                        onChange={e => handlePartnerFieldChange(selectedPartner, field.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" type="submit">
          Save Configuration
        </Button>
        <Button type="button" onClick={handleSaveAndSend}>
          Save & Create Support Ticket
        </Button>
      </div>
    </form>
  );
};

export default PGDetailsForm; 