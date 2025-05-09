import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  // Add more fields as needed
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
  const [isOpen, setIsOpen] = React.useState(false);
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

  const handleSave = () => {
    onSave(formData);
    setIsOpen(false);
  };

  const handleSaveAndSend = () => {
    onSaveAndSend(formData);
    setIsOpen(false);
  };

  const createFreshdeskTicket = () => {
    // This function would make an API call to create a Freshdesk ticket
    const ticketData = {
      subject: `PG Integration Request - ${formData.businessName}`,
      description: `
Merchant ID: ${formData.merchantId}
Business Name: ${formData.businessName}
Integration Preference: ${formData.integrationPreference}
Expected Monthly Volume: ${formData.expectedMonthlyVolume}
Expected Ticket Size: ${formData.expectedTicketSize}
Technical Contact: ${formData.technicalContactName} (${formData.technicalContactEmail})
Remarks: ${formData.remarks}
      `.trim(),
      status: 2, // Open
      priority: 2, // Medium
      // Add other Freshdesk ticket fields as needed
    };

    console.log('Creating Freshdesk ticket:', ticketData);
    // TODO: Implement actual Freshdesk API call
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Configure PG Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>PG Integration Details</DialogTitle>
          <DialogDescription>
            Configure payment gateway integration details and optionally create a support ticket
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={e => handleChange('remarks', e.target.value)}
                  placeholder="Add any additional notes or requirements..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => createFreshdeskTicket()}
            >
              Create Support Ticket
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              onClick={handleSaveAndSend}
            >
              Save & Send to Support
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PGDetailsForm; 