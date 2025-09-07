
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSession, fetchClient, deleteSession } from '../services/api';
import { Session, Client } from '../types';
import SessionView from '../components/sessions/SessionView';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import Icon from '../components/ui/Icon';

const SessionDetailPage: React.FC = () => {
    const { clientId, sessionId } = useParams<{ clientId: string; sessionId: string }>();
    const navigate = useNavigate();
    const [session, setSession] = useState<Session | null>(null);
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!sessionId || !clientId) {
                setError("Session or Client ID is missing.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const sessionData = await fetchSession(sessionId);
                const clientData = await fetchClient(clientId);
                if (sessionData && clientData) {
                    setSession(sessionData);
                    setClient(clientData);
                } else {
                    setError("Session or Client not found.");
                }
            } catch (err) {
                setError("Failed to load session data.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [sessionId, clientId]);

    const handleDeleteSession = async () => {
        if (!sessionId) return;
        try {
            await deleteSession(sessionId);
            setIsDeleteConfirmOpen(false);
            navigate(`/clients/${clientId}`);
        } catch (error) {
            setError("Failed to delete session.");
            console.error(error);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full"><Spinner /></div>;
    }

    if (error) {
        return <div className="p-8 text-red-500">{error}</div>;
    }

    if (!session || !client) {
        return <div className="p-8">Session data could not be loaded.</div>;
    }

    return (
        <div className="flex flex-col h-full bg-light-gray">
            <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(`/clients/${clientId}`)} className="text-gray-500 hover:text-gray-800">
                        <Icon name="chevronRight" className="h-6 w-6 rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{client.firstName} {client.lastName}</h1>
                        <p className="text-sm text-gray-500">{session.type} &middot; {session.date}</p>
                    </div>
                </div>
                <div>
                    <Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setIsDeleteConfirmOpen(true)}>
                        Delete Session
                    </Button>
                </div>
            </header>
            <div className="flex-grow overflow-hidden">
                <SessionView session={session} client={client} />
            </div>
            <ConfirmationDialog
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDeleteSession}
                title="Delete Session"
                message="Are you sure you want to permanently delete this session? This action cannot be undone."
            />
        </div>
    );
};

export default SessionDetailPage;