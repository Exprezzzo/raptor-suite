// RAPTOR VOICE MODE - COMPLETE IMPLEMENTATION
// File: /functions/src/voiceMode.ts

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'; // Make sure admin is initialized for Firestore
import { UniversalAI } from './universalAI'; // Assuming this path is correct for your UniversalAI

// Import the Google Cloud Speech and Text-to-Speech clients
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Initialize Firebase Admin SDK if it hasn't been elsewhere
if (!admin.apps.length) {
    admin.initializeApp();
}

// Initialize Google Cloud Speech and Text-to-Speech clients
const speechClient = new SpeechClient();
const ttsClient = new TextToSpeechClient();

export interface VoiceModeSession {
    sessionId: string;
    userId: string;
    projectId?: string;
    isActive: boolean;
    startTime: number;
    lastActivity: number;
    conversationContext: string[];
    currentActivity: 'brainstorming' | 'building' | 'reviewing' | 'teaching';
    participants: string[]; // For family collaboration
    audioSettings: {
        speechRate: number;
        voice: string;
        backgroundNoiseLevel: 'low' | 'medium' | 'high'; // Added for noise handling
    };
    // Add new fields for multi-AI "Round Table Mode" context if needed
    aiParticipants?: { [key: string]: string }; // e.g., { 'anthropic': 'active', 'openai': 'idle' }
    discussionPoints?: string[]; // For round table mode, tracking issues/problems
}

export class RaptorVoiceMode {
    private session: VoiceModeSession;
    private audioModePrompts = {
        base: `
RAPTOR VOICE MODE ACTIVE - HANDS-FREE CONVERSATION
User is not looking at screen. Adapt communication for audio-only interaction:

COMMUNICATION STYLE:

- Paint vivid mental pictures with descriptions
- Use natural speech patterns and conversational tone
- Give step-by-step verbal instructions with clear pause points
- No visual references (“click here” becomes “when you’re ready, say continue”)
- More descriptive, like talking to a creative partner
- Use spatial language: “imagine a canvas in front of you…”

INTERACTION PATTERNS:

- Ask “Are you ready for the next step?” before moving forward
- Summarize progress frequently: “So far we’ve created…”
- Use audio-friendly confirmations: “I heard you say…”
- Provide rich context for any changes or additions

CREATIVE GUIDANCE:

- Describe visual concepts through analogies and metaphors
- Break complex ideas into digestible audio chunks
- Use storytelling techniques to explain technical concepts
- Guide through visualization exercises
  `,

        brainstorming: `
  BRAINSTORMING MODE: Help user explore ideas through conversation.
- Ask open-ended questions to spark creativity
- Build on their ideas with “Yes, and…” responses
- Suggest creative connections and possibilities
- Use analogies from their interests/background
- Encourage wild ideas and experimentation
  `,

        building: `
  BUILDING MODE: Guide hands-on creation through audio instruction.
- Provide detailed step-by-step guidance
- Explain the “why” behind each step
- Describe what should be happening visually
- Offer troubleshooting tips proactively
- Check comprehension before moving forward
  `,

        reviewing: `
  REVIEWING MODE: Walk through created content for feedback and iteration.
- Describe what exists in rich detail
- Point out strengths and areas for improvement
- Suggest specific enhancements
- Guide through revision process verbally
- Celebrate progress and achievements
  `,

        teaching: `
  TEACHING MODE: Explain concepts through audio-friendly education.
- Use analogies and real-world examples
- Break complex topics into simple concepts
- Encourage questions and exploration
- Provide context for why things work certain ways
- Build understanding progressively
  `
    };

    constructor(session: VoiceModeSession) {
        this.session = session;
    }

    // Enhanced AI prompt generation for voice mode
    generateVoiceModePrompt(userInput: string, context: any): string {
        const basePrompt = this.audioModePrompts.base;
        const activityPrompt = this.audioModePrompts[this.session.currentActivity];

        // Include info for "Round Table Mode" if applicable
        const aiParticipantsStatus = this.session.aiParticipants ?
            Object.entries(this.session.aiParticipants).map(([ai, status]) => `${ai}: ${status}`).join(', ') : 'N/A';
        const discussionPoints = this.session.discussionPoints ?
            `Current discussion points: ${this.session.discussionPoints.join('; ')}` : '';


        const contextualInfo = `
CURRENT SESSION CONTEXT:
- Activity: ${this.session.currentActivity}
- Project: ${context.projectType || 'general conversation'}
- Session Duration: ${Math.floor((Date.now() - this.session.startTime) / 60000)} minutes
- Participants: ${this.session.participants.join(', ')}
- Previous Context: ${this.session.conversationContext.slice(-3).join(' | ')}
- AI Participants Status: ${aiParticipantsStatus}
${discussionPoints}

USER INPUT: “${userInput}”

VOICE MODE RESPONSE GUIDELINES:

- Respond as if user is walking around, hands-free
- Be descriptive and paint mental pictures
- Use natural conversation flow
- Provide clear verbal navigation
- Ask for verbal confirmations before proceeding
  `;

        return `${basePrompt}\n${activityPrompt}\n${contextualInfo}`;
    }

    // Process voice input and generate appropriate response
    async processVoiceInput(
        audioBuffer: Buffer,
        context: any
    ): Promise<{
        transcription: string;
        response: string;
        audioResponse: Buffer;
        sessionUpdate: Partial<VoiceModeSession>;
    }> {

        // 1. Speech-to-Text
        const transcription = await this.speechToText(audioBuffer, this.session.audioSettings.backgroundNoiseLevel);
        functions.logger.log('Transcription:', transcription);

        // 2. Update conversation context
        this.session.conversationContext.push(`User: ${transcription}`);
        if (this.session.conversationContext.length > 20) {
            this.session.conversationContext = this.session.conversationContext.slice(-15);
        }

        // 3. Detect activity type from voice input
        const detectedActivity = this.detectActivity(transcription);
        if (detectedActivity !== this.session.currentActivity) {
            this.session.currentActivity = detectedActivity;
            functions.logger.log('Activity changed to:', this.session.currentActivity);
        }

        // 4. Generate voice-optimized prompt
        const voicePrompt = this.generateVoiceModePrompt(transcription, context);
        functions.logger.log('Voice Prompt:', voicePrompt);

        // 5. Get AI response through Universal Router
        const aiResponse = await UniversalAI.process({
            prompt: voicePrompt,
            provider: this.selectVoiceOptimizedProvider(transcription),
            context: {
                voiceMode: true,
                sessionContext: this.session.conversationContext,
                activity: this.session.currentActivity,
                // Pass along AI participants and discussion points for round table mode
                aiParticipants: this.session.aiParticipants,
                discussionPoints: this.session.discussionPoints,
                ...context // Include any other relevant context
            }
        });
        functions.logger.log('AI Response:', aiResponse.result);

        // 6. Convert response to speech
        const audioResponse = await this.textToSpeech(
            aiResponse.result,
            this.session.audioSettings
        );

        // 7. Update session
        const sessionUpdate = {
            lastActivity: Date.now(),
            conversationContext: this.session.conversationContext,
            currentActivity: this.session.currentActivity // Ensure currentActivity is updated in session
        };

        // Add AI response to context for future turns
        this.session.conversationContext.push(`Raptor: ${aiResponse.result}`);

        return {
            transcription,
            response: aiResponse.result,
            audioResponse,
            sessionUpdate
        };
    }

    // Detect current activity from voice input
    private detectActivity(transcription: string): VoiceModeSession['currentActivity'] {
        const lower = transcription.toLowerCase();

        if (lower.includes('idea') || lower.includes('brainstorm') || lower.includes('think') || lower.includes('concept')) {
            return 'brainstorming';
        }
        if (lower.includes('build') || lower.includes('create') || lower.includes('make') || lower.includes('code') || lower.includes('design')) {
            return 'building';
        }
        if (lower.includes('review') || lower.includes('look at') || lower.includes('check') || lower.includes('feedback')) {
            return 'reviewing';
        }
        if (lower.includes('explain') || lower.includes('how') || lower.includes('teach') || lower.includes('learn')) {
            return 'teaching';
        }

        return this.session.currentActivity; // Keep current if no clear indicator
    }

    // Select best AI provider for voice interactions and "Round Table Mode"
    private selectVoiceOptimizedProvider(input: string): string {
        const lowerInput = input.toLowerCase();

        // If explicitly asking for a specific AI or if a discussion point suggests it
        if (lowerInput.includes('claude') || lowerInput.includes('anthropic') || (this.session.currentActivity === 'brainstorming' && !this.session.aiParticipants?.anthropic)) {
            return 'anthropic';
        }
        if (lowerInput.includes('gpt') || lowerInput.includes('openai') || (this.session.currentActivity === 'building' && !this.session.aiParticipants?.openai)) {
            return 'openai';
        }
        if (lowerInput.includes('gemini') || lowerInput.includes('google') || (this.session.currentActivity === 'reviewing' && !this.session.aiParticipants?.gemini)) {
            return 'gemini';
        }

        // Default routing based on activity if no explicit AI mentioned
        if (this.session.currentActivity === 'brainstorming' ||
            this.session.currentActivity === 'teaching') {
            return 'anthropic'; // Claude excels at conversational, descriptive responses
        }

        if (this.session.currentActivity === 'building') {
            return 'openai'; // GPT-4 for technical building guidance
        }

        // Default to Gemini for creative review and visual descriptions, or general
        return 'gemini';
    }

    // Enhanced speech-to-text with noise handling using Google Cloud Speech-to-Text API
    private async speechToText(audioBuffer: Buffer, noiseLevel: 'low' | 'medium' | 'high'): Promise<string> {
        const audio = {
            content: audioBuffer.toString('base64'),
        };

        const config: any = { // Use 'any' for now, or define a more specific type if needed
            encoding: 'WEBM_OPUS', // Or specify what your client sends (e.g., LINEAR16, OGG_OPUS)
            sampleRateHertz: 16000,
            languageCode: 'en-US',
            model: 'default', // 'default' or 'latest_long' for better accuracy
            enableAutomaticPunctuation: true,
            audioChannelCount: 1, // Ensure this matches your client's audio
        };

        // Basic noise adaptation (more advanced would involve specific audio processing)
        if (noiseLevel === 'high') {
            config.speechContexts = [{
                phrases: ['raptor suite', 'build', 'brainstorm', 'review', 'teach', 'project', 'collaborate'], // Add common commands for better recognition
            }];
            config.useEnhanced = true; // Use enhanced models for better accuracy in noisy environments
        } else if (noiseLevel === 'medium') {
            config.useEnhanced = true;
        }

        try {
            const [response] = await speechClient.recognize(request);
            const transcription = response.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');
            return transcription;
        } catch (error) {
            functions.logger.error('Speech-to-Text error:', error);
            return 'Error transcribing audio.';
        }
    }

    // Enhanced text-to-speech with natural voice using Google Cloud Text-to-Speech API
    private async textToSpeech(
        text: string,
        settings: VoiceModeSession['audioSettings']
    ): Promise<Buffer> {
        const request = {
            input: { text: text },
            voice: {
                languageCode: 'en-US',
                name: settings.voice || 'en-US-Neural2-C', // Use preferred voice or a natural sounding default
                ssmlGender: settings.voice.includes('female') ? 'FEMALE' : (settings.voice.includes('male') ? 'MALE' : 'NEUTRAL')
            },
            audioConfig: {
                audioEncoding: 'MP3' as any, // MP3 is widely supported
                speakingRate: settings.speechRate || 1.0,
                // pitch: 0, // Optional: adjust pitch if needed
                // effectsProfileId: ['small-bluetooth-speaker-legacy'] // Optional: adapt for different playback devices
            },
        };

        try {
            const [response] = await ttsClient.synthesizeSpeech(request);
            // The audio content is a base64 encoded string, convert to Buffer
            return Buffer.from(response.audioContent as string, 'base64');
        } catch (error) {
            functions.logger.error('Text-to-Speech error:', error);
            // Return an empty buffer or throw a more specific error
            return Buffer.from('');
        }
    }
}

// Firebase Cloud Function for Voice Mode
export const voiceModeHandler = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method not allowed');
        return;
    }

    try {
        const { sessionId, audioData, context } = req.body;

        // Get or create voice session
        const sessionDocRef = admin.firestore().collection('voiceSessions').doc(sessionId);
        const sessionDoc = await sessionDocRef.get();

        let session: VoiceModeSession;
        if (sessionDoc.exists) {
            session = sessionDoc.data() as VoiceModeSession;
        } else {
            // Create new session
            functions.logger.log('Creating new voice session:', sessionId);
            session = {
                sessionId,
                userId: context.userId,
                projectId: context.projectId,
                isActive: true,
                startTime: Date.now(),
                lastActivity: Date.now(),
                conversationContext: [],
                currentActivity: 'brainstorming',
                participants: [context.userId],
                audioSettings: {
                    speechRate: 1.0,
                    voice: 'en-US-Neural2-C', // A good default natural voice
                    backgroundNoiseLevel: 'medium'
                },
                aiParticipants: {}, // Initialize for round table mode
                discussionPoints: []
            };
            await sessionDocRef.set(session); // Set the initial session
        }

        // Process voice input
        const voiceMode = new RaptorVoiceMode(session);
        const result = await voiceMode.processVoiceInput(
            Buffer.from(audioData, 'base64'),
            context
        );

        // Update session in Firestore
        await sessionDocRef.set({ ...session, ...result.sessionUpdate }, { merge: true });
        functions.logger.log('Session updated in Firestore for:', sessionId);

        res.json({
            success: true,
            transcription: result.transcription,
            response: result.response,
            audioResponse: result.audioResponse.toString('base64'),
            sessionId
        });

    } catch (error: any) { // Use 'any' for error type for broader compatibility
        functions.logger.error('Voice mode error:', error);
        res.status(500).json({ success: false, error: error.message, details: error.stack });
    }
});

// Real-time voice session management
export const voiceSessionManager = {
    // Start new voice session
    async startSession(userId: string, projectId?: string): Promise<string> {
        const sessionId = `voice_${Date.now()}_${userId}`;
        const session: VoiceModeSession = {
            sessionId,
            userId,
            projectId,
            isActive: true,
            startTime: Date.now(),
            lastActivity: Date.now(),
            conversationContext: [],
            currentActivity: 'brainstorming',
            participants: [userId],
            audioSettings: {
                speechRate: 1.0,
                voice: 'en-US-Neural2-C',
                backgroundNoiseLevel: 'medium'
            },
            aiParticipants: {},
            discussionPoints: []
        };

        await admin.firestore()
            .collection('voiceSessions')
            .doc(sessionId)
            .set(session);
        functions.logger.log('New voice session started:', sessionId);
        return sessionId;
    },

    // Add participant to voice session (family collaboration)
    async addParticipant(sessionId: string, userId: string): Promise<void> {
        await admin.firestore()
            .collection('voiceSessions')
            .doc(sessionId)
            .update({
                participants: admin.firestore.FieldValue.arrayUnion(userId),
                lastActivity: Date.now()
            });
        functions.logger.log(`Participant ${userId} added to session ${sessionId}`);
    },

    // End voice session
    async endSession(sessionId: string): Promise<void> {
        await admin.firestore()
            .collection('voiceSessions')
            .doc(sessionId)
            .update({
                isActive: false,
                endTime: Date.now()
            });
        functions.logger.log('Voice session ended:', sessionId);
    }
};