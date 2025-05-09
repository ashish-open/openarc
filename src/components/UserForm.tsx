import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface UserData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  kycStatus?: string;
  onboardingStatus?: 'verified' | 'blocked' | 'under_review';
  website: string;
  industry: string;
  mcc: string;
  businessModel: string;
  useCase: string;
  enabledServices: string[];
  pgProviders: string[];
  paymentMethodsEnabled: string[];
  riskTags: string[];
  fraudTransactionRatio?: number;
  chargebackRatio?: number;
  riskLevel?: string;
  createdAt?: string;
  lastActivity?: string;
  country?: string;
}

interface UserFormProps {
  initialData?: Partial<UserData>;
  onSubmit: (data: Partial<UserData>) => void;
  isEditing?: boolean;
}

// Predefined options
const BUSINESS_MODELS = [
  'B2C Marketplace',
  'B2B Platform',
  'Crypto Exchange',
  'SaaS',
  'E-commerce',
  'Financial Services',
  'Gaming',
  'Travel & Hospitality'
];

const INDUSTRIES = [
  'E-commerce',
  'Cryptocurrency',
  'Technology',
  'Financial Services',
  'Gaming',
  'Healthcare',
  'Travel',
  'Education'
];

const PG_PROVIDERS = ['Atom', 'HDFC', 'TPSL', 'Zaakpay', 'Digio'];

const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'UPI',
  'Net Banking',
  'Wallet',
  'EMI'
];

const SERVICES = ['Payout', 'PG', 'API'];

const UserForm: React.FC<UserFormProps> = ({ initialData = {}, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = React.useState<Partial<UserData>>({
    name: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    mcc: '',
    businessModel: '',
    useCase: '',
    enabledServices: [],
    pgProviders: [],
    paymentMethodsEnabled: [],
    riskTags: [],
    ...initialData
  });

  const [newRiskTag, setNewRiskTag] = React.useState('');

  const handleChange = (field: keyof UserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: keyof UserData, item: string) => {
    setFormData(prev => {
      const currentValue = prev[field];
      if (Array.isArray(currentValue)) {
        return {
          ...prev,
          [field]: currentValue.includes(item)
            ? currentValue.filter(i => i !== item)
            : [...currentValue, item]
        };
      }
      return prev;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the user's basic details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={e => handleChange('website', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>Configure business-specific information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={formData.industry}
                onValueChange={value => handleChange('industry', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map(industry => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mcc">MCC</Label>
              <Input
                id="mcc"
                value={formData.mcc}
                onChange={e => handleChange('mcc', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessModel">Business Model</Label>
              <Select
                value={formData.businessModel}
                onValueChange={value => handleChange('businessModel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business model" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_MODELS.map(model => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="useCase">Use Case</Label>
            <Textarea
              id="useCase"
              value={formData.useCase}
              onChange={e => handleChange('useCase', e.target.value)}
              placeholder="Describe the use case..."
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services Configuration</CardTitle>
          <CardDescription>Select enabled services and payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Enabled Services</Label>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map(service => (
                <Badge
                  key={service}
                  variant={formData.enabledServices?.includes(service) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleArrayToggle('enabledServices', service)}
                >
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>PG Providers</Label>
            <div className="flex flex-wrap gap-2">
              {PG_PROVIDERS.map(provider => (
                <Badge
                  key={provider}
                  variant={formData.pgProviders?.includes(provider) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleArrayToggle('pgProviders', provider)}
                >
                  {provider}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Methods</Label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map(method => (
                <Badge
                  key={method}
                  variant={formData.paymentMethodsEnabled?.includes(method) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleArrayToggle('paymentMethodsEnabled', method)}
                >
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Configuration</CardTitle>
          <CardDescription>Configure risk-related settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Risk Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.riskTags?.map(tag => (
                <Badge
                  key={tag}
                  variant="destructive"
                  className="bg-red-100 text-red-800 hover:bg-red-200"
                >
                  {tag}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => handleChange('riskTags', formData.riskTags?.filter(t => t !== tag))}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add new risk tag"
                value={newRiskTag}
                onChange={e => setNewRiskTag(e.target.value)}
                className="max-w-[200px]"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (newRiskTag && !formData.riskTags?.includes(newRiskTag)) {
                    handleChange('riskTags', [...(formData.riskTags || []), newRiskTag]);
                    setNewRiskTag('');
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" className="w-32">
          {isEditing ? 'Save Changes' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm; 