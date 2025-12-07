import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Pregnancy AI Model - Dedicated instance for pregnancy-related features
const pregnancyAIModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
    }
});

/**
 * Get weekly pregnancy tips and information
 */
export const getWeeklyPregnancyTips = async (week, trimester, userProfile) => {
    try {
        const prompt = `You are a pregnancy health AI assistant providing weekly guidance.

**Pregnancy Details:**
- Week: ${week}
- Trimester: ${trimester}
- User age: ${userProfile?.age || 'Not specified'}
- Language: ${userProfile?.language || 'english'}

Provide comprehensive weekly pregnancy information in JSON format:
{
  "babyDevelopment": "What's happening with baby this week (size, development milestones)",
  "momChanges": "What changes mom might experience this week",
  "nutrition": ["tip 1", "tip 2", "tip 3"] (Include local Nepali/South Asian foods),
  "exercise": ["safe exercise 1", "safe exercise 2"],
  "symptoms": ["common symptom 1", "common symptom 2", "how to manage"],
  "warnings": ["warning sign 1", "warning sign 2"] (When to call doctor),
  "babySize": "Comparison (e.g., 'size of a lemon')",
  "weekHighlight": "Most important thing to know this week"
}

**Important:**
- Use culturally relevant advice for Nepal/South Asia
- Mention local foods (dal, saag, fruits available in Nepal)
- Be supportive and encouraging
- Highlight any critical warnings for this week
- Keep language simple and clear`;

        const result = await pregnancyAIModel.generateContent(prompt);
        const response = result.response.text();

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const tips = JSON.parse(jsonMatch[0]);
            return {
                success: true,
                data: tips
            };
        }

        return {
            success: false,
            message: 'Failed to parse AI tips'
        };
    } catch (error) {
        console.error('Pregnancy Tips Error:', error);
        return {
            success: false,
            message: 'Failed to generate pregnancy tips',
            error: error.message
        };
    }
};

/**
 * Analyze pregnancy symptoms
 */
export const analyzePregnancySymptoms = async (symptoms, week, userProfile) => {
    try {
        const prompt = `You are a pregnancy health AI assistant analyzing symptoms.

**Pregnancy Context:**
- Week: ${week}
- Symptoms: ${symptoms.join(', ')}
- User age: ${userProfile?.age || 'Not specified'}

Analyze these symptoms and provide guidance in JSON format:
{
  "assessment": "Overall assessment of symptoms",
  "normalSymptoms": ["symptom 1 is normal because...", "symptom 2 is common at this stage..."],
  "concerningSymptoms": ["symptom that needs attention", "reason for concern"],
  "recommendations": ["what to do 1", "what to do 2"],
  "whenToCallDoctor": "Specific situations requiring immediate medical attention",
  "reliefTips": ["natural remedy 1", "relief method 2"] (culturally relevant)
}

**Important:**
- Be honest about concerning symptoms
- Provide clear guidance on when to seek medical help
- Suggest safe, natural remedies common in Nepal/South Asia
- Be reassuring but cautious`;

        const result = await pregnancyAIModel.generateContent(prompt);
        const response = result.response.text();

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            return {
                success: true,
                data: analysis
            };
        }

        return {
            success: false,
            message: 'Failed to parse symptom analysis'
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

/**
 * Answer pregnancy-related questions
 */
export const answerPregnancyQuestion = async (question, pregnancyData, userProfile) => {
    try {
        const prompt = `You are Saathi, a compassionate pregnancy AI assistant.

**User's Pregnancy:**
- Week: ${pregnancyData.currentWeek}
- Trimester: ${pregnancyData.trimester}
- Due date: ${new Date(pregnancyData.dueDate).toLocaleDateString()}
- User age: ${userProfile?.age || 'Not specified'}
- Language: ${userProfile?.language || 'english'}

**User's Question:**
${question}

**Instructions:**
1. Answer based on their current pregnancy week
2. Provide accurate, evidence-based information
3. Be warm, supportive, and empathetic
4. Use simple language
5. Include culturally relevant advice for Nepal/South Asia
6. Mention local foods, practices when relevant
7. Always recommend consulting doctor for medical decisions
8. Respond in ${userProfile?.language || 'english'} if possible

Provide a helpful, conversational response (2-4 paragraphs):`;

        const result = await pregnancyAIModel.generateContent(prompt);
        const response = result.response.text();

        return {
            success: true,
            data: {
                answer: response,
                week: pregnancyData.currentWeek,
                trimester: pregnancyData.trimester
            }
        };
    } catch (error) {
        console.error('Pregnancy Question Error:', error);
        return {
            success: false,
            message: 'Failed to answer question',
            error: error.message
        };
    }
};

/**
 * Get nutrition recommendations
 */
export const getNutritionRecommendations = async (week, trimester, userProfile) => {
    try {
        const prompt = `You are a pregnancy nutrition AI assistant.

**Pregnancy Details:**
- Week: ${week}
- Trimester: ${trimester}

Provide nutrition guidance specifically for Nepal/South Asia in JSON format:
{
  "mustEat": ["food 1 (local)", "food 2 (local)", "food 3 (local)"],
  "shouldAvoid": ["food to avoid 1", "food to avoid 2", "reason"],
  "dailyMeals": {
    "breakfast": ["option 1", "option 2"],
    "lunch": ["option 1", "option 2"],
    "dinner": ["option 1", "option 2"],
    "snacks": ["healthy snack 1", "healthy snack 2"]
  },
  "supplements": ["supplement 1", "supplement 2"],
  "hydration": "Water intake guidance",
  "specialTips": ["tip for this trimester 1", "tip 2"]
}

**Important:**
- Focus on foods available in Nepal (dal, bhat, saag, fruits, etc.)
- Consider vegetarian options
- Mention traditional safe foods
- Highlight foods rich in iron, calcium, folic acid
- Be specific about portions`;

        const result = await pregnancyAIModel.generateContent(prompt);
        const response = result.response.text();

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const nutrition = JSON.parse(jsonMatch[0]);
            return {
                success: true,
                data: nutrition
            };
        }

        return {
            success: false,
            message: 'Failed to parse nutrition recommendations'
        };
    } catch (error) {
        console.error('Nutrition Recommendations Error:', error);
        return {
            success: false,
            message: 'Failed to generate nutrition recommendations',
            error: error.message
        };
    }
};

/**
 * Analyze contraction pattern
 */
export const analyzeContractions = async (contractions) => {
    try {
        if (contractions.length < 3) {
            return {
                success: true,
                data: {
                    status: 'monitoring',
                    message: 'Keep tracking contractions. Need at least 3 to analyze pattern.',
                    action: 'Continue timing'
                }
            };
        }

        // Calculate average duration and frequency
        const durations = contractions.map(c => c.duration);
        const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

        // Calculate time between contractions
        const intervals = [];
        for (let i = 1; i < contractions.length; i++) {
            const interval = (contractions[i].startTime - contractions[i - 1].startTime) / 60000; // minutes
            intervals.push(interval);
        }
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

        const prompt = `You are a labor and delivery AI assistant analyzing contraction patterns.

**Contraction Data:**
- Number of contractions: ${contractions.length}
- Average duration: ${Math.round(avgDuration)} seconds
- Average interval: ${Math.round(avgInterval)} minutes
- Latest contractions: ${contractions.slice(-5).map(c => `${Math.round(c.duration)}s, ${c.intensity}`).join('; ')}

Analyze and provide guidance in JSON format:
{
  "status": "early_labor|active_labor|call_hospital|emergency",
  "message": "Clear explanation of what's happening",
  "action": "What to do now",
  "whenToGoHospital": "Specific guidance on when to go to hospital",
  "tips": ["comfort measure 1", "comfort measure 2"]
}

**Labor stages:**
- Early labor: Irregular, 15-20 min apart
- Active labor: Regular, 5-7 min apart, 45-60 sec duration
- Time to go: 5 min apart, 60 sec duration, for 1 hour (5-1-1 rule)
- Emergency: Continuous pain, bleeding, water broke with green fluid`;

        const result = await pregnancyAIModel.generateContent(prompt);
        const response = result.response.text();

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            return {
                success: true,
                data: {
                    ...analysis,
                    stats: {
                        totalContractions: contractions.length,
                        averageDuration: Math.round(avgDuration),
                        averageInterval: Math.round(avgInterval)
                    }
                }
            };
        }

        return {
            success: false,
            message: 'Failed to parse contraction analysis'
        };
    } catch (error) {
        console.error('Contraction Analysis Error:', error);
        return {
            success: false,
            message: 'Failed to analyze contractions',
            error: error.message
        };
    }
};

/**
 * Chat with AI about pregnancy
 * Provides context-aware responses based on user's pregnancy data
 */
export const chatAboutPregnancy = async (userMessage, pregnancyData, userProfile, chatHistory = []) => {
    try {
        // Build conversation history for context
        const conversationContext = chatHistory.length > 0
            ? chatHistory.slice(-6).map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')
            : 'This is the start of the conversation.';

        const prompt = `You are Saathi, a compassionate AI pregnancy assistant. You are chatting with a pregnant user about their pregnancy.

**User's Pregnancy:**
- Current week: ${pregnancyData.currentWeek}
- Trimester: ${pregnancyData.trimester}
- Due date: ${new Date(pregnancyData.dueDate).toLocaleDateString()}
- Days remaining: ${Math.ceil((pregnancyData.dueDate - new Date()) / (1000 * 60 * 60 * 24))}
- User age: ${userProfile?.age || 'Not specified'}
- Language preference: ${userProfile?.language || 'english'}

**Recent Conversation:**
${conversationContext}

**User's Current Question:**
${userMessage}

**Instructions:**
1. Answer the user's question based on their pregnancy week
2. Be warm, supportive, and empathetic
3. Use simple, easy-to-understand language
4. Provide accurate, evidence-based information
5. If you detect a serious concern, recommend seeing a doctor
6. Keep responses concise (2-4 paragraphs max)
7. Respond in ${userProfile?.language || 'english'} if possible, otherwise English
8. Use culturally relevant advice for Nepal/South Asia
9. Mention local foods and practices when appropriate

**Important:**
- You are NOT a replacement for medical professionals
- For serious concerns, always recommend consulting a doctor
- Be culturally sensitive (user is from Nepal/South Asia)
- Use local context when giving advice

Provide a helpful, conversational response:`;

        const result = await pregnancyAIModel.generateContent(prompt);
        const response = result.response.text();

        return {
            success: true,
            data: {
                message: response,
                context: {
                    currentWeek: pregnancyData.currentWeek,
                    trimester: pregnancyData.trimester,
                    dueDate: pregnancyData.dueDate
                }
            }
        };
    } catch (error) {
        console.error('Pregnancy Chat Error:', error);
        return {
            success: false,
            message: 'Failed to get AI response',
            error: error.message
        };
    }
};

export default {
    getWeeklyPregnancyTips,
    analyzePregnancySymptoms,
    answerPregnancyQuestion,
    getNutritionRecommendations,
    analyzeContractions,
    chatAboutPregnancy
};
