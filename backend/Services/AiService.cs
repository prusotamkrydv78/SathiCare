namespace SathiCare.Api.Services;

public record AiAction(string Label, string Phone);

public record AiResult(bool RedFlag, List<string> Matches, List<AiAction> Actions, string Reply);

/// <summary>Deterministic mock AI — no external calls. Danger-sign check first (English + Nepali), then canned topic replies with a disclaimer.</summary>
public class AiService
{
    public const string Disclaimer = "This is general information, not medical advice. Please consult a health worker.";

    private static readonly AiAction[] EmergencyActions =
    {
        new("Call ambulance (102)", "102"),
        new("Call health helpline (1115)", "1115")
    };

    private static readonly string[] RedFlagKeywords =
    {
        // Heavy bleeding
        "heavy bleeding", "soaking through", "clots the size", "bleeding too much",
        "\u0927\u0947\u0930\u0948 \u0930\u0915\u094d\u0924", "\u0927\u0947\u0930\u0948 \u092c\u0917\u093f\u0930\u0939\u0947\u0915\u094b", "\u0930\u0915\u094d\u0924\u0936\u094d\u0930\u093e\u0935 \u0927\u0947\u0930\u0948",
        // Bleeding in pregnancy
        "bleeding and pregnant", "pregnant and bleeding", "bleeding during pregnancy", "spotting during pregnancy",
        "\u0917\u0930\u094d\u092d\u093e\u0935\u0938\u094d\u0925\u093e\u092e\u093e \u0930\u0915\u094d\u0924", "\u0917\u0930\u094d\u092d\u093e\u0935\u0938\u094d\u0925\u093e\u092e\u093e \u092c\u0917\u093f\u0930\u0939\u0947\u0915\u094b",
        // Severe abdominal pain
        "severe abdominal pain", "severe stomach pain", "unbearable pain", "severe cramps",
        "\u0915\u0921\u093e \u092a\u0947\u091f \u0926\u0941\u0916\u093e\u0907", "\u0905\u0938\u0939\u094d\u092f \u0926\u0941\u0916\u093e\u0907",
        // Reduced fetal movement
        "reduced fetal movement", "baby not moving", "less fetal movement", "fewer kicks",
        "baby movement stopped", "movement stopped", "stopped moving", "no kicks",
        "\u092c\u091a\u094d\u091a\u093e \u091a\u0932\u094d\u0926\u0948\u0928", "\u092c\u091a\u094d\u091a\u093e\u0915\u094b \u091a\u093e\u0932 \u0918\u091f\u094d\u092f\u094b",
        // Severe headache / blurred vision
        "severe headache", "blurred vision", "worst headache", "vision problems",
        "\u0915\u0921\u093e \u091f\u093e\u0909\u0915\u094b \u0926\u0941\u0916\u093e\u0907", "\u0906\u0901\u0916\u093e \u0927\u092e\u093f\u0932\u094b",
        // Seizures
        "seizure", "convulsion", "fitting", "fits", "\u092e\u093f\u0930\u094d\u0917\u0940",
        // Fluid leaking
        "water broke", "fluid leaking", "amniotic fluid", "\u092a\u093e\u0928\u0940 \u092b\u0941\u091f\u094d\u092f\u094b", "\u092a\u093e\u0928\u0940 \u092d\u093e\u0917\u094d\u092f\u094b",
        // Fever after delivery
        "fever after delivery", "fever after birth", "postpartum fever", "\u0938\u0941\u0924\u094d\u0915\u0947\u0930\u0940 \u091c\u094d\u0935\u0930\u094b",
        // Fainting
        "fainted", "fainting", "passed out", "unconscious", "\u092c\u0947\u0939\u094b\u0936",
        // Self-harm
        "self harm", "self-harm", "kill myself", "suicide", "end my life", "hurt myself", "\u0906\u0924\u094d\u092e\u0939\u0924\u094d\u092f\u093e"
    };

    private static readonly (string[] Keys, string Reply)[] Replies =
    {
        (new[] { "period pain", "menstrual pain", "cramps", "cramp" },
            "For period pain, try a warm heating pad on your lower belly, gentle stretching, light walking, and drinking warm fluids. If pain keeps you from school or work every month, please see a doctor \u2014 it could be something treatable."),
        (new[] { "irregular cycle", "irregular period", "late period", "period late", "missed period", "cycle delay" },
            "Cycles can vary a few days each month, and stress, travel, sleep, sickness or weight changes can shift your cycle. Track at least 3 months in SathiCare. If cycles are more than 35 days apart or often skipped, get checked."),
        (new[] { "ovulation", "fertile days", "fertile window", "when do i ovulate" },
            "Ovulation usually happens about 14 days before your next period starts, or around the middle of a 28-day cycle (roughly day 14). Tracking daily gives you a better estimate than a calendar alone."),
        (new[] { "pregnancy diet", "what should i eat pregnant", "diet in pregnancy", "food in pregnancy" },
            "In pregnancy, eat regular protein (eggs, dal, fish, chicken, paneer), green leafy vegetables, seasonal fruit, and dairy. Take the iron and folic acid tablets your health worker gives you, avoid raw or very spicy street food, and drink clean boiled water."),
        (new[] { "nausea", "morning sickness", "vomiting" },
            "For nausea or morning sickness, try small frequent meals instead of three big ones, plain crackers before getting up, ginger tea, and avoiding strong smells. If you cannot keep any food or fluids down for a day, see a health worker."),
        (new[] { "exercise", "workout", "yoga", "safe to walk", "walk in pregnancy" },
            "Light to moderate exercise like walking, swimming, and pregnancy-safe yoga is generally fine. Stop if you feel dizzy, get pain, or bleed, and speak with your doctor before starting anything new during pregnancy."),
        (new[] { "mental health", "anxiety", "depressed", "depression", "stressed", "stress", "sad", "lonely" },
            "Your feelings matter, and you are not alone. Talk to someone you trust, rest when your body needs it, and write your worries down. If sadness or worry stays more than two weeks or feels too heavy, please reach out to a health worker or call the health helpline 1115.")
    };

    private const string DefaultReply =
        "I can help with period tracking, pregnancy care, common symptoms and general women\u2019s health questions. " +
        "Try asking about period pain, an irregular cycle, ovulation, pregnancy diet, nausea, or exercise. " +
        "For anything urgent, call 102 (ambulance) or 1115 (health helpline).";

    private const string EmergencyText =
        "These symptoms can be serious and need care RIGHT NOW. Please call 102 for an ambulance " +
        "or 1115 for the health helpline, or go to the nearest hospital immediately. Do not wait. " + Disclaimer;

    public static AiResult Reply(string? message)
    {
        var lower = (message ?? "").ToLowerInvariant();
        var matches = RedFlagKeywords.Where(k => lower.Contains(k)).ToList();
        if (matches.Count > 0)
            return new AiResult(true, matches, EmergencyActions.ToList(), EmergencyText);

        var topic = Replies.FirstOrDefault(r => r.Keys.Any(lower.Contains));
        return new AiResult(false, new List<string>(), new List<AiAction>(),
            topic.Reply is null ? DefaultReply : $"{topic.Reply} {Disclaimer}");
    }

    public static AiResult AnalyzeSymptoms(IEnumerable<string> symptoms, string? notes)
    {
        var joined = string.Join(' ', symptoms) + " " + (notes ?? "");
        return Reply(joined);
    }

    private static readonly string[] Tips =
    {
        "Drink warm fluids and rest during the first days of your cycle.",
        "Keep your iron tablets with a source of vitamin C like citrus, for better absorption.",
        "A 10-minute walk after meals helps with pregnancy heartburn.",
        "Count your baby\u2019s kicks at the same time daily \u2014 10 movements in 2 hours is reassuring.",
        "Sleep on your side with a pillow under the bump in later pregnancy.",
        "Track your mood alongside your cycle \u2014 patterns help your health worker help you.",
        "Keep emergency contacts updated in SathiCare before traveling.",
        "Boil or filter drinking water during pregnancy and monsoon months."
    };

    public static string DailyTip() => Tips[DateTime.UtcNow.DayOfYear % Tips.Length];
}
