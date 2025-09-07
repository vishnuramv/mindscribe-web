import React, { useState, useEffect, useMemo } from 'react';
import { fetchClients, addClient as apiAddClient } from '../services/api';
import { Client } from '../types';
import ClientList from '../components/clients/ClientList';
import AddClientModal from '../components/clients/AddClientModal';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Spinner from '../components/ui/Spinner';

const ClientsPage: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadClients = async () => {
            setLoading(true);
            const fetchedClients = await fetchClients();
            setClients(fetchedClients);
            setLoading(false);
        };
        loadClients();
    }, []);

    const handleAddClient = async (clientData: Omit<Client, 'id'>) => {
        const newClient = await apiAddClient(clientData);
        setClients(prevClients => [...prevClients, newClient].sort((a, b) => a.lastName.localeCompare(b.lastName)));
        setIsModalOpen(false);
    };

    const filteredClients = useMemo(() => {
        return clients.filter(client =>
            `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clients, searchTerm]);

    return (
        <div className="p-8 h-full flex flex-col">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Icon name="search" className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search all clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 pl-10 pr-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                        />
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                        <Icon name="plus" className="h-5 w-5" />
                        Add client
                    </Button>
                </div>
            </header>
            
            <div className="flex-grow bg-white rounded-lg shadow-sm overflow-y-auto">
                 {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Spinner />
                    </div>
                ) : (
                    <ClientList clients={filteredClients} />
                )}
            </div>
            
            <AddClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddClient={handleAddClient}
            />
        </div>
    );
};

export default ClientsPage;