
import React, { useState } from 'react';
import { Client } from '../../types';
import { THERAPY_MODALITIES, PRONOUNS } from '../../constants';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import MultiSelectDropdown from '../ui/MultiSelectDropdown';
import Icon from '../ui/Icon';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: Omit<Client, 'id'>) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onAddClient }) => {
  const [clientType, setClientType] = useState<'individual' | 'couple'>('individual');
  const [coupleTab, setCoupleTab] = useState<'client1' | 'client2'>('client1');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [email, setEmail] = useState('');
  const [modalities, setModalities] = useState<string[]>([]);
  
  const [c2FirstName, setC2FirstName] = useState('');
  const [c2LastName, setC2LastName] = useState('');
  const [c2Pronouns, setC2Pronouns] = useState('');
  const [c2Email, setC2Email] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const clientData: Omit<Client, 'id'> = {
      firstName,
      lastName,
      pronouns,
      email,
      modalities,
      type: clientType,
      ...(clientType === 'couple' && {
        client2: {
          firstName: c2FirstName,
          lastName: c2LastName,
          pronouns: c2Pronouns,
          email: c2Email,
        },
      }),
    };
    
    onAddClient(clientData);
    // Reset form or it will be handled by parent
    setLoading(false);
  };
  
  const renderClientForm = (
    isClient2: boolean = false
  ) => (
    <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">First name</label>
            <input type="text" value={isClient2 ? c2FirstName : firstName} onChange={e => isClient2 ? setC2FirstName(e.target.value) : setFirstName(e.target.value)} placeholder="e.g. John" className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light" required />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Last name</label>
            <input type="text" value={isClient2 ? c2LastName : lastName} onChange={e => isClient2 ? setC2LastName(e.target.value) : setLastName(e.target.value)} placeholder="e.g. Doe" className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light" required />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Pronouns for notes</label>
            <select value={isClient2 ? c2Pronouns : pronouns} onChange={e => isClient2 ? setC2Pronouns(e.target.value) : setPronouns(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light">
                <option value="">Select</option>
                {PRONOUNS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Email address <span className="text-gray-400">(optional)</span></label>
            <input type="email" value={isClient2 ? c2Email : email} onChange={e => isClient2 ? setC2Email(e.target.value) : setEmail(e.target.value)} placeholder="e.g. john.doe@mindscribe.io" className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light" />
        </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add new client">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button type="button" onClick={() => setClientType('individual')} className={`px-4 py-1 rounded-md text-sm font-semibold flex items-center gap-2 ${clientType === 'individual' ? 'bg-white shadow' : ''}`}>
                <Icon name="user" className={`h-4 w-4 ${clientType === 'individual' ? 'text-primary' : 'text-gray-500'}`} /> Individual
            </button>
            <button type="button" onClick={() => setClientType('couple')} className={`px-4 py-1 rounded-md text-sm font-semibold flex items-center gap-2 ${clientType === 'couple' ? 'bg-white shadow' : ''}`}>
                <Icon name="users" className={`h-4 w-4 ${clientType === 'couple' ? 'text-primary' : 'text-gray-500'}`} /> Couple
            </button>
          </div>
        </div>
        
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Modalities</label>
            <MultiSelectDropdown options={THERAPY_MODALITIES} selectedOptions={modalities} onChange={setModalities} placeholder="Select..."/>
        </div>

        {clientType === 'individual' ? renderClientForm() : (
            <div>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        <button type="button" onClick={() => setCoupleTab('client1')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${coupleTab === 'client1' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                           Client 1
                        </button>
                        <button type="button" onClick={() => setCoupleTab('client2')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${coupleTab === 'client2' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                           Client 2 <span className="text-red-500">*</span>
                        </button>
                    </nav>
                </div>
                {coupleTab === 'client1' ? renderClientForm() : renderClientForm(true)}
            </div>
        )}

        <div className="mt-8 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add new client'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddClientModal;