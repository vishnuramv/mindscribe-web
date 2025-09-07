import { TranscriptEntry } from '../types';

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/speech-to-text";

/**
 * Transcribes an audio file using the ElevenLabs Speech to Text API.
 * @param file The audio or video file to transcribe.
 * @returns A promise that resolves to the raw transcribed text as a string.
 */
export const transcribeAudio = async (file: File): Promise<string> => {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        console.warn("ElevenLabs API key is not set. Returning mock data.");
        // Simulate network delay for mock response
        await new Promise(resolve => setTimeout(resolve, 2000));
        return `T: Welcome back. How are you arriving today? C: Drained, honestly. It feels like I never stop moving. T: Constant motion. What's that like for you? C: Exhausting. I wake up tired and go to bed anxious. T: So even rest isn't restful. C: Exactly. My brain won't switch off. T: When's the last time you felt truly rested? C: Months ago, maybe last year. T: What changed since then? C: Work ramped up, deadlines, meetings, late nights. T: And how did you respond to that pressure? C: I just said yes to everything. T: Saying yes feels safer? C: Yeah, if I say no, I feel guilty. T: Where does that guilt come from, do you think? C: Probably childhood. My dad worked nonstop. I guess I think I have to. T: So work equals worth? C: Exactly. If I stop, I feel worthless. T: That's heavy to carry. C: It really is. T: How does your body react to this nonstop pace? C: My chest feels tight. I get headaches. T: Signals from your body. C: Yeah, but I ignore them. T: What happens when you ignore? C: They get worse, then I crash. T: Like your body forces you to stop. C: Yes, and I hate that. T: If your body had a voice, what would it say? C: Slow down, please. T: How do you feel hearing that? C: Guilty again, like I'm weak. T: Weakness or wisdom? C: Huh, maybe wisdom. T: Your body might be protecting you. C: I've never thought of it that way. T: When you keep going, what do you fear will happen if you stop? C: I'll fall behind. People will judge me. T: And if you keep going, what happens? C: Burnout, irritability, no joy. T: Sounds like both paths have costs. C: Yeah, it feels lose-lose. T: T, what would a middle path look like? C: Maybe smaller boundaries. T: Like what? C: Shutting the laptop earlier. T: How early? C: Before 10:00 PM. T: How does 8:00 PM sound? C: Scary, but better. T: What's scary about it? C: That I'll miss something urgent. T: How often is urgent actually urgent? C: Rarely, maybe once a month. T: So most of the time, the fear isn't reality. C: True, but the fear still feels real. T: Feelings don't always equal facts. C: Right, I know that, but I forget. T: Let's imagine you do stop at 8:00. What happens next? C: I'd spend time with my family, maybe relax. T: And how might your family feel? C: Happier. They miss me. T: And you? C: Probably lighter, more human. T: What's one barrier to making that happen? C: My own habits, reaching for the laptop. T: Could you replace that with something else? C: Maybe reading or a walk. T: Which one feels doable this week? C: A walk. T: When? C: After dinner, around 8:15. T: Great, that's a small but powerful shift. C: It feels manageable. T: How does your body feel imagining that? C: Calmer, a little more hopeful. T: That hope matters. C: I need more of it. T: Besides work, where else do you feel pressure? C: Social media. Everyone seems more successful. T: Comparison drains you? C: Completely. T: What's one step to reduce that drain? C: Less scrolling. T: How? C: Deleting the app from my phone. T: Could you try it for a week? C: Yeah, that might actually help. T: What emotions come up saying that? C: Relief, also fear of missing out. T: FOMO is powerful. What's the truth under it? C: That I won't actually miss much. T: Exactly. You'll gain time. C: Time I need badly. T: Let's connect the dots. Boundaries with work and with screens. C: Both would give me space. T: Space for what? C: To breathe, to live. T: That sounds important. C: It is. T: How confident are you about trying both changes this week? C: Maybe six out of 10. T: What would make it a seven? C: Accountability. T: How can you hold yourself accountable? C: Tell my partner, ask them to remind me. T: That's a strong plan. C: Yeah, I think it'll help. T: What's one phrase you can repeat when guilt shows up? C: Rest is productive. T: Perfect. How does that feel? C: Empowering. T: Say it again. C: Rest is productive. T: Good, keep that with you. T: As we wrap up, what are your key takeaways? C:`;
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

        return transcribedText || "(No speech detected)";

    } catch (error) {
        console.error("Error transcribing audio with ElevenLabs:", error);
        throw new Error("Failed to transcribe audio. Please check the file and try again.");
    }
};
