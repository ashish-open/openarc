import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ChevronsUpDown, Plus, X, ArrowLeft } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import itemNames from '../../itemNames.json';

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

  // Basic Details
  nodal_account_name: string;
  submission_date: string;
  business_name: string;
  business_name_dba: string;
  incorporation_date: string;
  website: string;
  full_name: string;
  mobile_no: string;
  email_id: string;
  dob: string;
  business_address_operational: string;
  mcc: string;
  about_url: string;
  contact_us_url: string;
  refund_policy_url: string;
  privacy_policy_url: string;
  terms_url: string;
  ann_business_turnover: string;
  mon_card_turnover: string;
  day_txn_no: string;
  pg_use_case: string;
  business_pan: string;
  business_type: string;
  upi_vpa: string;
  gstn: string;

  // HDFC - Cards
  hdfc_sl_no: string;
  tid_type: string;
  no_of_tid: string;
  tid_req: string;
  business_age: string;
  pg_setup_type: string;
  hdfc_promo: string;
  ref_tid: string;

  // HDFC - UPI
  entity_mid: string;
  hdfc_integration_approach: string;
  hdfc_settlement_type: string;
  hdfc_upi_whitelist1: string;
  hdfc_upi_whitelist2: string;
  ext_mid: string;
  ext_tid: string;
  modify_flag: string;
  upi_txn_type: string;

  // Atom - Contact Field
  first_name: string;
  last_name: string;

  // Atom - Account Field Details
  phone_no: string;
  merchant_zone: string;
  business_address_registered: string;
  city: string;
  state: string;
  country: string;
  industry: string;
  sub_industry: string;
  business_segment: string;
  affl_cert_atom: string;
  personal_pan: string;
  personal_pin: string;
  personal_street1: string;
  personal_street2: string;
  ae_contact: string;
  chargeback_contact: string;
  finance_contact: string;
  product_support_contact: string;
  setup_contact: string;

  // Atom - Opportunities Field Details
  pg_modes: string[];
  atom_settlement_type: string;
  surcharge_status: string;
  bill_to: string;
  integration_kit: string;
  atom_integration_type: string;
  atom_pre_integration: string;
  nodal_bank: string;
  nodal_branch_code: string;
  nodal_branch_name: string;
  nodal_account_number: string;
  nodal_ifsc: string;
  hdfc_prod_id_name: string;
  hdfc_domain_check: string;
  atom_multi_status: string;
  website_login_details: string;
  website_status: string;
  atom_min_ticket_size: string;
  atom_max_ticket_size: string;
  pricing_details: string;

  // New fields
  alternate_business_name: string;
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
  initialData,
}) => {
  const safeInitialData = initialData ?? {};
  const [formData, setFormData] = useState<PGFormData>({
    // Legacy fields
    merchantId: '',
    companyName: '',
    status: 'pending',
    technicalContactName: '',
    technicalContactEmail: '',
    technicalContactPhone: '',

    // Basic Details
    nodal_account_name: 'Open Financial Technologies Private Limited',
    submission_date: new Date().toISOString().split('T')[0],
    business_name: '',
    business_name_dba: '',
    incorporation_date: '',
    website: '',
    full_name: '',
    mobile_no: '',
    email_id: '',
    dob: '',
    business_address_operational: '',
    mcc: '',
    about_url: '',
    contact_us_url: '',
    refund_policy_url: '',
    privacy_policy_url: '',
    terms_url: '',
    ann_business_turnover: '',
    mon_card_turnover: '',
    day_txn_no: '',
    pg_use_case: '',
    business_pan: '',
    business_type: '',
    upi_vpa: '',
    gstn: '',

    // HDFC - Cards
    hdfc_sl_no: '',
    tid_type: 'WEB TID',
    no_of_tid: '2 ( Web TID -1 , UPI TID -1)',
    tid_req: 'Web TID (1), UPI TID (1)',
    business_age: '',
    pg_setup_type: '',
    hdfc_promo: '',
    ref_tid: '',

    // HDFC - UPI
    entity_mid: 'HDFC000029453618',
    hdfc_integration_approach: 'WEBAPI',
    hdfc_settlement_type: '',
    hdfc_upi_whitelist1: '',
    hdfc_upi_whitelist2: '',
    ext_mid: '',
    ext_tid: '',
    modify_flag: 'A',
    upi_txn_type: '',

    // Atom - Contact Field
    first_name: '',
    last_name: '',

    // Atom - Account Field Details
    phone_no: '',
    merchant_zone: '',
    business_address_registered: '',
    city: '',
    state: '',
    country: '',
    industry: '',
    sub_industry: '',
    business_segment: '',
    affl_cert_atom: '',
    personal_pan: '',
    personal_pin: '',
    personal_street1: '',
    personal_street2: '',
    ae_contact: '',
    chargeback_contact: '',
    finance_contact: '',
    product_support_contact: '',
    setup_contact: '',

    // Atom - Opportunities Field Details
    pg_modes: ['NB', 'CC', 'DC', 'UPI', 'Wallet'],
    atom_settlement_type: '',
    surcharge_status: 'No',
    bill_to: '',
    integration_kit: '',
    atom_integration_type: '',
    atom_pre_integration: '',
    nodal_bank: 'YES Bank',
    nodal_branch_code: '198',
    nodal_branch_name: 'Bangalore 3 (Kormangala)',
    nodal_account_number: '19861100000013',
    nodal_ifsc: 'YESB0000198',
    hdfc_prod_id_name: '',
    hdfc_domain_check: '',
    atom_multi_status: '',
    website_login_details: '',
    website_status: '',
    atom_min_ticket_size: '',
    atom_max_ticket_size: '',
    pricing_details: '',
    alternate_business_name: '',
    ...safeInitialData,
  });

  const [showOperationalAddress, setShowOperationalAddress] = useState(false);

  const handleChange = (field: keyof PGFormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // If business_name is being changed, also update business_name_dba
      if (field === 'business_name') {
        newData.business_name_dba = value;
      }
      
      // Auto-combine first_name and last_name into full_name
      if (field === 'first_name' || field === 'last_name') {
        const firstName = field === 'first_name' ? value : prev.first_name;
        const lastName = field === 'last_name' ? value : prev.last_name;
        newData.full_name = `${firstName || ''} ${lastName || ''}`.trim();
      }
      
      // Auto-calculate business_age based on incorporation_date
      if (field === 'incorporation_date') {
        const today = new Date();
        const incDate = new Date(value);
        let age = '';
        if (!isNaN(incDate.getTime())) {
          const diffYears = today.getFullYear() - incDate.getFullYear();
          const diffMonths = today.getMonth() - incDate.getMonth();
          const diffDays = today.getDate() - incDate.getDate();
          let years = diffYears;
          if (diffMonths < 0 || (diffMonths === 0 && diffDays < 0)) {
            years--;
          }
          if (years < 1) {
            age = 'less than 1 year';
          } else {
            age = `more than ${years} year${years > 1 ? 's' : ''}`;
          }
        }
        newData.business_age = age;
      }
      
      return newData;
    });
  };

  // Handle checkbox toggle for multi-select fields
  const handleCheckboxToggle = (field: keyof PGFormData, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [field]: newValues };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleSaveAndSend = () => {
    onSaveAndSend(formData);
  };

  // Helper function to get display name from itemNames.json
  const getDisplayName = (itemName: string) => {
    for (const section of Object.values(itemNames.sections)) {
      if ('items' in section && Array.isArray(section.items)) {
        const found = section.items.find((item: any) => item.itemName === itemName);
        if (found) return found.displayName;
      } else {
        for (const subSection of Object.values(section)) {
          if ('items' in subSection && Array.isArray((subSection as any).items)) {
            const found = (subSection as any).items.find((item: any) => item.itemName === itemName);
            if (found) return found.displayName;
          }
        }
      }
    }
    return itemName;
  };

  // Helper function to create input fields
  const renderField = (itemName: string, type: string = 'text', readOnly: boolean = false) => {
    const displayName = getDisplayName(itemName);
    const value = formData[itemName as keyof PGFormData] || '';

    if (itemName === 'pg_setup_type') {
      return (
        <div className="space-y-2">
          <Label htmlFor={itemName}>{displayName}</Label>
          <Select
            value={value as string}
            onValueChange={(value) => handleChange(itemName as keyof PGFormData, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Setup Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STP" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">STP</SelectItem>
              <SelectItem value="NSTP" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">NSTP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }
    // Special case for nodal_account_name: render as a dropdown
    if (itemName === 'nodal_account_name') {
      return (
        <div className="space-y-2">
          <Label htmlFor={itemName}>{displayName}</Label>
          <Select
            value={formData[itemName]}
            onValueChange={(value) => handleChange(itemName as keyof PGFormData, value)}
          >
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Select nodal account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem 
                value="Open Financial Technologies Private Limited"
                className="data-[highlighted]:bg-primary data-[highlighted]:text-white"
              >
                Open Financial Technologies Private Limited
              </SelectItem>
              <SelectItem 
                value="Other"
                className="data-[highlighted]:bg-primary data-[highlighted]:text-white"
              >
                Other
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }
    // Special case for surcharge_status: render as a dropdown
    if (itemName === 'surcharge_status') {
      return (
        <div className="space-y-2">
          <Label htmlFor={itemName}>{displayName}</Label>
          <Select
            value={formData[itemName]}
            onValueChange={(value) => handleChange(itemName as keyof PGFormData, value)}
          >
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Select surcharge status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">Yes</SelectItem>
              <SelectItem value="No" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }
    // Special case for business_type: render as a dropdown
    if (itemName === 'business_type') {
      return (
        <div className="space-y-2">
          <Label htmlFor={itemName}>{displayName}</Label>
          <Select
            value={formData[itemName]}
            onValueChange={(value) => handleChange(itemName as keyof PGFormData, value)}
          >
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Individual" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">Individual</SelectItem>
              <SelectItem value="Sole Proprietorship" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">Sole Proprietorship</SelectItem>
              <SelectItem value="Partnership" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">Partnership</SelectItem>
              <SelectItem value="Limited Liability Partnership (LLP)" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">Limited Liability Partnership (LLP)</SelectItem>
              <SelectItem value="Private Limited Company" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">Private Limited Company</SelectItem>
              <SelectItem value="Public Limited Company" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">Public Limited Company</SelectItem>
              <SelectItem value="Trust" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">Trust</SelectItem>
              <SelectItem value="NGO" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">NGO</SelectItem>
              <SelectItem value="Other" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }
    // Special case for pg_modes: render as multi-select dropdown
    if (itemName === 'pg_modes') {
      const paymentModes = [
        { value: 'NB', label: 'Net Banking' },
        { value: 'CC', label: 'Credit Card' },
        { value: 'DC', label: 'Debit Card' },
        { value: 'UPI', label: 'UPI' },
        { value: 'Wallet', label: 'Wallet' }
      ];
      const selectedText = (formData[itemName] as string[] || []).length > 0 
        ? (formData[itemName] as string[])
            .map(val => paymentModes.find(m => m.value === val)?.label || val)
            .join(', ') 
        : 'Select payment modes...';
      const dropdownRef = React.useRef<HTMLDivElement>(null);
      React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            const dropdown = document.getElementById(`${itemName}-dropdown`);
            if (dropdown && !dropdown.classList.contains('hidden')) {
              dropdown.classList.add('hidden');
            }
          }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [itemName]);
      return (
        <div className="space-y-2">
          <Label htmlFor={itemName}>{displayName}</Label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              id={itemName}
              className="flex w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={(e) => {
                e.preventDefault();
                const dropdown = document.getElementById(`${itemName}-dropdown`);
                dropdown?.classList.toggle('hidden');
              }}
            >
              <span className="truncate">{selectedText}</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
            <div 
              id={`${itemName}-dropdown`} 
              className="absolute z-10 hidden mt-1 w-full rounded-md border bg-popover shadow-md"
            >
              <div className="p-2 space-y-2">
                {paymentModes.map(mode => (
                  <div 
                    key={mode.value} 
                    className="flex items-center space-x-2 px-2 py-1.5 hover:bg-primary hover:text-white rounded-sm"
                    onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up and closing dropdown
                  >
                    <Checkbox 
                      id={`${itemName}-${mode.value}`}
                      checked={(formData[itemName] as string[] || []).includes(mode.value)}
                      onCheckedChange={() => {
                        handleCheckboxToggle(itemName as keyof PGFormData, mode.value);
                      }}
                      className="data-[state=checked]:bg-white data-[state=checked]:text-primary"
                    />
                    <Label 
                      htmlFor={`${itemName}-${mode.value}`}
                      className="text-sm font-normal cursor-pointer flex-grow"
                    >
                      {mode.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    // Special case for hdfc_domain_check: render as a dropdown
    if (itemName === 'hdfc_domain_check') {
      return (
        <div className="space-y-2">
          <Label htmlFor={itemName}>{displayName}</Label>
          <Select
            value={formData[itemName]}
            onValueChange={(value) => handleChange(itemName as keyof PGFormData, value)}
          >
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">Yes</SelectItem>
              <SelectItem value="No" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }
    // Special case for website_status: render as a Yes/No dropdown
    if (itemName === 'website_status') {
      return (
        <div className="space-y-2">
          <Label htmlFor={itemName}>{displayName}</Label>
          <Select
            value={formData[itemName]}
            onValueChange={(value) => handleChange(itemName as keyof PGFormData, value)}
          >
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">Yes</SelectItem>
              <SelectItem value="No" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }
    // Special case for industry: render as a dropdown
    if (itemName === 'industry') {
      const industryOptions = [
        'Airlines & Hotels',
        'BFSI',
        'Consultancy',
        'E-com',
        'Education',
        'Government',
        'IT Service',
        'Lending Service',
        'Payment Service',
        'Services',
        'Shipping',
        'Travel & Hospitality',
      ];
      return (
        <div className="space-y-2">
          <Label htmlFor={itemName}>{displayName}</Label>
          <Select
            value={formData[itemName]}
            onValueChange={(value) => handleChange(itemName as keyof PGFormData, value)}
          >
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {industryOptions.map(option => (
                <SelectItem
                  key={option}
                  value={option}
                  className="data-[highlighted]:bg-primary data-[highlighted]:text-white"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    // Special case for sub_industry: render as a dropdown
    if (itemName === 'sub_industry') {
      const subIndustryOptions = [
        'Airlines',
        'Automobile Sale',
        'BFSI Others',
        'Broker',
        'Coaching Class',
        'College',
        'Consultancy Service',
        'Donation',
        'DTH & ISP',
        'e-Auction, e-Tendering & Procurement',
        'E-com Others',
        'Edu Others',
        'Edu Govt',
        'Event Ticket Booking',
        'Government Others',
        'Government Portal',
        'Government Services',
        'Hospital',
        'Hotels',
        'Insurance',
        'IT Service',
        'Job Recruitment',
        'Lending',
        'Logistics',
        'Market Place - B2B',
        'Market Place - B2C',
        'Municipal Corporation',
        'Mutual Fund',
        'NBFC',
        'Payment Service',
        'Road Transport Corporation',
        'School',
        'Smart City Urban Development',
        'Social Service',
        'Social Welfare',
        'Society',
        'Tourism',
        'Travel',
        'University',
        'Utility',
        'Utility Private',
      ];
      return (
        <div className="space-y-2">
          <Label htmlFor={itemName}>{displayName}</Label>
          <Select
            value={formData[itemName]}
            onValueChange={(value) => handleChange(itemName as keyof PGFormData, value)}
          >
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Select Sub industry" />
            </SelectTrigger>
            <SelectContent>
              {subIndustryOptions.map(option => (
                <SelectItem
                  key={option}
                  value={option}
                  className="data-[highlighted]:bg-primary data-[highlighted]:text-white"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    return (
      <div className="space-y-2">
        <Label htmlFor={itemName}>{displayName}</Label>
        {type === 'textarea' ? (
          <Textarea
            id={itemName}
            value={formData[itemName as keyof PGFormData] || ''}
            onChange={e => handleChange(itemName as keyof PGFormData, e.target.value)}
            disabled={readOnly}
          />
        ) : (
          <Input
            id={itemName}
            type={type}
            value={formData[itemName as keyof PGFormData] || ''}
            onChange={e => handleChange(itemName as keyof PGFormData, e.target.value)}
            disabled={readOnly}
            className={readOnly ? "bg-gray-100" : ""}
          />
        )}
      </div>
    );
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* Submission Date at the top right */}
      <div className="flex justify-end mb-2">
        <div className="flex flex-col items-end">
          <span className="mb-1 text-base font-semibold text-gray-700 text-right">Submission Date</span>
          <Input
            id="submission_date"
            type="date"
            value={formData['submission_date'] || ''}
            onChange={e => handleChange('submission_date', e.target.value)}
            className="text-lg border rounded focus:ring-2 focus:ring-primary p-1 w-auto min-w-0"
            style={{maxWidth: 'fit-content'}}
          />
        </div>
      </div>
      {/* Nodal Account Details Section */}
      <Card className="overflow-hidden">
        <Accordion type="single" collapsible defaultValue="nodal-details">
          <AccordionItem value="nodal-details" className="border-0">
            <AccordionTrigger className="text-xl px-6 py-6 text-black border-b border-gray-200 bg-gray-50">
              Nodal Account Details
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>{renderField('nodal_account_name')}</div>
                  <div>{renderField('nodal_bank')}</div>
                  <div>{renderField('nodal_branch_code')}</div>
                  <div>{renderField('nodal_branch_name')}</div>
                  <div>{renderField('nodal_account_number')}</div>
                  <div>{renderField('nodal_ifsc')}</div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      {/* User Details Section */}
      <Card className="overflow-hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="user-details" className="border-0">
            <AccordionTrigger className="text-xl px-6 py-6 text-black border-b border-gray-200 bg-gray-50">
              User Details
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>{renderField('first_name')}</div>
                  <div>{renderField('last_name')}</div>
                  <div>{renderField('full_name', 'text', true)}</div>
                  <div>{renderField('email_id', 'email')}</div>
                  <div>{renderField('mobile_no')}</div>
                  <div>{renderField('phone_no')}</div>
                  <div>{renderField('dob', 'date')}</div>
                  <div>{renderField('personal_pan')}</div>
                  <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>{renderField('personal_street1')}</div>
                    <div>{renderField('personal_street2')}</div>
                  </div>
                  <div className="col-span-full">{renderField('personal_pin')}</div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      {/* Business Details Section */}
      <Card className="overflow-hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="business-details" className="border-0">
            <AccordionTrigger className="text-xl px-6 py-6 text-black border-b border-gray-200 bg-gray-50">
              Business Details
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>{renderField('business_name')}</div>
                  <div>{renderField('business_name_dba')}</div>
                  <div>{renderField('business_type')}</div>
                  <div>{renderField('incorporation_date', 'date')}</div>
                  <div>{renderField('merchant_zone')}</div>
                  <div>{renderField('ann_business_turnover')}</div>
                  <div className="col-span-full">
                    <div className="flex flex-col gap-2">
                      <div className="w-full">{renderField('business_address_registered', 'textarea')}</div>
                      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>{renderField('city_registered')}</div>
                        <div>{renderField('state_registered')}</div>
                        <div>{renderField('country_registered')}</div>
                        <div>{renderField('pin_code_registered')}</div>
                      </div>
                      <label className="flex items-center gap-2 text-sm font-medium mt-2">
                        <input
                          type="checkbox"
                          checked={showOperationalAddress}
                          onChange={e => {
                            setShowOperationalAddress(e.target.checked);
                            if (!e.target.checked) {
                              handleChange('business_address_operational', formData.business_address_registered);
                            }
                          }}
                        />
                        Operational address is different
                      </label>
                      {showOperationalAddress && (
                        <>
                          <div className="w-full">{renderField('business_address_operational', 'textarea')}</div>
                          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>{renderField('city_operational')}</div>
                            <div>{renderField('state_operational')}</div>
                            <div>{renderField('country_operational')}</div>
                            <div>{renderField('pin_code_operational')}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>{renderField('industry')}</div>
                  <div>{renderField('sub_industry')}</div>
                  <div>{renderField('business_segment')}</div>
                  <div>{renderField('affl_cert_atom')}</div>
                  <div>{renderField('business_pan')}</div>
                  <div>{renderField('gstn')}</div>
                  <div>{renderField('business_age', 'text', true)}</div>
                  <div>{renderField('mcc')}</div>
                  <div className="col-span-full">{renderField('pg_use_case', 'textarea')}</div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      {/* Website Details Section */}
      <Card className="overflow-hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="website-details" className="border-0">
            <AccordionTrigger className="text-xl px-6 py-6 text-black border-b border-gray-200 bg-gray-50">
              Website Details
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>{renderField('website', 'url')}</div>
                  <div>{renderField('about_url', 'url')}</div>
                  <div>{renderField('contact_us_url', 'url')}</div>
                  <div>{renderField('refund_policy_url', 'url')}</div>
                  <div>{renderField('privacy_policy_url', 'url')}</div>
                  <div>{renderField('terms_url', 'url')}</div>
                  <div>{renderField('check_out_url', 'url')}</div>
                  <div>{renderField('additional_url', 'url')}</div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* POC Details Section */}
      <Card className="overflow-hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="poc-details" className="border-0">
            <AccordionTrigger className="text-xl px-6 py-6 text-black border-b border-gray-200 bg-gray-50">
              POC Details
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {itemNames.sections["Atom"]["Account Field Details"].items
                    .filter(item => 
                      item.itemName === 'ae_contact' ||
                      item.itemName === 'chargeback_contact' ||
                      item.itemName === 'finance_contact' ||
                      item.itemName === 'product_support_contact' ||
                      item.itemName === 'setup_contact' ||
                      item.itemName === 'verification_contact'
                    )
                    .map(item => (
                      <div key={item.itemName}>
                        {renderField(item.itemName)}
                      </div>
                    ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Requested Limits Section */}
      <Card className="overflow-hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="financials" className="border-0">
            <AccordionTrigger className="text-xl px-6 py-6 text-black border-b border-gray-200 bg-gray-50">
              Requested Limits
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>{renderField('mon_card_turnover')}</div>
                  <div>{renderField('day_txn_no')}</div>
                  <div>{renderField('day_upi_txn_no')}</div>
                  <div>{renderField('day_upi_max_lmt')}</div>
                  <div>{renderField('per_upi_txn_lmt')}</div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* HDFC Section */}
      <Card className="overflow-hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="hdfc" className="border-0">
            <AccordionTrigger className="text-xl px-6 py-6 text-black border-b border-gray-200 bg-gray-50">
              HDFC
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6 mt-6">
                {/* Cards Subsection */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Cards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { itemName: 'hdfc_sl_no', displayName: 'SL No' },
                      { itemName: 'tid_type', displayName: 'TID Type' },
                      { itemName: 'no_of_tid', displayName: 'No of TID' },
                      { itemName: 'tid_req', displayName: 'TID Req' },
                      { itemName: 'ref_tid', displayName: 'Reference TID' },
                      { itemName: 'pg_setup_type', displayName: 'Setup Type' },
                      { itemName: 'hdfc_promo', displayName: 'Promo' }
                    ].map(item => (
                      <div key={item.itemName}>
                        {renderField(item.itemName)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* UPI Subsection */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">UPI</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { itemName: 'entity_mid', displayName: 'Entity MID' },
                      { itemName: 'hdfc_integration_approach', displayName: 'Integration Approach' },
                      { itemName: 'hdfc_settlement_type', displayName: 'Settlement Type' },
                      { itemName: 'ext_mid', displayName: 'External MID' },
                      { itemName: 'hdfc_upi_whitelist1', displayName: 'Whitelisted URL 1' },
                      { itemName: 'hdfc_upi_whitelist2', displayName: 'Whitelisted URL 2' },
                      ...itemNames.sections["HDFC"]["UPI"].items
                        .filter(item => 
                          item.itemName !== 'entity_mid' && 
                          item.itemName !== 'hdfc_integration_approach' &&
                          item.itemName !== 'hdfc_settlement_type' && 
                          item.itemName !== 'ext_mid' && 
                          item.itemName !== 'hdfc_upi_whitelist1' && 
                          item.itemName !== 'hdfc_upi_whitelist2' &&
                          item.itemName !== 'gstn' && 
                          item.itemName !== 'day_upi_txn_no' && 
                          item.itemName !== 'day_upi_max_lmt' && 
                          item.itemName !== 'per_upi_txn_lmt'
                        )
                    ].map(item => (
                      <div key={item.itemName}>
                        {renderField(item.itemName)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Atom Section */}
      <Card className="overflow-hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="atom" className="border-0">
            <AccordionTrigger className="text-xl px-6 py-6 text-black border-b border-gray-200 bg-gray-50">
              Atom
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6 mt-6">
                {/* Opportunities Field Details Subsection */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Opportunities Field Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Render pg_modes with custom display name */}
                    <div>
                      {renderField('pg_modes', 'Payment Modes')}
                    </div>
                    
                    {/* Render other Opportunities fields */}
                    {itemNames.sections["Atom"]["Opportunities Field Details"].items
                      .filter(item => item.itemName !== 'pg_modes')
                      .map(item => (
                        <div key={item.itemName}>
                          {renderField(item.itemName)}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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