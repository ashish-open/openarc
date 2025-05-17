import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PGDetailsForm, { PGFormData } from '@/components/PGDetailsForm';

const PaymentGatewaySubmission: React.FC = () => {
  const navigate = useNavigate();
  const [pgData, setPgData] = useState<null | { merchantId: string; businessName: string; status: string }>(null);

  const handlePGSave = (data: PGFormData) => {
    setPgData({
      merchantId: data.merchantId,
      businessName: data.business_name,
      status: data.status,
    });
    navigate('/payment-gateway');
  };

  const handlePGSaveAndSend = (data: PGFormData) => {
    handlePGSave(data);
    console.log('Creating Freshdesk ticket for PG integration:', data);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/payment-gateway')}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Payment Gateway Configuration</h1>
          <p className="text-muted-foreground mt-1">
            {pgData ? 'Update your payment gateway settings' : 'Set up your payment gateway integration'}
          </p>
        </div>
      </div>

      <Card className="border-0">
        <CardContent className="pt-6">
          <div className="space-y-8">
            <PGDetailsForm
              initialData={pgData}
              onSave={handlePGSave}
              onSaveAndSend={handlePGSaveAndSend}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGatewaySubmission; 