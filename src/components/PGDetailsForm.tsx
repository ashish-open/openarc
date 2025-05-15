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
  business_operational_pin: string;
  tid_type: string;
  no_of_tid: string;
  tid_req: string;
  check_out_url: string;
  additional_url: string;
  business_age: string;
  pg_setup_type: string;
  hdfc_promo: string;
  ref_tid: string;

  // HDFC - UPI
  entity_mid: string;
  hdfc_integration_approach: string;
  hdfc_settlement_type: string;
  day_upi_txn_no: string;
  day_upi_max_lmt: string;
  per_upi_txn_lmt: string;
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
    business_operational_pin: '',
    tid_type: '',
    no_of_tid: '',
    tid_req: '',
    check_out_url: '',
    additional_url: '',
    business_age: '',
    pg_setup_type: '',
    hdfc_promo: '',
    ref_tid: '',

    // HDFC - UPI
    entity_mid: '',
    hdfc_integration_approach: '',
    hdfc_settlement_type: '',
    day_upi_txn_no: '',
    day_upi_max_lmt: '',
    per_upi_txn_lmt: '',
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
    nodal_bank: '',
    nodal_branch_code: '',
    nodal_branch_name: '',
    nodal_account_number: '',
    nodal_ifsc: '',
    hdfc_prod_id_name: '',
    hdfc_domain_check: 'No',
    atom_multi_status: '',
    website_login_details: '',
    website_status: '',
    atom_min_ticket_size: '',
    atom_max_ticket_size: '',
    pricing_details: '',
    ...safeInitialData,
  });

  const [showOperationalAddress, setShowOperationalAddress] = useState(false);

  const handleChange = (field: keyof PGFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-combine first_name and last_name into full_name
      if (field === 'first_name' || field === 'last_name') {
        const firstName = field === 'first_name' ? value : prev.first_name;
        const lastName = field === 'last_name' ? value : prev.last_name;
        updated.full_name = `${firstName || ''} ${lastName || ''}`.trim();
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
        updated.business_age = age;
      }
      
      return updated;
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
              <SelectValue placeholder="Select Yes or No" />
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
              <SelectValue placeholder="Select Yes or No" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">Yes</SelectItem>
              <SelectItem value="No" className="data-[highlighted]:bg-primary data-[highlighted]:text-white">No</SelectItem>
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
      <div className="space-y-4">
        {/* Basic Details Section */}
        <Card className="overflow-hidden">
          <Accordion type="single" collapsible defaultValue="basic-details">
            <AccordionItem value="basic-details" className="border-0">
              <AccordionTrigger className="text-xl font-semibold px-6 py-4">
                Basic Details
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-6 pb-6">
                  {/* Nodal Account Name and Submission Date at the top */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      {renderField('nodal_account_name', 'Nodal Account Name')}
                    </div>
                    <div>
                      {renderField('submission_date', 'date')}
                    </div>
                  </div>
                  
                  {/* User Details */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">User Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* First Name and Last Name */}
                      <div>
                        {renderField('first_name')}
                      </div>
                      <div>
                        {renderField('last_name')}
                      </div>
                      {/* Full Name and Email ID */}
                      <div>
                        {renderField('full_name', 'text', true)}
                      </div>
                      <div>
                        {renderField('email_id', 'email')}
                      </div>
                      {/* Mobile Number and Phone Number */}
                      <div>
                        {renderField('mobile_no')}
                      </div>
                      <div>
                        {renderField('phone_no')}
                      </div>
                      <div>
                        {renderField('dob', 'date')}
                      </div>
                      
                      {/* Contact information */}
                      <div>
                        {renderField('personal_pan')}
                      </div>
                      <div>
                        {renderField('personal_pin')}
                      </div>
                      <div>
                        {renderField('personal_street1')}
                      </div>
                      <div>
                        {renderField('personal_street2')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Business Details */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Business Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        {renderField('business_name')}
                      </div>
                      <div>
                        {renderField('business_name_dba')}
                      </div>
                      <div>
                        {renderField('business_type')}
                      </div>
                      <div>
                        {renderField('incorporation_date', 'date')}
                      </div>
                      <div>
                        {renderField('merchant_zone')}
                      </div>
                      {/* Registration and Operational Address Logic */}
                      <div className="col-span-full">
                        <div className="flex flex-col gap-2">
                          <div className="w-full">
                            {renderField('business_address_registered', 'textarea')}
                          </div>
                          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              {renderField('city_registered')}
                            </div>
                            <div>
                              {renderField('state_registered')}
                            </div>
                            <div>
                              {renderField('country_registered')}
                            </div>
                            <div>
                              {renderField('pin_code_registered')}
                            </div>
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
                              <div className="w-full">
                                {renderField('business_address_operational', 'textarea')}
                              </div>
                              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  {renderField('city_operational')}
                                </div>
                                <div>
                                  {renderField('state_operational')}
                                </div>
                                <div>
                                  {renderField('country_operational')}
                                </div>
                                <div>
                                  {renderField('pin_code_operational')}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        {renderField('industry')}
                      </div>
                      <div>
                        {renderField('sub_industry')}
                      </div>
                      <div>
                        {renderField('business_segment')}
                      </div>
                      <div>
                        {renderField('affl_cert_atom')}
                      </div>
                      <div>
                        {renderField('business_pan')}
                      </div>
                      <div>
                        {renderField('gstn')}
                      </div>
                      <div>
                        {renderField('business_age', 'text', true)}
                      </div>
                      <div>
                        {renderField('mcc')}
                      </div>
                      <div className="col-span-full">
                        {renderField('pg_use_case', 'textarea')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Financials */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Financials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        {renderField('ann_business_turnover')}
                      </div>
                      <div>
                        {renderField('mon_card_turnover')}
                      </div>
                      <div>
                        {renderField('day_txn_no')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Website Details */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Website Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        {renderField('website', 'url')}
                      </div>
                      <div>
                        {renderField('about_url', 'url')}
                      </div>
                      <div>
                        {renderField('contact_us_url', 'url')}
                      </div>
                      <div>
                        {renderField('refund_policy_url', 'url')}
                      </div>
                      <div>
                        {renderField('privacy_policy_url', 'url')}
                      </div>
                      <div>
                        {renderField('terms_url', 'url')}
                      </div>
                    </div>
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
              <AccordionTrigger className="text-xl font-semibold px-6 py-4">
                HDFC
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-6 pb-6">
                  {/* Cards Subsection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {itemNames.sections["HDFC"]["Cards"].items.map(item => {
                        // Filter out business_age since it's moved to Business Details
                        if (item.itemName === 'business_age') {
                          return null;
                        }
                        return (
                          <div key={item.itemName}>
                            {renderField(item.itemName)}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* UPI Subsection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">UPI</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {itemNames.sections["HDFC"]["UPI"].items.map(item => {
                        // Filter out gstn since it's already in Business Details
                        if (item.itemName === 'gstn') {
                          return null;
                        }
                        // Custom display names for whitelist fields
                        let displayName = item.displayName;
                        if (item.itemName === 'hdfc_upi_whitelist1') {
                          displayName = 'Whitelisted URL 1';
                        } else if (item.itemName === 'hdfc_upi_whitelist2') {
                          displayName = 'Whitelisted URL 2';
                        }
                        return (
                          <div key={item.itemName}>
                            {renderField(item.itemName)}
                          </div>
                        );
                      })}
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
              <AccordionTrigger className="text-xl font-semibold px-6 py-4">
                Atom
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-6 pb-6">
                  {/* Account Field Details Subsection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Account Field Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {itemNames.sections["Atom"]["Account Field Details"].items.filter(item => item.itemName !== 'phone_no' &&
                        item.itemName !== 'merchant_zone' &&
                        item.itemName !== 'business_address_registered' &&
                        item.itemName !== 'city' &&
                        item.itemName !== 'state' &&
                        item.itemName !== 'country' &&
                        item.itemName !== 'business_operation_pin' &&
                        item.itemName !== 'industry' &&
                        item.itemName !== 'sub_industry' &&
                        item.itemName !== 'business_segment' &&
                        item.itemName !== 'affl_cert_atom' &&
                        item.itemName !== 'personal_pan' &&
                        item.itemName !== 'personal_pin' &&
                        item.itemName !== 'personal_street1' &&
                        item.itemName !== 'personal_street2'
                      ).map(item => {
                        // Use textarea for address fields
                        const isTextarea = item.itemName.includes('address');
                        return (
                          <div key={item.itemName} className={`${isTextarea ? 'col-span-full' : ''}`}>
                            {renderField(item.itemName, isTextarea ? 'textarea' : 'text')}
                          </div>
                        );
                      })}
                    </div>
                  </div>

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
      </div>

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