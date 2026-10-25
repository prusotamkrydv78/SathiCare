import {
  HubConnection,
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
} from "@microsoft/signalr";

const HUB_URL =
  process.env.NEXT_PUBLIC_SIGNALR_URL ?? "/hubs/consultation";

const isAbsolute = /^https?:\/\//i.test(HUB_URL);

let cachedToken: { value: string; at: number } | null = null;

async function accessTokenFactory(): Promise<string> {
  // Same-origin hub: cookies flow with the request — no token needed.
  if (!isAbsolute) return "";
  if (cachedToken && Date.now() - cachedToken.at < 6 * 60 * 60 * 1000)
    return cachedToken.value;
  const res = await fetch("/api/auth/signalr-token", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Could not get a chat token");
  const payload = (await res.json()) as { data?: { token?: string } };
  const token = payload.data?.token ?? "";
  cachedToken = { value: token, at: Date.now() };
  return token;
}

/// Consultation chat connection. When the hub runs on the API origin
/// (NEXT_PUBLIC_SIGNALR_URL), we authenticate with a short-lived bearer token;
/// long polling survives every proxy between the browser and the sandbox.
export function createConsultationConnection(): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(HUB_URL, {
      transport: HttpTransportType.LongPolling,
      accessTokenFactory: isAbsolute ? accessTokenFactory : undefined,
    })
    .configureLogging(LogLevel.Warning)
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .build();
}
