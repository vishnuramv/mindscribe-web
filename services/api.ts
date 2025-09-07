import { Client, Session, TranscriptEntry } from '../types';

const mockTranscript: TranscriptEntry[] = [
    { time: "0:00:14", speaker: "You", dialogue: "Hi, Rhonda. How you doing today?" },
    { time: "0:00:15", speaker: "Rhonda", dialogue: "I'm fine." },
    { time: "0:00:16", speaker: "You", dialogue: "You're fine?" },
    { time: "0:00:17", speaker: "Rhonda", dialogue: "Yeah." },
    { time: "0:00:18", speaker: "You", dialogue: "I'm glad you could come in today for this intake. Want to explain a little about the process? I understand you've already completed the informed consent." },
    { time: "0:00:28", speaker: "Rhonda", dialogue: "Yeah, I've done it before." },
    { time: "0:00:30", speaker: "You", dialogue: "So you've done this before?" },
    { time: "0:00:31", speaker: "Rhonda", dialogue: "Yeah." },
    { time: "0:00:32", speaker: "You", dialogue: "So understand my obligations to report certain things. Okay, okay, so you answered some other questions in that packet you filled out with the informed consent, factual type questions. Information might be on your driver's license or insurance cards, things like that. I'm going to be asking you more emotionally oriented questions as part of this part of the intake." },
    { time: "0:01:00", speaker: "Rhonda", dialogue: "Okay." },
    { time: "0:01:02", speaker: "You", dialogue: "Some of the topics we'll be covering are sensitive for many people, and you may not want to talk about it. That's okay." },
    { time: "0:01:10", speaker: "Rhonda", dialogue: "All right." },
];

const mockTranscript2: TranscriptEntry[] = [
    { time: "0:00:14", speaker: "You", dialogue: "Hi, Tony. How you doing today?" },
    { time: "0:00:15", speaker: "Tony", dialogue: "I'm fine." },
    { time: "0:00:16", speaker: "You", dialogue: "You're fine?" },
    { time: "0:00:17", speaker: "Tony", dialogue: "Yeah." },
    { time: "0:00:18", speaker: "You", dialogue: "I'm glad you could come in today for this intake. Want to explain a little about the process? I understand you've already completed the informed consent." },
    { time: "0:00:28", speaker: "Tony", dialogue: "Yeah, I've done it before." },
    { time: "0:00:30", speaker: "You", dialogue: "So you've done this before?" },
    { time: "0:00:31", speaker: "Tony", dialogue: "Yeah." },
    { time: "0:00:32", speaker: "You", dialogue: "So understand my obligations to report certain things. Okay, okay, so you answered some other questions in that packet you filled out with the informed consent, factual type questions. Information might be on your driver's license or insurance cards, things like that. I'm going to be asking you more emotionally oriented questions as part of this part of the intake." },
    { time: "0:01:00", speaker: "Tony", dialogue: "Okay." },
    { time: "0:01:02", speaker: "You", dialogue: "Some of the topics we'll be covering are sensitive for many people, and you may not want to talk about it. That's okay." },
    { time: "0:01:10", speaker: "Tony", dialogue: "All right." },
];

let mockClients: Client[] = [
    { id: '1', firstName: 'Rhonda', lastName: 'Garcia Sanchez', email: 'rhonda.sanchez@example.com', pronouns: 'She/Her', modalities: ['Logotherapy', 'Multicultural Therapy'], type: 'individual' },
    { id: '2', firstName: 'Tony', lastName: 'Pasano', email: 'tony.p@example.com', pronouns: 'He/Him', modalities: ['MI: Motivational Interviewing'], type: 'individual' },
];

let mockSessions: Session[] = [
    { id: '101', clientId: '1', date: 'Apr 29, 2023', type: 'Intake note demo', time: '7:00 PM - 7:00 PM, 0 min', transcript: mockTranscript, privateNote: 'Client seems hesitant to open up but is willing to engage in the process.' },
    { id: '102', clientId: '2', date: 'May 5, 2023', type: 'Individual online session', time: '10:00 AM - 10:45 AM, 45 min', transcript: mockTranscript2 },
];

let nextClientId = 3;
let nextSessionIdCounter = 0;


export const fetchClients = async (): Promise<Client[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockClients]), 500));
};

export const addClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
    const newClient: Client = { ...client, id: String(nextClientId++) };
    mockClients.push(newClient);
    return new Promise(resolve => setTimeout(() => resolve(newClient), 500));
};

export const deleteClient = async (clientId: string): Promise<void> => {
    mockClients = mockClients.filter(c => c.id !== clientId);
    mockSessions = mockSessions.filter(s => s.clientId !== clientId);
    return new Promise(resolve => setTimeout(resolve, 500));
};

export const fetchSession = async (sessionId: string): Promise<Session | undefined> => {
    const session = mockSessions.find(s => s.id === sessionId);
    return new Promise(resolve => setTimeout(() => resolve(session ? { ...session } : undefined), 500));
};

export const deleteSession = async (sessionId: string): Promise<void> => {
    mockSessions = mockSessions.filter(s => s.id !== sessionId);
    return new Promise(resolve => setTimeout(resolve, 500));
};

export const updateSession = async (sessionId: string, data: Partial<Omit<Session, 'id'>>): Promise<Session> => {
    const sessionIndex = mockSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex > -1) {
        mockSessions[sessionIndex] = { ...mockSessions[sessionIndex], ...data };
        const updatedSession = { ...mockSessions[sessionIndex] };
        return new Promise(resolve => setTimeout(() => resolve(updatedSession), 500));
    }
    throw new Error('Session not found');
};

export const fetchClient = async (clientId: string): Promise<Client | undefined> => {
    const client = mockClients.find(c => c.id === clientId);
    return new Promise(resolve => setTimeout(() => resolve(client ? { ...client } : undefined), 500));
};

export const fetchSessionsForClient = async (clientId: string): Promise<Session[]> => {
    const sessions = mockSessions.filter(s => s.clientId === clientId);
    return new Promise(resolve => setTimeout(() => resolve([...sessions]), 500));
};

export const addSession = async (sessionData: Omit<Session, 'id'>): Promise<Session> => {
    const newSession: Session = {
        ...sessionData,
        id: String(Date.now() + nextSessionIdCounter++), // Simple unique ID
    };
    mockSessions.push(newSession);
    return new Promise(resolve => setTimeout(() => resolve(newSession), 500));
};