import React, { useState } from 'react';
import PGDetailsForm from './PGDetailsForm';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface ViewMerchantFormProps {
  merchantId: string;
  initialData: any;
  onSave: (data: any) => void;
}

const PAYMENT_MODES = [
  { id: 'debit_card', label: 'Debit Card' },
  { id: 'credit_card', label: 'Credit Card' },
  { id: 'netbanking', label: 'Netbanking' },
  { id: 'upi', label: 'UPI' },
  { id: 'wallet', label: 'Wallets' }
];

const ViewMerchantForm: React.FC<ViewMerchantFormProps> = ({
  merchantId,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [editableSections, setEditableSections] = useState<Record<string, boolean>>({});

  const toggleSectionEdit = (sectionName: string) => {
    setEditableSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const handleSave = (data: any) => {
    onSave(data);
    setEditableSections({});
  };

  const handlePaymentModeChange = (partner: 'hdfc' | 'atom', modeId: string, checked: boolean) => {
    const enabledModesField = partner === 'hdfc' ? 'hdfc_enabled_modes' : 'atom_enabled_modes';
    const currentModes = formData[enabledModesField] || [];
    
    setFormData(prev => ({
      ...prev,
      [enabledModesField]: checked 
        ? [...currentModes, modeId]
        : currentModes.filter((id: string) => id !== modeId)
    }));
  };

  const renderPartnerSection = (partner: 'hdfc' | 'atom') => {
    const statusField = partner === 'hdfc' ? 'hdfc_status' : 'atom_status';
    const midField = partner === 'hdfc' ? 'hdfc_mid' : 'atom_mid';
    const assignedAtField = partner === 'hdfc' ? 'hdfc_mid_assigned_at' : 'atom_mid_assigned_at';
    const assignedByField = partner === 'hdfc' ? 'hdfc_mid_assigned_by' : 'atom_mid_assigned_by';
    const enabledModesField = partner === 'hdfc' ? 'hdfc_enabled_modes' : 'atom_enabled_modes';
    const isEditing = editableSections[partner];

    return (
      <Card className="p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{partner.toUpperCase()}</h3>
            <Badge variant={formData[statusField] === 'approved' ? 'default' : 
                          formData[statusField] === 'rejected' ? 'destructive' : 
                          'secondary'}>
              {formData[statusField]}
            </Badge>
          </div>
          <Button
            variant="outline"
            onClick={() => toggleSectionEdit(partner)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select
              value={formData[statusField]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, [statusField]: value }))}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>MID</Label>
            <Input
              value={formData[midField]}
              onChange={(e) => setFormData(prev => ({ ...prev, [midField]: e.target.value }))}
              disabled={!isEditing}
              placeholder="Enter MID"
            />
          </div>

          {formData[midField] !== 'Not Assigned' && (
            <>
              <div>
                <Label>Assigned At</Label>
                <Input
                  type="datetime-local"
                  value={formData[assignedAtField]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [assignedAtField]: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label>Assigned By</Label>
                <Input
                  value={formData[assignedByField]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [assignedByField]: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter assigner name"
                />
              </div>
            </>
          )}

          <div>
            <Label>Enabled Payment Modes</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {PAYMENT_MODES.map(mode => (
                <div key={mode.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${partner}-${mode.id}`}
                    checked={(formData[enabledModesField] || []).includes(mode.id)}
                    onCheckedChange={(checked) => 
                      handlePaymentModeChange(partner, mode.id, checked as boolean)
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor={`${partner}-${mode.id}`}>{mode.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => toggleSectionEdit(partner)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleSave(formData);
                  toggleSectionEdit(partner);
                }}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Merchant Details</h1>
          <p className="text-muted-foreground">View and edit merchant information</p>
        </div>
        <Badge variant={formData.status === 'active' ? 'default' : 
                       formData.status === 'suspended' ? 'destructive' : 
                       'secondary'}>
          {formData.status}
        </Badge>
      </div>

      <PGDetailsForm
        initialData={initialData}
        onSave={handleSave}
        onSaveAndSend={handleSave}
        isEditMode={true}
      />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Payment Gateway Partners</h2>
        {renderPartnerSection('hdfc')}
        {renderPartnerSection('atom')}
      </div>
    </div>
  );
};

export default ViewMerchantForm; 