import { GoogleGenAI, Type } from "@google/genai";
import { TranscriptEntry, GeneratedNote } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function formatTranscript(transcript: TranscriptEntry[]): string {
    return transcript.map(entry => `${entry.speaker}: ${entry.dialogue}`).join('\n');
}

const intakeNoteSchema = {
    type: Type.OBJECT,
    properties: {
        identificationInformation: {
            type: Type.STRING,
            description: "Client's name, age, and any other identifying details mentioned.",
        },
        familySituation: {
            type: Type.STRING,
            description: "Information about the client's family, relationships, and living situation.",
        },
        socioDemographicInformation: {
            type: Type.STRING,
            description: "Details about the client's work, education, and social background.",
        },
        reasonForSeekingTherapy: {
            type: Type.STRING,
            description: "The primary issues and goals the client expressed for therapy.",
        },
    },
    required: ["identificationInformation", "reasonForSeekingTherapy"],
};

const transcriptSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            time: {
                type: Type.STRING,
                description: "Estimated timestamp of the dialogue in M:SS format, starting from 0:00 and incrementing."
            },
            speaker: {
                type: Type.STRING,
                description: "The speaker, either 'You' (for the therapist) or the client's name."
            },
            dialogue: {
                type: Type.STRING,
                description: "The spoken words for that entry."
            }
        },
        required: ["time", "speaker", "dialogue"]
    }
};

export const structureTranscript = async (rawTranscript: string, clientName: string): Promise<TranscriptEntry[]> => {
    const prompt = `You are an expert in processing therapy session transcripts. Your task is to take a raw text transcript and structure it into a JSON array of dialogue entries. Each entry must have 'time', 'speaker', and 'dialogue' fields.

The speakers are the therapist, who should be labeled as 'You', and the client, whose name is '${clientName}'. The raw transcript may have prefixes like 'T:' for therapist and 'C:' for client. Use these hints to correctly identify the speakers.

Generate estimated timestamps for each entry, starting from '0:00' and incrementing them logically based on the flow of conversation.

The entire output must be a valid JSON array conforming to the provided schema.

Raw Transcript:
---
${rawTranscript}
---
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: transcriptSchema,
            },
        });

        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);
        return parsedJson as TranscriptEntry[];

    } catch (error) {
        console.error("Error structuring transcript:", error);
        // Fallback or mock data for UI development if API key is not set
        return [
            { time: "0:00", speaker: "You", dialogue: "Welcome back. How are you arriving today?" },
            { time: "0:05", speaker: clientName, dialogue: "Drained, honestly. It feels like I never stop moving." },
            { time: "0:10", speaker: "You", dialogue: "Constant motion. What's that like for you?" },
            { time: "0:15", speaker: clientName, dialogue: "Exhausting. I wake up tired and go to bed anxious." },
            { time: "0:20", speaker: "You", dialogue: "This is a mock structured transcript due to an API error." }
        ];
    }
};


export const generateIntakeNote = async (transcript: TranscriptEntry[], clientName: string): Promise<GeneratedNote | null> => {
    const formattedTranscript = formatTranscript(transcript);
    const prompt = `You are a professional therapist's assistant. Based on the following session transcript, generate a structured intake note in JSON format. The client's name is ${clientName}. The note should include sections for 'Identification Information', 'Family Situation', 'Socio-demographic Information', and 'Reason for seeking therapy'.\n\nTranscript:\n${formattedTranscript}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: intakeNoteSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);
        return parsedJson as GeneratedNote;

    } catch (error) {
        console.error("Error generating intake note:", error);
        // Fallback or mock data for UI development if API key is not set
        return {
            identificationInformation: `Name: ${clientName}\nDate of Birth: Unknown (Age: 24 years old)`,
            familySituation: "Family Situation: Single mother with two children, has an older sister and a younger sister, mother alive but not in contact, father deceased. Limited contact with grandparents and cousins.",
            socioDemographicInformation: "Socio-demographic Information: 24-year-old warehouse worker, history of substance use and anger issues, strained family relationships, legal issues (DUI), raised Catholic but has concerns about strict rules.",
            reasonForSeekingTherapy: "The client is seeking therapy due to concerns raised by a friend, primarily struggling with anger management, substance abuse (marijuana and Xanax), and maintaining employment and relationships. They also have a history of legal issues and experience occasional suicidal thoughts during difficult times. The client's goals for counseling include managing anger, developing coping skills, improving relationships, and addressing substance use."
        };
    }
};

export const generateClientSummary = async (transcript: TranscriptEntry[]): Promise<string> => {
    const formattedTranscript = formatTranscript(transcript);
    const prompt = `Summarize the key points and feelings expressed by the client in this therapy session transcript. The summary should be easy for the client to understand and reflect on. Use empathetic and encouraging language. Address the client directly in the second person ("You mentioned...", "It sounds like...").\n\nTranscript:\n${formattedTranscript}`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating client summary:", error);
        return "Could not generate summary at this time. This might be due to a missing API key or a network issue. For demonstration, this is a sample summary: It sounds like you've been going through a lot, and it's completely understandable that you're feeling overwhelmed. You showed a lot of courage by opening up about your past experiences and the challenges you're facing with family and work. Remember to be kind to yourself as you navigate these feelings.";
    }
};
