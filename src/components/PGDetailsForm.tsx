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
  // Legacy fields for compatibility
  merchantId: string;
  companyName: string;
  status: string;
  technicalContactName: string;
  technicalContactEmail: string;
  technicalContactPhone: string;

  // Personal Information
  firstName: string;
  lastName: string;
  fullName: string;
  dob: string;
  
  // Contact Information
  mobileNo: string;
  phoneNo: string;
  emailId: string;
  
  // Business Information
  businessName: string;
  businessNameDBA: string;
  businessType: string;
  gstn: string;
  businessPan: string;
  incorporationDate: string;
  mcc: string;
  businessAddressOperational: string;
  businessAddressRegistered: string;
  city: string;
  state: string;
  country: string;
  
  // Financial Information
  annBusinessTurnover: string;
  monCardTurnover: string;
  dayTxnNo: string;
  
  // Online Presence
  website: string;
  aboutUrl: string;
  contactUsUrl: string;
  refundPolicyUrl: string;
  privacyPolicyUrl: string;
  termsUrl: string;
  
  // Payment Details
  upiVpa: string;
  pgUseCase: string;
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
    // Legacy fields
    merchantId: '',
    companyName: '',
    status: 'pending',
    technicalContactName: '',
    technicalContactEmail: '',
    technicalContactPhone: '',

    // Personal Information
    firstName: '',
    lastName: '',
    fullName: '',
    dob: '',
    
    // Contact Information
    mobileNo: '',
    phoneNo: '',
    emailId: '',
    
    // Business Information
    businessName: '',
    businessNameDBA: '',
    businessType: '',
    gstn: '',
    businessPan: '',
    incorporationDate: '',
    mcc: '',
    businessAddressOperational: '',
    businessAddressRegistered: '',
    city: '',
    state: '',
    country: '',
    
    // Financial Information
    annBusinessTurnover: '',
    monCardTurnover: '',
    dayTxnNo: '',
    
    // Online Presence
    website: '',
    aboutUrl: '',
    contactUsUrl: '',
    refundPolicyUrl: '',
    privacyPolicyUrl: '',
    termsUrl: '',
    
    // Payment Details
    upiVpa: '',
    pgUseCase: '',
    ...initialData,
  });

  const handleChange = (field: keyof PGFormData, value: string) => {
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
    <form className="space-y-8" onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-6">Basic Details</h2>
          
          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={e => handleChange('firstName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={e => handleChange('lastName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={e => handleChange('fullName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={e => handleChange('dob', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mobileNo">Mobile Number</Label>
                <Input
                  id="mobileNo"
                  value={formData.mobileNo}
                  onChange={e => handleChange('mobileNo', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNo">Phone Number</Label>
                <Input
                  id="phoneNo"
                  value={formData.phoneNo}
                  onChange={e => handleChange('phoneNo', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailId">Email ID</Label>
                <Input
                  id="emailId"
                  type="email"
                  value={formData.emailId}
                  onChange={e => handleChange('emailId', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={e => handleChange('businessName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessNameDBA">Business Name DBA</Label>
                <Input
                  id="businessNameDBA"
                  value={formData.businessNameDBA}
                  onChange={e => handleChange('businessNameDBA', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Input
                  id="businessType"
                  value={formData.businessType}
                  onChange={e => handleChange('businessType', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gstn">GST Number</Label>
                <Input
                  id="gstn"
                  value={formData.gstn}
                  onChange={e => handleChange('gstn', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessPan">Business PAN</Label>
                <Input
                  id="businessPan"
                  value={formData.businessPan}
                  onChange={e => handleChange('businessPan', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incorporationDate">Incorporation Date</Label>
                <Input
                  id="incorporationDate"
                  type="date"
                  value={formData.incorporationDate}
                  onChange={e => handleChange('incorporationDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mcc">Merchant Category Code</Label>
                <Input
                  id="mcc"
                  value={formData.mcc}
                  onChange={e => handleChange('mcc', e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessAddressOperational">Operational Business Address</Label>
                <Textarea
                  id="businessAddressOperational"
                  value={formData.businessAddressOperational}
                  onChange={e => handleChange('businessAddressOperational', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessAddressRegistered">Registered Business Address</Label>
                <Textarea
                  id="businessAddressRegistered"
                  value={formData.businessAddressRegistered}
                  onChange={e => handleChange('businessAddressRegistered', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={e => handleChange('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={e => handleChange('state', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={e => handleChange('country', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="annBusinessTurnover">Annual Business Turnover</Label>
                <Input
                  id="annBusinessTurnover"
                  type="number"
                  value={formData.annBusinessTurnover}
                  onChange={e => handleChange('annBusinessTurnover', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monCardTurnover">Monthly Card Turnover</Label>
                <Input
                  id="monCardTurnover"
                  type="number"
                  value={formData.monCardTurnover}
                  onChange={e => handleChange('monCardTurnover', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dayTxnNo">Daily Transaction Number</Label>
                <Input
                  id="dayTxnNo"
                  type="number"
                  value={formData.dayTxnNo}
                  onChange={e => handleChange('dayTxnNo', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Online Presence */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Online Presence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="space-y-2">
                <Label htmlFor="aboutUrl">About URL</Label>
                <Input
                  id="aboutUrl"
                  type="url"
                  placeholder="https://"
                  value={formData.aboutUrl}
                  onChange={e => handleChange('aboutUrl', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactUsUrl">Contact Us URL</Label>
                <Input
                  id="contactUsUrl"
                  type="url"
                  placeholder="https://"
                  value={formData.contactUsUrl}
                  onChange={e => handleChange('contactUsUrl', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refundPolicyUrl">Refund Policy URL</Label>
                <Input
                  id="refundPolicyUrl"
                  type="url"
                  placeholder="https://"
                  value={formData.refundPolicyUrl}
                  onChange={e => handleChange('refundPolicyUrl', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="privacyPolicyUrl">Privacy Policy URL</Label>
                <Input
                  id="privacyPolicyUrl"
                  type="url"
                  placeholder="https://"
                  value={formData.privacyPolicyUrl}
                  onChange={e => handleChange('privacyPolicyUrl', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="termsUrl">Terms URL</Label>
                <Input
                  id="termsUrl"
                  type="url"
                  placeholder="https://"
                  value={formData.termsUrl}
                  onChange={e => handleChange('termsUrl', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="upiVpa">UPI Virtual Payment Address</Label>
                <Input
                  id="upiVpa"
                  value={formData.upiVpa}
                  onChange={e => handleChange('upiVpa', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pgUseCase">Payment Gateway Use Case</Label>
                <Input
                  id="pgUseCase"
                  value={formData.pgUseCase}
                  onChange={e => handleChange('pgUseCase', e.target.value)}
                />
              </div>
            </div>
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