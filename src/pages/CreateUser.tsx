import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '@/components/UserForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CreateUser: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    // Here you would typically make an API call to create the user
    console.log('Creating user:', data);
    // For now, just navigate back to the users list
    navigate('/users');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create New User</h1>
      </div>

      <UserForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateUser; 