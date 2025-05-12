import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PGDetailsFormProps {
  onSave: (data: PGFormData) => void;
  onSaveAndSend: (data: PGFormData) => void;
  initialData?: Partial<PGFormData>;
}

export interface PGFormData {
  merchantId: string;
  businessName: string;
  status: string;
  integrationPreference: string;
  expectedMonthlyVolume: string;
  expectedTicketSize: string;
  paymentMethods: string[];
  technicalContactName: string;
  technicalContactEmail: string;
  technicalContactPhone: string;
  remarks: string;
}

const PGDetailsForm: React.FC<PGDetailsFormProps> = ({
  onSave,
  onSaveAndSend,
  initialData = {},
}) => {
  const [formData, setFormData] = React.useState<PGFormData>({
    merchantId: '',
    businessName: '',
    status: 'pending',
    integrationPreference: '',
    expectedMonthlyVolume: '',
    expectedTicketSize: '',
    paymentMethods: [],
    technicalContactName: '',
    technicalContactEmail: '',
    technicalContactPhone: '',
    remarks: '',
    ...initialData,
  });

  const handleChange = (field: keyof PGFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleSaveAndSend = () => {
    onSaveAndSend(formData);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
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
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={value => handleChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="integrationPreference">Integration Preference</Label>
          <Select
            value={formData.integrationPreference}
            onValueChange={value => handleChange('integrationPreference', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select integration type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="api">API Integration</SelectItem>
              <SelectItem value="plugin">Plugin/Extension</SelectItem>
              <SelectItem value="hosted">Hosted Checkout</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="expectedMonthlyVolume">Expected Monthly Volume</Label>
          <Input
            id="expectedMonthlyVolume"
            value={formData.expectedMonthlyVolume}
            onChange={e => handleChange('expectedMonthlyVolume', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expectedTicketSize">Expected Ticket Size</Label>
          <Input
            id="expectedTicketSize"
            value={formData.expectedTicketSize}
            onChange={e => handleChange('expectedTicketSize', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
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

      <div className="space-y-2">
        <Label htmlFor="remarks">Additional Remarks</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={e => handleChange('remarks', e.target.value)}
          placeholder="Enter any additional information or requirements..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-4 pt-8">
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