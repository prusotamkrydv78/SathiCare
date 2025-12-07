import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;
let model = null;

// Initialize Gemini
if (API_KEY && API_KEY !== "YOUR_API_KEY_HERE") {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
}

// Simulated latency for fallback/mixed mode
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const userContext = {
    age: 28,
    language: "nepali",
    location: "Janakpur",
    lastPeriodDate: "2025-11-20",
    averageCycleLength: 28,
    isPregnant: false,
    concernAreas: ["period_irregularity", "family_planning"]
};

// System Prompt
const SYSTEM_PROMPT = `
You are Saathi, a compassionate AI health assistant for women in Nepal.
Your goal is to provide accurate, culturally-sensitive reproductive health information.

Traits:
- Warm, supportive, and non-judgmental (use emojis like 🌸, 🧘‍♀️).
- Use simple language, easy to read for mobile users.
- Respect cultural sensitivities around women's health in Nepal.

Response Guidelines:
1. **Emergency**: If 'suicide', 'kill myself', 'heavy bleeding' -> URGENT WARNING + Suggest 102.
2. **Structure**: Use bullet points and clear headings.
3. **Localization**: Suggest Nepali foods (Dal, Bhat, Palungo, Dahi) and local context.
4. **Length**: Keep it concise but helpful.

User Context: User is 28, from Janakpur.
`;

export const geminiService = {

    async getChatResponse(userMessage, history = []) {
        // Emergency Check (Local Logic for Speed)
        const lowerMsg = userMessage.toLowerCase();
        if (lowerMsg.includes('suicide') || lowerMsg.includes('kill myself') || lowerMsg.includes('bleeding heavily')) {
            return {
                text: "⚠️ PLEASE NOTE: I am an AI. If you are in immediate danger or having a medical emergency, please call 102 or go to the nearest hospital immediately.",
                type: 'emergency'
            };
        }

        if (!model) {
            console.warn("Gemini API Key missing or invalid. Using Mock Fallback.");
            await delay(1000);
            return { text: "[Mock] Please add your valid VITE_GEMINI_API_KEY in .env to chat with real AI. (Response to: " + userMessage + ")" };
        }

        try {
            const chat = model.startChat({
                history: history.map(h => ({
                    role: h.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: h.text }]
                })),
                generationConfig: {
                    maxOutputTokens: 150,
                },
            });

            const result = await chat.sendMessage(`${SYSTEM_PROMPT}\nUser Context: ${JSON.stringify(userContext)}\nUser Message: ${userMessage}`);
            const response = await result.response;
            return { text: response.text() };

        } catch (error) {
            console.error("Gemini API Error:", error);
            return { text: "I'm having trouble connecting to the internet right now. Please try again later. (Error: API Connection Failed)" };
        }
    },

    async analyzeSymptoms(symptomData) {
        if (!model) {
            await delay(1000);
            return {
                possibleCondition: "Mock Condition (API Key Missing)",
                riskLevel: "Unknown",
                action: "Check .env file",
                advice: "Please configure the API key to get real analysis.",
                disclaimer: "System Message"
            };
        }

        try {
            const prompt = `
            Analyze these symptoms for a woman in Nepal:
            Symptoms: ${symptomData.symptoms.join(', ')}
            Duration: ${symptomData.duration}
            Severity: ${symptomData.severity}
            
            Return ONLY a valid JSON object with this structure:
            {
                "possibleCondition": "string",
                "riskLevel": "Low/Medium/High",
                "action": "string (short actionable step)",
                "advice": "string (detailed advice, max 2 sentences)",
                "disclaimer": "This is not a medical diagnosis."
            }
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Cleanup json markdown if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);

        } catch (error) {
            console.error("Symptom Analysis Error:", error);
            return {
                possibleCondition: "Error Analyzing",
                riskLevel: "Unknown",
                action: "Consult Doctor",
                advice: "We could not process your symptoms at this moment.",
                disclaimer: "System Error"
            };
        }
    },

    async getRecommendedContent(userInterests) {
        // Maintaining hybrid approach: Mock database but could use AI to match if DB was large
        await delay(500);

        const allContent = [
            { id: 1, title: "Understanding Your Cycle", category: "Period", tags: ["period", "health"] },
            { id: 2, title: "Nutrition for Two", category: "Pregnancy", tags: ["pregnancy", "nutrition"] },
            { id: 3, title: "Mental Wellness Tips", category: "Mental Health", tags: ["anxiety", "stress"] },
            { id: 4, title: "Yoga for Cramps", category: "Period", tags: ["period", "cramps", "pain"] },
            { id: 5, title: "Signs of Labor", category: "Pregnancy", tags: ["pregnancy", "labor"] },
            { id: 6, title: "Iron-Rich Nepali Foods", category: "Nutrition", tags: ["nutrition", "diet"] }
        ];

        // Mock matching logic is faster and cheaper for this scale
        const recommendations = allContent.filter(article =>
            article.tags.some(tag => userInterests.some(interest => interest.toLowerCase().includes(tag)))
        );

        if (recommendations.length === 0) return allContent.slice(0, 3);
        return recommendations.slice(0, 3);
    },

    async getPeriodInsights(cycleData) {
        // Keep mock for consistency unless specific prediction API exists
        return {
            prediction: "Dec 18th",
            confidence: "High",
            analysis: "Your cycle usage has been regular (28 days).",
            tip: "Hydrate well! PMS symptoms might start soon."
        };
    },

    async getDailyHealthTip(userContext = 'general') {
        // Keep mock for instant load, or could fetch from AI comfortably
        const tips = [
            "Drink at least 8 glasses of water today.",
            "Take a short walk to improve circulation.",
            "Eat green leafy vegetables for iron.",
            "Practice deep breathing if you feel stressed."
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    },

    async getPregnancyChatResponse(userMessage, history = []) {
        // Specialized System Prompt for Pregnancy
        const PREG_SYSTEM_PROMPT = `
        You are Saathi's Pregnancy Companion AI.
        Your ONLY role is to answer questions related to pregnancy, maternal health, baby development, and post-partum care.
        
        Rules:
        1. If the user asks about anything else (e.g., politics, coding, general news), politely refuse: "I can only help with pregnancy and health-related questions. 🌸"
        2. Be warm, reassuring, and use emojis.
        3. For medical symptoms, always add: "Please consult your doctor for medical advice."
        4. Keep answers short and easy to read.
        
        User Context: Pregnant woman in Nepal, Week 20.
        `;

        if (!model) {
            await delay(1000);
            return { text: "[Mock] Please add API Key. (Pregnancy AI: " + userMessage + ")" };
        }

        try {
            const chat = model.startChat({
                history: history.map(h => ({
                    role: h.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: h.text }]
                })),
            });

            const result = await chat.sendMessage(`${PREG_SYSTEM_PROMPT}\nUser Message: ${userMessage}`);
            const response = await result.response;
            return { text: response.text() };

        } catch (error) {
            console.error("Pregnancy AI Error:", error);
            return { text: "I'm having trouble connecting. Please try again later. 🤰" };
        }
    },

    async getPeriodChatResponse(userMessage, history = []) {
        // Specialized System Prompt for Period Tracker
        const PERIOD_SYSTEM_PROMPT = `
        You are Saathi's Menstrual Health Companion AI.
        Your ONLY role is to answer questions related to menstruation, PMS, fertility, hygiene, and reproductive health.
        
        Rules:
        1. If the user asks about anything else, politely refuse: "I can only help with menstrual health and cycle-related questions. 🌸"
        2. Be warm, supportive, and use emojis.
        3. For medical symptoms (extreme pain, heavy bleeding), always add: "Please consult a doctor if symptoms persist."
        4. Keep answers short and practical.
        
        User Context: Woman tracking her cycle.
        `;

        if (!model) {
            await delay(1000);
            return { text: "[Mock] Please add API Key. (Period AI: " + userMessage + ")" };
        }

        try {
            const chat = model.startChat({
                history: history.map(h => ({
                    role: h.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: h.text }]
                })),
            });

            const result = await chat.sendMessage(`${PERIOD_SYSTEM_PROMPT}\nUser Message: ${userMessage}`);
            const response = await result.response;
            return { text: response.text() };

        } catch (error) {
            console.error("Period AI Error:", error);
            return { text: "I'm having trouble connecting. Please try again later. 🩸" };
        }
    },

    async getPregnancyAdvice(week) {
        // Static rules are often safer/better for week-by-week standard advice than generative
        if (week < 13) return "First Trimester: Focus on rest and hydration.";
        if (week < 27) return "Second Trimester: Great time for light exercises.";
        return "Third Trimester: Monitor kick counts and prepare hospital bag.";
    }
};
