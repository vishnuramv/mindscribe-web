
import React, { useState, useEffect, useMemo, useRef, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../../types';
import { fetchClients, addClient as apiAddClient, addSession } from '../../services/api';
import { transcribeAudio } from '../../services/elevenLabsService';
import { structureTranscript } from '../../services/geminiService';
import Modal from '../ui/Modal';
import AddClientModal from '../clients/AddClientModal';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface NewNoteFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewNoteFlowModal: React.FC<NewNoteFlowModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Select Client, 2: Upload, 3: Processing
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  
  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const resetState = () => {
    setStep(1);
    setSelectedClient(null);
    setSearchTerm('');
    setFile(null);
    setError(null);
    setClients([]);
    setClientsLoading(true);
  }

  useEffect(() => {
    if (isOpen) {
      setClientsLoading(true);
      fetchClients().then(fetchedClients => {
        setClients(fetchedClients.sort((a, b) => a.lastName.localeCompare(b.lastName)));
        setClientsLoading(false);
      }).catch(() => {
        setError("Could not load clients.");
        setClientsLoading(false);
      });
    } else {
      resetState();
    }
  }, [isOpen]);

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setStep(2);
    setError(null);
    setFile(null);
  };

  const handleAddClient = async (clientData: Omit<Client, 'id'>) => {
    const newClient = await apiAddClient(clientData);
    setClients(prevClients => [...prevClients, newClient].sort((a, b) => a.lastName.localeCompare(b.lastName)));
    setIsAddClientModalOpen(false);
    handleSelectClient(newClient);
  };

  const handleProcessUpload = async () => {
    if (!file || !selectedClient) return;
    setStep(3);
    setError(null);
    try {
      const rawTranscript = await transcribeAudio(file);
      const transcript = await structureTranscript(rawTranscript, selectedClient.firstName);
      const newSession = await addSession({
        clientId: selectedClient.id,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'Transcribed Session',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        transcript,
      });
      onClose();
      navigate(`/clients/${selectedClient.id}/sessions/${newSession.id}`);
    } catch (err) {
      setError((err as Error).message || "Failed to process recording. Please try again.");
      setStep(2);
    }
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const getModalTitle = () => {
      switch(step) {
          case 1: return "Who is this session for?";
          case 2: return "Upload a session recording";
          case 3: return "Processing recording";
          default: return "New note";
      }
  }

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div>
            <div className="flex justify-between items-center mb-4 gap-4">
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Icon name="search" className="h-5 w-5 text-gray-400" /></span>
                <input type="text" placeholder="Search for a client..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light" />
              </div>
              <Button onClick={() => setIsAddClientModalOpen(true)} className="flex-shrink-0 flex items-center gap-2"><Icon name="plus" className="h-5 w-5" /> Add new client</Button>
            </div>
            {clientsLoading ? <div className="flex justify-center items-center h-64"><Spinner/></div> :
            <ul className="max-h-[60vh] overflow-y-auto -mx-8">
              {filteredClients.length > 0 ? filteredClients.map(client => (
                <li key={client.id} onClick={() => handleSelectClient(client)} className="flex items-center px-8 py-3 hover:bg-primary-light cursor-pointer">
                  <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {client.firstName[0]}{client.lastName[0]}
                  </div>
                  <span className="ml-3 font-medium text-gray-800">{client.firstName} {client.lastName}</span>
                </li>
              )) : <p className="text-center text-gray-500 py-8">No clients found.</p>}
            </ul>
            }
          </div>
        );
      case 2:
        return (
          <div>
            <div className="bg-gray-100 p-2 rounded-lg mb-4 flex justify-between items-center text-sm">
                <p className="text-gray-700">Client: <span className="font-semibold text-gray-900">{selectedClient?.firstName} {selectedClient?.lastName}</span></p>
                <Button variant="ghost" size="sm" onClick={() => { setStep(1); setSelectedClient(null); setFile(null); }}>Change</Button>
            </div>
            <div
              onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${isDragging ? 'border-primary bg-primary-light' : 'border-gray-300 bg-gray-50'}`} >
              <Icon name="cloudUpload" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} className="hidden" accept="audio/*,video/*"/>
              {file ? (<p className="text-gray-700 font-semibold">{file.name}</p>) : (
                <>
                  <button onClick={() => fileInputRef.current?.click()} className="font-semibold text-primary hover:underline">Browse your device</button>
                  <p className="text-gray-500 mt-1">or drag a file here</p>
                </>
              )}
            </div>
             <p className="text-sm text-gray-500 mt-4 text-center">
              Upload audio or video recordings so we can create progress notes.
            </p>
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
             <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button onClick={handleProcessUpload} disabled={!file}>Continue with processing</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center justify-center p-10 h-64">
            <Spinner />
            <p className="mt-4 text-gray-600">Processing your recording... Please wait.</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()}>
        {renderStepContent()}
      </Modal>
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onAddClient={handleAddClient}
      />
    </>
  );
};

export default NewNoteFlowModal;
