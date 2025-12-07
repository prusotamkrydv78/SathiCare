import { periodTrackerModel } from './periodAIService.js';

/**
 * Chat with AI about period data
 * Provides context-aware responses based on user's period history
 */
export const chatAboutPeriods = async (userMessage, cycles, userProfile, chatHistory = []) => {
    try {
        // Build context from user's period data
        const cycleLengths = cycles.filter(c => c.cycleLength).map(c => c.cycleLength);
        const avgCycleLength = cycleLengths.length > 0
            ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
            : 28;

        const commonSymptoms = {};
        cycles.forEach(cycle => {
            if (cycle.symptoms?.physicalSymptoms) {
                cycle.symptoms.physicalSymptoms.forEach(symptom => {
                    commonSymptoms[symptom] = (commonSymptoms[symptom] || 0) + 1;
                });
            }
        });

        const topSymptoms = Object.entries(commonSymptoms)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([symptom]) => symptom);

        // Build conversation history for context
        const conversationContext = chatHistory.length > 0
            ? chatHistory.slice(-6).map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')
            : 'This is the start of the conversation.';

        const prompt = `You are Saathi, a compassionate AI health assistant specializing in menstrual health and women's wellness. You are chatting with a user about their period data.

**User's Period Data Summary:**
- Total cycles logged: ${cycles.length}
- Average cycle length: ${avgCycleLength} days
- Cycle regularity: ${cycleLengths.length > 3 && (Math.max(...cycleLengths) - Math.min(...cycleLengths)) > 7 ? 'Irregular' : 'Regular'}
- Last period: ${cycles[0] ? new Date(cycles[0].startDate).toLocaleDateString() : 'Not logged'}
- Common symptoms: ${topSymptoms.join(', ') || 'None recorded'}
- User age: ${userProfile?.age || 'Not specified'}
- Language preference: ${userProfile?.language || 'english'}

**Recent Conversation:**
${conversationContext}

**User's Current Question:**
${userMessage}

**Instructions:**
1. Answer the user's question based on their period data
2. Be warm, supportive, and empathetic
3. Use simple, easy-to-understand language
4. If the question is about their specific data, reference it
5. Provide actionable advice when appropriate
6. If you detect a serious health concern, recommend seeing a doctor
7. Keep responses concise (2-4 paragraphs max)
8. Respond in ${userProfile?.language || 'english'} if possible, otherwise English

**Important:**
- You are NOT a replacement for medical professionals
- For serious concerns, always recommend consulting a doctor
- Be culturally sensitive (user is from Nepal/South Asia)
- Use local context when giving advice (foods, remedies, etc.)

Provide a helpful, conversational response:`;

        const result = await periodTrackerModel.generateContent(prompt);
        const response = result.response.text();

        return {
            success: true,
            data: {
                message: response,
                context: {
                    totalCycles: cycles.length,
                    averageCycleLength: avgCycleLength,
                    lastPeriodDate: cycles[0]?.startDate,
                    commonSymptoms: topSymptoms
                }
            }
        };
    } catch (error) {
        console.error('Period Chat Error:', error);
        return {
            success: false,
            message: 'Failed to get AI response',
            error: error.message
        };
    }
};

export default {
    chatAboutPeriods
};
