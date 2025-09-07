import { TranscriptEntry } from '../types';

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/speech-to-text";

/**
 * Transcribes an audio file using the ElevenLabs Speech to Text API.
 * @param file The audio or video file to transcribe.
 * @returns A promise that resolves to an array of TranscriptEntry objects.
 */
export const transcribeAudio = async (file: File): Promise<TranscriptEntry[]> => {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        console.warn("ElevenLabs API key is not set. Returning mock data.");
        // Simulate network delay for mock response
        await new Promise(resolve => setTimeout(resolve, 2000));
        return [{
            time: "0:00:00",
            speaker: "Transcription",
            dialogue: "This is a mock transcription because the ElevenLabs API key is not configured. Please set the ELEVENLABS_API_KEY environment variable to use the actual service."
        }];
    }

    const formData = new FormData();
    formData.append('file', file);
    // The model_id is a required field for the ElevenLabs Speech to Text API.
    formData.append('model_id', 'scribe_v1');

    try {
        const response = await fetch(ELEVENLABS_API_URL, {
            method: 'POST',
            headers: {
                'xi-api-key': apiKey,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail?.message || `API request failed with status ${response.status}`);
        }

        const result = await response.json();
        const transcribedText = result.text;

        // The API returns a single block of text. We'll format it as a single transcript entry.
        const transcript: TranscriptEntry[] = [{
            time: "0:00:00",
            speaker: "Transcription",
            dialogue: transcribedText || "(No speech detected)",
        }];

        return transcript;

    } catch (error) {
        console.error("Error transcribing audio with ElevenLabs:", error);
        throw new Error("Failed to transcribe audio. Please check the file and try again.");
    }
};