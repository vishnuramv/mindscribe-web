
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  pronouns?: string;
  modalities: string[];
  type: 'individual' | 'couple';
  client2?: {
    firstName: string;
    lastName: string;
    pronouns?: string;
    email?: string;
  };
}

export interface TranscriptEntry {
  time: string;
  speaker: string;
  dialogue: string;
}

export interface Session {
  id: string;
  clientId: string;
  date: string;
  type: string;
  time: string;
  duration?: number; // duration in minutes
  title: string;
  description: string;
  transcript: TranscriptEntry[];
  privateNote?: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface GeneratedNote {
  identificationInformation: string;
  familySituation: string;
  socioDemographicInformation: string;
  reasonForSeekingTherapy: string;
}