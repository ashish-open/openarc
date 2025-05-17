import React, { useState } from 'react';
import PGDetailsForm from './PGDetailsForm';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface EditMerchantFormProps {
  merchantId: string;
  initialData: any;
  onSave: (data: any) => void;
}

const EditMerchantForm: React.FC<EditMerchantFormProps> = ({
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

  const renderPartnerStatus = (partner: 'hdfc' | 'atom') => {
    const statusField = partner === 'hdfc' ? 'hdfc_status' : 'atom_status';
    const midField = partner === 'hdfc' ? 'hdfc_mid' : 'atom_mid';
    const assignedAtField = partner === 'hdfc' ? 'hdfc_mid_assigned_at' : 'atom_mid_assigned_at';
    const assignedByField = partner === 'hdfc' ? 'hdfc_mid_assigned_by' : 'atom_mid_assigned_by';

    return (
      <Card className="p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{partner.toUpperCase()} Status</h3>
          <Button
            variant="outline"
            onClick={() => toggleSectionEdit(partner)}
          >
            {editableSections[partner] ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select
              value={formData[statusField]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, [statusField]: value }))}
              disabled={!editableSections[partner]}
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
              disabled={!editableSections[partner]}
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
                  disabled={!editableSections[partner]}
                />
              </div>

              <div>
                <Label>Assigned By</Label>
                <Input
                  value={formData[assignedByField]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [assignedByField]: e.target.value }))}
                  disabled={!editableSections[partner]}
                  placeholder="Enter assigner name"
                />
              </div>
            </>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <PGDetailsForm
        initialData={initialData}
        onSave={handleSave}
        onSaveAndSend={handleSave}
        isEditMode={true}
      />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Partner Status</h2>
        {renderPartnerStatus('hdfc')}
        {renderPartnerStatus('atom')}
      </div>
    </div>
  );
};

export default EditMerchantForm; 