using System.Text;
using System.Text.Json;

namespace SathiCare.Api.Services;

public record AiAction(string Label, string Phone);

public record AiResult(bool RedFlag, List<string> Matches, List<AiAction> Actions, string Reply, string Source);

/// <summary>
/// Saathi's brain: danger-sign detection ALWAYS runs first (never delegated to the model),
/// then real GPT replies when configured, with the deterministic canned replies as fallback
/// so the demo can never break.
/// </summary>
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
        // Heavy bleeding — many natural phrasings, users rarely use clinical terms
        "heavy bleeding", "bleeding heavily", "bleeding very heavily", "bleeding a lot", "bleeding so much",
        "soaking through", "clots the size", "bleeding too much", "lots of blood", "a lot of blood",
        "bleeding nonstop", "bleeding won't stop", "bleeding won’t stop", "bleeding not stopping", "blood loss",
        "धेरै रक्त", "धेरै बगिरहेको", "रक्तश्राव धेरै", "रक्त बन्द हुदैन",
        // Any bleeding mentioned with dizziness/fainting/pregnancy = urgent combination
        "bleeding and dizzy", "dizzy and bleeding", "bleeding and faint", "bleeding while pregnant", "bleeding and pregnant",
        // Bleeding in pregnancy
        "bleeding during pregnancy", "spotting during pregnancy",
        "गर्भावस्थामा रक्त", "गर्भावस्थामा बगिरहेको",
        // Severe abdominal pain
        "severe abdominal pain", "severe stomach pain", "unbearable pain", "severe cramps", "excruciating pain",
        "कडा पेट दुखाइ", "असह्य दुखाइ",
        // Reduced fetal movement
        "reduced fetal movement", "baby not moving", "less fetal movement", "fewer kicks", "no kicks", "kicks stopped",
        "baby movement stopped", "movement stopped", "stopped moving", "not moving since",
        "बच्चा चल्दैन", "बच्चाको चाल घट्यो",
        // Severe headache / blurred vision
        "severe headache", "blurred vision", "worst headache", "vision problems", "can't see properly", "cannot see properly",
        "कडा टाउको दुखाइ", "आँखा धमिलो",
        // Seizures
        "seizure", "convulsion", "fitting", "fits", "मिर्गी",
        // Fluid leaking
        "water broke", "fluid leaking", "amniotic fluid", "water leaking", "leaking fluid",
        "पानी फुट्यो", "पानी भाग्यो",
        // Fever after delivery
        "fever after delivery", "fever after birth", "postpartum fever", "सुत्केरी ज्वरो",
        // Fainting / dizziness combos
        "fainted", "fainting", "passed out", "unconscious", "बेहोश",
        "dizzy and pregnant", "feeling dizzy and",
        // Self-harm
        "self harm", "self-harm", "kill myself", "suicide", "end my life", "hurt myself", "आत्महत्या"
    };

    private const string EmergencyText =
        "These symptoms can be serious and need care RIGHT NOW. Please call 102 for an ambulance " +
        "or 1115 for the health helpline, or go to the nearest hospital immediately. Do not wait. " + Disclaimer;

    public static AiResult Emergency(string message)
    {
        var lower = (message ?? "").ToLowerInvariant();
        var matches = RedFlagKeywords.Where(k => lower.Contains(k)).ToList();
        return new AiResult(true, matches, EmergencyActions.ToList(), EmergencyText, "safety");
    }

    public static bool HasRedFlag(string? message)
    {
        var lower = (message ?? "").ToLowerInvariant();
        return RedFlagKeywords.Any(k => lower.Contains(k));
    }

    // ---------- Deterministic fallback (used when OpenAI is not configured or fails) ----------

    private static readonly (string[] Keys, string Reply)[] Replies =
    {
        (new[] { "period pain", "menstrual pain", "cramps", "cramp" },
            "For period pain, try a warm heating pad on your lower belly, gentle stretching, light walking, and drinking warm fluids. If pain keeps you from school or work every month, please see a doctor — it could be something treatable."),
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
        "I can help with period tracking, pregnancy care, common symptoms and general women's health questions. " +
        "Try asking about period pain, an irregular cycle, ovulation, pregnancy diet, nausea, or exercise. " +
        "For anything urgent, call 102 (ambulance) or 1115 (health helpline).";

    public static AiResult CannedReply(string? message)
    {
        var lower = (message ?? "").ToLowerInvariant();
        var topic = Replies.FirstOrDefault(r => r.Keys.Any(lower.Contains));
        var reply = topic.Reply is null ? DefaultReply : $"{topic.Reply} {Disclaimer}";
        return new AiResult(false, new List<string>(), new List<AiAction>(), reply, "mock");
    }

    public static string CannedSymptomAdvice(IEnumerable<string> symptoms, string? notes)
    {
        var joined = string.Join(' ', symptoms) + " " + (notes ?? "");
        return CannedReply(joined).Reply;
    }

    // ---------- OpenAI (gpt-6-luna) ----------

    private readonly HttpClient _http;
    private readonly IConfiguration _config;
    private readonly ILogger<AiService> _logger;

    public AiService(HttpClient http, IConfiguration config, ILogger<AiService> logger)
    {
        _http = http;
        _config = config;
        _logger = logger;
    }

    public bool AiEnabled => !string.IsNullOrWhiteSpace(ApiKey);

    private string? ApiKey =>
        _config["OpenAI:ApiKey"] ?? Environment.GetEnvironmentVariable("OPENAI_API_KEY");

    private string Model => _config["OpenAI:Model"] ?? "gpt-6-luna";

    private const string SystemPrompt =
        "You are Saathi, a warm, caring women's health companion inside the SathiCare app, serving women in Nepal. " +
        "You give supportive, practical, general health guidance about periods, cycle tracking, pregnancy care, " +
        "nutrition, mental wellbeing and common symptoms. Rules you MUST follow: " +
        "1) Never diagnose or prescribe specific medicines or dosages — suggest seeing a doctor or health worker instead. " +
        "2) Keep answers warm, simple and short (3-6 sentences, plain language, no markdown headers). " +
        "3) Be sensitive to Nepal context: mention health posts, PHCs, free antenatal checkups, and Nepali emergency numbers (102 ambulance, 1115 health helpline) when relevant. " +
        "4) The user may write in English or Nepali — reply in the language they use. " +
        "5) If the user describes an emergency (heavy bleeding, severe pain, reduced fetal movement, fits, water broke, fainting, self-harm), " +
        "tell them to call 102 or 1115 or go to the nearest hospital immediately. " +
        "6) End every reply with exactly this sentence: 'This is general information, not medical advice. Please consult a health worker.'";

    public async Task<AiResult> ChatAsync(string message)
    {
        // 1) Safety first — the model never decides escalation.
        if (HasRedFlag(message))
            return Emergency(message);

        // 2) Real AI when configured.
        if (AiEnabled)
        {
            try
            {
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(25));
                var body = JsonSerializer.Serialize(new
                {
                    model = Model,
                    messages = new object[]
                    {
                        new { role = "system", content = SystemPrompt },
                        new { role = "user", content = message }
                    },
                    max_completion_tokens = 500
                });
                using var req = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
                req.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ApiKey);
                req.Content = new StringContent(body, Encoding.UTF8, "application/json");
                using var res = await _http.SendAsync(req, cts.Token);
                if (res.IsSuccessStatusCode)
                {
                    using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync(cts.Token));
                    var content = doc.RootElement.GetProperty("choices")[0]
                        .GetProperty("message").GetProperty("content").GetString();
                    if (!string.IsNullOrWhiteSpace(content))
                        return new AiResult(false, new(), new(), content.Trim(), "ai");
                }
                else
                {
                    _logger.LogWarning("OpenAI call failed: {Status}", (int)res.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "OpenAI call failed, falling back to canned reply");
            }
        }

        // 3) Fallback — demo never breaks.
        return CannedReply(message);
    }

    public async Task<AiResult> SymptomAdviceAsync(IEnumerable<string> symptoms, string? notes)
    {
        var joined = $"Symptoms: {string.Join(", ", symptoms)}. {(string.IsNullOrWhiteSpace(notes) ? "" : "Details: " + notes)}";
        if (HasRedFlag(joined))
            return Emergency(joined);
        return await ChatAsync($"I have these symptoms: {string.Join(", ", symptoms)}. {(string.IsNullOrWhiteSpace(notes) ? "" : "Additional details: " + notes)} What could be the common causes and what should I do?");
    }

    private static readonly string[] Tips =
    {
        "Drink warm fluids and rest during the first days of your cycle.",
        "Keep your iron tablets with a source of vitamin C like citrus, for better absorption.",
        "A 10-minute walk after meals helps with pregnancy heartburn.",
        "Count your baby's kicks at the same time daily — 10 movements in 2 hours is reassuring.",
        "Sleep on your side with a pillow under the bump in later pregnancy.",
        "Track your mood alongside your cycle — patterns help your health worker help you.",
        "Keep emergency contacts updated in SathiCare before traveling.",
        "Boil or filter drinking water during pregnancy and monsoon months."
    };

    public static string DailyTip() => Tips[DateTime.UtcNow.DayOfYear % Tips.Length];
}
