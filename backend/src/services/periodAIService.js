import { GoogleGenerativeAI } from '@google/generative-ai';

// Validate API key
if (!process.env.GEMINI_API_KEY) {
    console.error('⚠️ GEMINI_API_KEY is not set in .env file');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Period Tracker AI Model - Using gemini-1.5-flash for higher quota
// gemini-1.5-flash: 1500 requests/day (free tier)
// gemini-2.5-flash-lite: 20 requests/day (free tier)
const periodTrackerModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
    }
});

/**
 * Build context from user's period history for AI analysis
 */
const buildPeriodContext = (cycles, userProfile) => {
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

    return {
        totalCycles: cycles.length,
        averageCycleLength: avgCycleLength,
        cycleLengthRange: cycleLengths.length > 0 ? {
            min: Math.min(...cycleLengths),
            max: Math.max(...cycleLengths)
        } : null,
        lastPeriod: cycles[0],
        commonSymptoms: Object.entries(commonSymptoms)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([symptom]) => symptom),
        userAge: userProfile?.age,
        language: userProfile?.language || 'english'
    };
};

/**
 * Predict next period date using AI
 */
export const predictNextPeriod = async (cycles, userProfile) => {
    try {
        if (cycles.length === 0) {
            return {
                success: false,
                message: 'Need at least one period log to make predictions'
            };
        }

        const context = buildPeriodContext(cycles, userProfile);

        const prompt = `You are a women's health AI assistant specializing in menstrual cycle analysis.

User's Menstrual Data:
- Total cycles logged: ${context.totalCycles}
- Average cycle length: ${context.averageCycleLength} days
- Cycle length range: ${context.cycleLengthRange ? `${context.cycleLengthRange.min}-${context.cycleLengthRange.max} days` : 'Not enough data'}
- Last period start: ${new Date(context.lastPeriod.startDate).toLocaleDateString()}
- Last period end: ${context.lastPeriod.endDate ? new Date(context.lastPeriod.endDate).toLocaleDateString() : 'Ongoing'}
- Common symptoms: ${context.commonSymptoms.join(', ') || 'None recorded'}

Based on this data, provide:
1. Predicted next period start date (calculate from last period + average cycle length)
2. Confidence level (high/medium/low) based on cycle regularity
3. Predicted fertile window (ovulation typically 14 days before next period)
4. Brief explanation of the prediction

Format your response as JSON:
{
  "nextPeriodDate": "YYYY-MM-DD",
  "confidence": "high/medium/low",
  "fertileWindow": {
    "start": "YYYY-MM-DD",
    "end": "YYYY-MM-DD"
  },
  "ovulationDate": "YYYY-MM-DD",
  "explanation": "Brief explanation"
}`;

        const result = await periodTrackerModel.generateContent(prompt);
        const response = result.response.text();

        // Parse JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const prediction = JSON.parse(jsonMatch[0]);
            return {
                success: true,
                data: prediction
            };
        }

        return {
            success: false,
            message: 'Failed to parse AI prediction'
        };
    } catch (error) {
        console.error('AI Prediction Error:', error);
        return {
            success: false,
            message: 'Failed to generate prediction',
            error: error.message
        };
    }
};

/**
 * Analyze cycle patterns and identify irregularities
 */
export const analyzeCyclePatterns = async (cycles, userProfile) => {
    try {
        if (cycles.length < 3) {
            return {
                success: false,
                message: 'Need at least 3 cycles to analyze patterns'
            };
        }

        const context = buildPeriodContext(cycles, userProfile);

        const cycleDetails = cycles.slice(0, 6).map(cycle => ({
            startDate: new Date(cycle.startDate).toLocaleDateString(),
            duration: cycle.endDate ? Math.floor((new Date(cycle.endDate) - new Date(cycle.startDate)) / (1000 * 60 * 60 * 24)) + 1 : null,
            cycleLength: cycle.cycleLength,
            painLevel: cycle.symptoms?.pain?.level || 0,
            symptoms: cycle.symptoms?.physicalSymptoms || []
        }));

        const prompt = `You are a women's health AI assistant analyzing menstrual cycle patterns.

User Profile:
- Age: ${context.userAge || 'Not specified'}
- Total cycles tracked: ${context.totalCycles}
- Average cycle length: ${context.averageCycleLength} days

Recent Cycle Data:
${JSON.stringify(cycleDetails, null, 2)}

Analyze this data and provide:
1. Pattern identification (regular/irregular, any trends)
2. Potential irregularities or concerns
3. Symptom patterns (which symptoms occur most frequently)
4. Recommendations for cycle management
5. When to consult a doctor (if any red flags)

Provide detailed, actionable insights in JSON format:
{
  "patterns": ["pattern 1", "pattern 2", ...],
  "irregularities": ["irregularity 1", "irregularity 2", ...],
  "symptomPatterns": ["pattern 1", "pattern 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "doctorConsultation": {
    "needed": true/false,
    "reason": "explanation if needed"
  },
  "overallHealth": "Brief overall assessment"
}`;

        const result = await periodTrackerModel.generateContent(prompt);
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
            message: 'Failed to parse AI analysis'
        };
    } catch (error) {
        console.error('AI Analysis Error:', error);
        return {
            success: false,
            message: 'Failed to analyze patterns',
            error: error.message
        };
    }
};

/**
 * Get personalized symptom relief tips
 */
export const getSymptomReliefTips = async (symptoms, userProfile) => {
    try {
        const prompt = `You are a women's health AI assistant providing symptom relief advice.

User is experiencing:
- Pain level: ${symptoms.pain?.level || 0}/10
- Pain locations: ${symptoms.pain?.location?.join(', ') || 'None'}
- Mood: ${symptoms.mood?.join(', ') || 'Normal'}
- Physical symptoms: ${symptoms.physicalSymptoms?.join(', ') || 'None'}
- User language: ${userProfile?.language || 'english'}

Provide personalized relief tips including:
1. Natural remedies (home remedies common in Nepal/South Asia)
2. Dietary recommendations (using local foods)
3. Exercises or yoga poses
4. Lifestyle tips
5. When to take medication
6. Warning signs to watch for

Respond in ${userProfile?.language || 'english'} language if possible, otherwise English.

Format as JSON:
{
  "naturalRemedies": ["remedy 1", "remedy 2", ...],
  "dietaryTips": ["tip 1", "tip 2", ...],
  "exercises": ["exercise 1", "exercise 2", ...],
  "lifestyleTips": ["tip 1", "tip 2", ...],
  "medicationAdvice": "When and what to take",
  "warningSigns": ["sign 1", "sign 2", ...],
  "quickReliefTip": "One immediate action to take"
}`;

        const result = await periodTrackerModel.generateContent(prompt);
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
        console.error('AI Tips Error:', error);
        return {
            success: false,
            message: 'Failed to generate tips',
            error: error.message
        };
    }
};

/**
 * Generate comprehensive period insights
 */
export const generatePeriodInsights = async (cycles, userProfile) => {
    try {
        if (cycles.length === 0) {
            return {
                success: false,
                message: 'No period data available'
            };
        }

        console.log(`Generating insights for ${cycles.length} cycles...`);

        // Get all AI insights in parallel
        const [prediction, patterns, latestSymptomTips] = await Promise.all([
            predictNextPeriod(cycles, userProfile),
            cycles.length >= 3 ? analyzeCyclePatterns(cycles, userProfile) : Promise.resolve({ success: false, message: 'Need 3+ cycles' }),
            cycles[0]?.symptoms ? getSymptomReliefTips(cycles[0].symptoms, userProfile) : Promise.resolve({ success: false, message: 'No symptoms' })
        ]);

        console.log('Prediction result:', prediction.success ? 'Success' : prediction.message);
        console.log('Patterns result:', patterns?.success ? 'Success' : patterns?.message);
        console.log('Symptom tips result:', latestSymptomTips?.success ? 'Success' : latestSymptomTips?.message);

        // If prediction failed, log the error
        if (!prediction.success) {
            console.error('Prediction failed:', prediction);
        }
        if (patterns && !patterns.success) {
            console.error('Patterns failed:', patterns);
        }
        if (latestSymptomTips && !latestSymptomTips.success) {
            console.error('Symptom tips failed:', latestSymptomTips);
        }

        return {
            success: true,
            data: {
                prediction: prediction.success ? prediction.data : null,
                patterns: patterns?.success ? patterns.data : null,
                symptomTips: latestSymptomTips?.success ? latestSymptomTips.data : null,
                generatedAt: new Date()
            }
        };
    } catch (error) {
        console.error('Generate Insights Error:', error);
        return {
            success: false,
            message: 'Failed to generate insights',
            error: error.message
        };
    }
};

/**
 * Get Period AI Chat Response
 */
export const getPeriodChatResponse = async (message, history = [], userContext = {}) => {
    try {
        // Build context-aware prompt
        let contextInfo = '';
        if (userContext.hasCycles) {
            contextInfo = `
User Context:
- Last period: ${new Date(userContext.lastPeriodDate).toLocaleDateString()}
- Average cycle: ${userContext.averageCycleLength} days
- Cycles logged: ${userContext.totalCyclesLogged}
- Common symptoms: ${userContext.commonSymptoms.join(', ') || 'None'}
`;
        }

        const prompt = `You are a compassionate menstrual health AI assistant.

${contextInfo}

User's question: ${message}

Provide a helpful, warm response about menstrual health. Use emojis like 🌸, 🩸, 💊.
Keep it concise (2-3 sentences). If it's a medical concern, suggest consulting a doctor.

Response:`;

        const result = await periodTrackerModel.generateContent(prompt);
        const response = result.response.text();

        return {
            success: true,
            data: {
                message: response.trim()
            }
        };
    } catch (error) {
        console.error('Period Chat Error:', error);
        return {
            success: false,
            message: 'Failed to generate chat response',
            error: error.message
        };
    }
};

export default {
    predictNextPeriod,
    analyzeCyclePatterns,
    getSymptomReliefTips,
    generatePeriodInsights,
    getPeriodChatResponse
};
