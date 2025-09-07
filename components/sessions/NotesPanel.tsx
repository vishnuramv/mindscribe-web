import React, { useState, useEffect } from 'react';
import { Session, Client, GeneratedNote } from '../../types';
import { generateIntakeNote, generateClientSummary } from '../../services/geminiService';
import { updateSession } from '../../services/api';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Icon from '../ui/Icon';

interface NotesPanelProps {
  session: Session;
  client: Client;
}

type NoteType = 'intake' | 'summary' | 'private' | null;

const NotesPanel: React.FC<NotesPanelProps> = ({ session, client }) => {
  const [activeNoteType, setActiveNoteType] = useState<NoteType>('intake');
  const [generatedIntakeNote, setGeneratedIntakeNote] = useState<GeneratedNote | null>(null);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [privateNote, setPrivateNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
      setPrivateNote(session.privateNote || '');
  }, [session.privateNote]);

  const handleGenerateNote = async (type: 'intake' | 'summary') => {
    setIsLoading(true);
    setError(null);
    setActiveNoteType(type);
    
    try {
        if (type === 'intake') {
            const note = await generateIntakeNote(session.transcript, `${client.firstName} ${client.lastName}`);
            setGeneratedIntakeNote(note);
        } else if (type === 'summary') {
            const summary = await generateClientSummary(session.transcript);
            setGeneratedSummary(summary);
        }
    } catch(err) {
        setError('Failed to generate note. Please try again.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSavePrivateNote = async () => {
      setIsSaving(true);
      setSaveSuccess(false);
      try {
          await updateSession(session.id, { privateNote });
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2500);
      } catch (err) {
          setError('Failed to save private note.');
          console.error(err);
      } finally {
          setIsSaving(false);
      }
  };
  
  const NoteActionButtons: React.FC = () => (
     <div className="flex items-center gap-2">
        <button className="p-1 text-gray-500 hover:text-gray-800"><Icon name="copy" className="h-4 w-4"/></button>
        <button className="p-1 text-gray-500 hover:text-gray-800"><Icon name="thumbsUp" className="h-4 w-4"/></button>
        <button className="p-1 text-gray-500 hover:text-gray-800"><Icon name="thumbsDown" className="h-4 w-4"/></button>
     </div>
  );

  return (
    <div className="w-1/2 flex flex-col p-6 bg-light-gray">
        <div className="flex justify-between items-center mb-4">
            {/* Top tabs */}
        </div>
        <div className="bg-white p-1 rounded-lg flex space-x-1 mb-4 border border-gray-200">
            <Button variant={activeNoteType === 'intake' ? 'secondary' : 'ghost'} className="flex-1 !bg-white shadow-sm" onClick={() => { setActiveNoteType('intake'); if(!generatedIntakeNote) handleGenerateNote('intake'); }}>Intake note</Button>
            <Button variant={activeNoteType === 'private' ? 'secondary' : 'ghost'} className="flex-1" onClick={() => setActiveNoteType('private')}>Private note</Button>
            <Button variant={activeNoteType === 'summary' ? 'secondary' : 'ghost'} className="flex-1" onClick={() => { setActiveNoteType('summary'); if(!generatedSummary) handleGenerateNote('summary'); }}>Summary for client</Button>
            <Button variant="ghost" className="flex-1">Add note</Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
                {isLoading && (
                    <div className="flex items-center justify-center p-10 bg-white rounded-lg shadow-sm">
                        <Spinner />
                    </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
                
                {!isLoading && activeNoteType === 'intake' && (
                    <div className="max-h-[80vh] overflow-y-scroll p-6 rounded-lg shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                           <h3 className="text-xl font-bold text-gray-800">Intake note</h3>
                           <NoteActionButtons/>
                        </div>
                        {generatedIntakeNote ? (
                          <>
                            <div>
                                <h4 className="font-semibold text-gray-700">Identification information</h4>
                                <p className="text-gray-600 whitespace-pre-wrap">{generatedIntakeNote.identificationInformation}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-gray-700">Family Situation</h4>
                                <p className="text-gray-600 whitespace-pre-wrap">{generatedIntakeNote.familySituation}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700">Socio-demographic Information</h4>
                                <p className="text-gray-600 whitespace-pre-wrap">{generatedIntakeNote.socioDemographicInformation}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700">Reason for seeking therapy</h4>
                                <p className="text-gray-600 whitespace-pre-wrap">{generatedIntakeNote.reasonForSeekingTherapy}</p>
                            </div>
                          </>
                        ) : <button onClick={() => handleGenerateNote('intake')} className="text-primary hover:underline">Generate Intake Note</button>
                       }
                    </div>
                )}
                 {!isLoading && activeNoteType === 'summary' && (
                    <div className="max-h-[80vh] overflow-y-scroll bg-white p-6 rounded-lg shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                           <h3 className="text-xl font-bold text-gray-800">Summary for client</h3>
                           <NoteActionButtons/>
                        </div>
                        {generatedSummary ? <p className="text-gray-600 whitespace-pre-wrap">{generatedSummary}</p> : <button onClick={() => handleGenerateNote('summary')} className="text-primary hover:underline">Generate Summary</button>}
                    </div>
                 )}
                 {!isLoading && activeNoteType === 'private' && (
                     <div className="max-h-[80vh] overflow-y-scroll bg-white p-6 rounded-lg shadow-sm">
                         <h3 className="text-xl font-bold text-gray-800 mb-2">Private note</h3>
                         <p className="text-gray-500 text-sm mb-4">This is a space for your private notes. They are not shared with the client.</p>
                         <textarea
                            value={privateNote}
                            onChange={(e) => setPrivateNote(e.target.value)}
                            placeholder="Type your private notes here..."
                            className="w-full h-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                         />
                         <div className="mt-4 flex items-center justify-end gap-3">
                            {saveSuccess && <p className="text-sm text-green-600">Saved successfully!</p>}
                             <Button onClick={handleSavePrivateNote} disabled={isSaving}>
                                 {isSaving ? 'Saving...' : 'Save Note'}
                             </Button>
                         </div>
                     </div>
                 )}
            </div>

            <div className="col-span-1 space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm text-sm">
                    <p className="font-bold mb-2">CLIENT</p>
                    <p className="text-gray-700">{client.firstName} {client.lastName} (demo)</p>
                    <p className="text-gray-500">{client.email}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-sm">
                    <p className="font-bold mb-2">SESSION</p>
                    <p className="text-gray-700">{session.type} on {session.date}</p>
                    <p className="text-gray-500">{session.time}</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default NotesPanel;
