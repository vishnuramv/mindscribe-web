
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../../types';
import Icon from '../ui/Icon';

interface ClientListProps {
  clients: Client[];
}

const ClientList: React.FC<ClientListProps> = ({ clients }) => {
  const navigate = useNavigate();

  const groupedClients = clients.reduce((acc, client) => {
    const firstLetter = client.lastName[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(client);
    return acc;
  }, {} as Record<string, Client[]>);

  const sortedGroups = Object.keys(groupedClients).sort();
  
  const handleClientClick = (client: Client) => {
    navigate(`/clients/${client.id}`);
  };

  if (clients.length === 0) {
    return <div className="p-8 text-center text-gray-500">No clients found.</div>;
  }

  return (
    <div className="p-4">
      {sortedGroups.map(letter => (
        <div key={letter} className="mb-4">
          <h2 className="text-sm font-bold text-gray-500 px-4 py-2">{letter}</h2>
          <ul>
            {groupedClients[letter].map(client => (
              <li
                key={client.id}
                onClick={() => handleClientClick(client)}
                className="flex justify-between items-center px-4 py-3 hover:bg-primary-light rounded-lg cursor-pointer"
              >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
                        {client.firstName[0]}{client.lastName[0]}
                    </div>
                    <span>{client.firstName} {client.lastName}</span>
                </div>
                <Icon name="chevronRight" className="h-5 w-5 text-gray-400" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ClientList;
