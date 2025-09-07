import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClient, fetchSessionsForClient, addSession, deleteClient } from '../services/api';
import { transcribeAudio } from '../services/elevenLabsService';
import { structureTranscript } from '../services/geminiService';
import { Client, Session } from '../types';
import Spinner from '../components/ui/Spinner';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import ContextMenu from '../components/ui/ContextMenu';
import UploadRecordingModal from '../components/sessions/UploadRecordingModal';
import Toast from '../components/ui/Toast';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';

const ClientDetailPage: React.FC = () => {
    const { clientId } = useParams<{ clientId: string }>();
    const navigate = useNavigate();
    
    const [client, setClient] = useState<Client | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isStartSessionMenuOpen, setIsStartSessionMenuOpen] = useState(false);
    const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [toastInfo, setToastInfo] = useState({ show: false, message: '' });
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const startSessionBtnRef = useRef<HTMLButtonElement>(null);
    const optionsBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!clientId) {
                setError("Client ID is missing.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const [clientData, sessionsData] = await Promise.all([
                    fetchClient(clientId),
                    fetchSessionsForClient(clientId),
                ]);

                if (clientData) {
                    setClient(clientData);
                    setSessions(sessionsData);
                } else {
                    setError("Client not found.");
                }
            } catch (err) {
                setError("Failed to load client data.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [clientId]);

    const showToast = (message: string) => {
        setToastInfo({ show: true, message });
    };

    const handleMenuOpen = (
      ref: React.RefObject<HTMLButtonElement>,
      setOpen: React.Dispatch<React.SetStateAction<boolean>>,
      alignment: 'left' | 'right' = 'left'
    ) => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const menuWidth = 200; // Assumed width from ContextMenu component
            const left = alignment === 'right' ? rect.right - menuWidth : rect.left;
            setMenuPosition({ top: rect.bottom + 8, left: left });
            setOpen(true);
        }
    };

    const handleProcessUpload = async (file: File) => {
        if (!clientId || !client) {
          throw new Error("Client not found.");
        }
        try {
            const rawTranscript = await transcribeAudio(file);
            const transcript = await structureTranscript(rawTranscript, client.firstName);
            const newSession = await addSession({
                clientId,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                type: 'Transcribed Session',
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                transcript,
            });
            setIsUploadModalOpen(false);
            navigate(`/clients/${clientId}/sessions/${newSession.id}`);
        } catch (error) {
            console.error("Transcription or session creation failed:", error);
            showToast("Failed to process recording. Please try again.");
            throw error; // Re-throw to be caught by the modal
        }
    };

    const handleDeleteClient = async () => {
        if (!client) return;
        try {
            await deleteClient(client.id);
            setIsDeleteConfirmOpen(false);
            navigate('/clients');
        } catch (err) {
            showToast('Failed to delete client.');
            setError('Failed to delete client.');
        }
    };
    
    if (loading) return <div className="flex items-center justify-center h-full"><Spinner /></div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!client) return <div className="p-8">Client data could not be loaded.</div>;

    const initials = `${client.firstName[0]}${client.lastName[0]}`;

    return (
        <div className="flex-1 flex">
            {/* Main content */}
            <div className="flex-1 flex flex-col p-8 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-sm flex-grow">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 px-6">
                        <nav className="-mb-px flex space-x-6">
                            <button className="whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm border-primary text-primary">Sessions</button>
                            <button className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Treatment Plan</button>
                            <button className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-2">Treatment Summary <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">New</span></button>
                        </nav>
                    </div>
                    {/* Sessions List */}
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800">Past sessions</h3>
                            <Button variant="secondary">Schedule</Button>
                        </div>
                        {sessions.length > 0 ? (
                             <ul className="divide-y divide-gray-200">
                                {sessions.map(session => (
                                    <li key={session.id} onClick={() => navigate(`/clients/${client.id}/sessions/${session.id}`)} className="py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium text-gray-800">{session.type}</p>
                                            <p className="text-sm text-gray-500">{session.date}</p>
                                        </div>
                                        <Icon name="chevronRight" className="h-5 w-5 text-gray-400" />
                                    </li>
                                ))}
                             </ul>
                        ) : (
                            <div className="text-center py-12">
                                 <div className="mx-auto h-12 w-12 text-gray-400">
                                    <Icon name="calendar" className="h-12 w-12 text-gray-300" />
                                 </div>
                                <p className="mt-4 text-sm font-medium text-gray-700">No sessions yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <aside className="w-[380px] bg-light-gray border-l border-gray-200 p-6 flex flex-col gap-6 overflow-y-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">{initials}</div>
                        <h1 className="text-xl font-bold text-gray-800">{client.firstName} {client.lastName}</h1>
                    </div>
                    <button ref={optionsBtnRef} onClick={() => handleMenuOpen(optionsBtnRef, setIsOptionsMenuOpen, 'right')} className="p-2 text-gray-500 hover:bg-gray-200 rounded-md"><Icon name="moreVertical" className="h-5 w-5"/></button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <Button ref={startSessionBtnRef} onClick={() => handleMenuOpen(startSessionBtnRef, setIsStartSessionMenuOpen)} className="w-full flex items-center justify-center gap-2"><Icon name="plus" className="h-5 w-5" /> Start new session</Button>
                    <Button variant="secondary" className="w-full">Generate from past session</Button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm text-sm space-y-4">
                     <div className="flex justify-between items-center">
                        <p className="font-bold">Client details</p>
                        <Button variant="ghost" size="sm" onClick={() => showToast('Edit client feature is coming soon!')}>Edit client</Button>
                     </div>
                     <div>
                        <p className="text-gray-500">Modalities</p>
                        <p className="font-medium text-gray-800">{client.modalities.join(', ')}</p>
                     </div>
                      <div>
                        <p className="text-gray-500">Contact information</p>
                        <p className="font-medium text-gray-800">{client.email}</p>
                     </div>
                     <div>
                        <p className="text-gray-500">Default template</p>
                        <p className="font-medium text-gray-800">MindScribe</p>
                     </div>
                </div>
            </aside>
            
            {/* Context Menus */}
            <ContextMenu isOpen={isStartSessionMenuOpen} onClose={() => setIsStartSessionMenuOpen(false)} position={menuPosition}>
                 <button onClick={() => { showToast('Write/dictate feature coming soon!'); setIsStartSessionMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                    <Icon name="fileEdit" className="h-5 w-5 text-primary"/> Write or dictate
                </button>
                <button onClick={() => { setIsUploadModalOpen(true); setIsStartSessionMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                    <Icon name="upload" className="h-5 w-5 text-primary"/> Upload recording
                </button>
            </ContextMenu>
             <ContextMenu isOpen={isOptionsMenuOpen} onClose={() => setIsOptionsMenuOpen(false)} position={menuPosition}>
                <button onClick={() => { showToast('Archive feature coming soon!'); setIsOptionsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                    <Icon name="archive" className="h-5 w-5 text-gray-500"/> Archive client
                </button>
                <button onClick={() => { setIsOptionsMenuOpen(false); setIsDeleteConfirmOpen(true); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                    <Icon name="trash" className="h-5 w-5"/> Delete client
                </button>
            </ContextMenu>

            {/* Modals & Toasts */}
            <UploadRecordingModal 
                isOpen={isUploadModalOpen} 
                onClose={() => setIsUploadModalOpen(false)}
                onProcess={handleProcessUpload} 
            />
            <ConfirmationDialog
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDeleteClient}
                title="Delete Client"
                message={`Are you sure you want to permanently delete ${client.firstName} ${client.lastName}? This will also delete all of their sessions. This action cannot be undone.`}
            />
            <Toast message={toastInfo.message} show={toastInfo.show} onClose={() => setToastInfo({ show: false, message: '' })} />
        </div>
    );
};

export default ClientDetailPage;
