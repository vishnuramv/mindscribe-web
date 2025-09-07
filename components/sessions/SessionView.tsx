
import React from 'react';
import { Session, Client } from '../../types';
import TranscriptPanel from './TranscriptPanel';
import NotesPanel from './NotesPanel';

interface SessionViewProps {
  session: Session;
  client: Client;
}

const SessionView: React.FC<SessionViewProps> = ({ session, client }) => {
  return (
    <div className="flex-1 flex overflow-hidden">
      <TranscriptPanel transcript={session.transcript} title={session.type} />
      <NotesPanel session={session} client={client} />
    </div>
  );
};

export default SessionView;
