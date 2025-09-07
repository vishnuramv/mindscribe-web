
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllSessions, fetchClients } from '../services/api';
import { Session, Client } from '../types';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';

const SessionsPage: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [sessionsData, clientsData] = await Promise.all([
                    fetchAllSessions(),
                    fetchClients(),
                ]);
                // Sort sessions by date, most recent first
                const sortedSessions = sessionsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setSessions(sortedSessions);
                setClients(clientsData);
            } catch (error) {
                console.error("Failed to load sessions data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const clientsMap = new Map(clients.map(client => [client.id, client]));

    const getClientInitials = (client?: Client) => {
        if (!client) return '';
        return `${client.firstName[0]}${client.lastName[0]}`;
    };

    const handleSessionClick = (session: Session) => {
        navigate(`/clients/${session.clientId}/sessions/${session.id}`);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full"><Spinner /></div>;
    }

    return (
        <div className="p-8 flex-1 flex flex-col bg-white">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Sessions</h1>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="flex items-center gap-2 text-gray-700">
                        <Icon name="clock" className="h-5 w-5" />
                        Upcoming sessions
                    </Button>
                    <Button className="flex items-center gap-2">
                        <Icon name="calendar" className="h-5 w-5" />
                        Schedule new session
                    </Button>
                </div>
            </header>

            <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                {sessions.map(session => {
                    const client = clientsMap.get(session.clientId);
                    const initialsColor = client?.id === '1' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';

                    return (
                        <div
                            key={session.id}
                            onClick={() => handleSessionClick(session)}
                            className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-lg hover:border-primary-light transition-all duration-200"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-8 h-8 ${initialsColor} rounded-full flex items-center justify-center font-bold text-sm`}>
                                            {getClientInitials(client)}
                                        </div>
                                        <span className="font-semibold text-gray-800">{client?.firstName} {client?.lastName} (demo)</span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {session.date}, {session.time}
                                        {session.duration && ` - ${session.duration} minutes`}
                                    </p>
                                </div>
                                {session.type === 'Intake session' && (
                                     <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                                        {session.type}
                                    </span>
                                )}
                            </div>
                            <div className="mt-4 pl-11">
                                <h2 className="text-lg font-bold text-gray-900 mb-1">{session.title}</h2>
                                <p className="text-gray-600 text-sm">
                                    {session.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SessionsPage;
