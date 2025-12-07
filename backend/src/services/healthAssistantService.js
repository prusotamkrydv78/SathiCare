import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health Assistant AI Model
const healthAssistantModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512, // Shorter responses
    }
});

/**
 * Chat with AI Health Assistant
 * Uses user's complete health data for context-aware responses
 */
export const chatWithHealthAssistant = async (userMessage, userProfile, healthData, chatHistory = []) => {
    try {
        // Build conversation history
        const conversationContext = chatHistory.length > 0
            ? chatHistory.slice(-4).map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')
            : 'This is the start of the conversation.';

        // Build health context
        const healthContext = buildHealthContext(userProfile, healthData);

        const prompt = `You are Saathi, a friendly AI health assistant for women in Nepal.

**User's Health Profile:**
${healthContext}

**Recent Conversation:**
${conversationContext}

**User's Question:**
${userMessage}

**Instructions:**
1. Give SHORT, CLEAR answers (2-3 sentences max)
2. Use SIMPLE language anyone can understand
3. Base advice on their health data above
4. Be warm and supportive
5. If serious, say "Please see a doctor"
6. Use local context (Nepal/South Asia)
7. Respond in ${userProfile?.language || 'english'}

**Response Format:**
- Keep it brief and actionable
- Use bullet points if needed
- Highlight warnings clearly

Provide a helpful, SHORT response:`;

        const result = await healthAssistantModel.generateContent(prompt);
        const response = result.response.text();

        // Detect urgency
        const urgency = detectUrgency(userMessage, response);

        return {
            success: true,
            data: {
                message: response,
                urgency,
                context: {
                    hasPeriodData: healthData.hasPeriodData,
                    hasPregnancyData: healthData.hasPregnancyData
                }
            }
        };
    } catch (error) {
        console.error('Health Assistant Chat Error:', error);
        return {
            success: false,
            message: 'Failed to get AI response',
            error: error.message
        };
    }
};

/**
 * Build health context from user data
 */
function buildHealthContext(userProfile, healthData) {
    let context = `- Age: ${userProfile?.age || 'Not specified'}\n`;
    context += `- Language: ${userProfile?.language || 'english'}\n`;

    // Period data
    if (healthData.periodData) {
        context += `- Period Tracker: Active\n`;
        context += `- Last period: ${healthData.periodData.lastPeriodDate ? new Date(healthData.periodData.lastPeriodDate).toLocaleDateString() : 'Not logged'}\n`;
        context += `- Cycle: ${healthData.periodData.averageCycleLength || 28} days average\n`;
        if (healthData.periodData.commonSymptoms?.length > 0) {
            context += `- Common symptoms: ${healthData.periodData.commonSymptoms.join(', ')}\n`;
        }
    }

    // Pregnancy data
    if (healthData.pregnancyData) {
        context += `- Pregnancy: Week ${healthData.pregnancyData.currentWeek}, Trimester ${healthData.pregnancyData.trimester}\n`;
        context += `- Due date: ${new Date(healthData.pregnancyData.dueDate).toLocaleDateString()}\n`;
        if (healthData.pregnancyData.recentSymptoms?.length > 0) {
            context += `- Recent symptoms: ${healthData.pregnancyData.recentSymptoms.join(', ')}\n`;
        }
    }

    if (!healthData.periodData && !healthData.pregnancyData) {
        context += `- No period or pregnancy data logged yet\n`;
    }

    return context;
}

/**
 * Detect urgency level from message and response
 */
function detectUrgency(userMessage, aiResponse) {
    const emergencyKeywords = ['emergency', 'bleeding heavily', 'severe pain', 'can\'t breathe', 'chest pain', 'unconscious', 'suicide'];
    const urgentKeywords = ['see a doctor', 'consult doctor', 'medical attention', 'hospital', 'urgent'];
    const moderateKeywords = ['monitor', 'watch for', 'if it continues', 'if symptoms worsen'];

    const messageLower = userMessage.toLowerCase();
    const responseLower = aiResponse.toLowerCase();

    // Check for emergency
    if (emergencyKeywords.some(keyword => messageLower.includes(keyword) || responseLower.includes(keyword))) {
        return 'emergency';
    }

    // Check for urgent
    if (urgentKeywords.some(keyword => responseLower.includes(keyword))) {
        return 'urgent';
    }

    // Check for moderate
    if (moderateKeywords.some(keyword => responseLower.includes(keyword))) {
        return 'moderate';
    }

    return 'normal';
}

/**
 * Get daily health tip
 */
export const getDailyHealthTip = async (userProfile, healthData) => {
    try {
        const healthContext = buildHealthContext(userProfile, healthData);

        const prompt = `You are Saathi, a health assistant for women in Nepal.

**User's Health Profile:**
${healthContext}

Generate ONE short daily health tip (1-2 sentences) based on their profile.
Make it practical, culturally relevant for Nepal, and easy to follow.

Tip:`;

        const result = await healthAssistantModel.generateContent(prompt);
        const tip = result.response.text().trim();

        return {
            success: true,
            data: { tip }
        };
    } catch (error) {
        console.error('Daily Tip Error:', error);
        return {
            success: false,
            message: 'Failed to generate tip',
            error: error.message
        };
    }
};

/**
 * Analyze symptoms
 */
export const analyzeSymptoms = async (symptoms, userProfile, healthData) => {
    try {
        const healthContext = buildHealthContext(userProfile, healthData);

        const prompt = `You are Saathi, a health assistant analyzing symptoms.

**User's Health Profile:**
${healthContext}

**Symptoms:**
${symptoms.join(', ')}

Provide a SHORT analysis (3-4 sentences):
1. What it might be
2. What to do
3. When to see a doctor

Keep it simple and clear:`;

        const result = await healthAssistantModel.generateContent(prompt);
        const analysis = result.response.text();

        const urgency = detectUrgency(symptoms.join(' '), analysis);

        return {
            success: true,
            data: {
                analysis,
                urgency,
                symptoms
            }
        };
    } catch (error) {
        console.error('Symptom Analysis Error:', error);
        return {
            success: false,
            message: 'Failed to analyze symptoms',
            error: error.message
        };
    }
};

export default {
    chatWithHealthAssistant,
    getDailyHealthTip,
    analyzeSymptoms
};
