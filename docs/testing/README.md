# SathiCare — Tester Documentation

Manual test guides for all three portals of SathiCare (Next.js + .NET 8 Web API + SQL Server).

## Portals

| Portal | Who uses it | Doc |
|---|---|---|
| Patient | Girls & women — period tracking, pregnancy, AI chat, bookings, SOS, community | [PATIENT-PORTAL.md](./PATIENT-PORTAL.md) |
| Doctor | Consulting doctors — requests, appointments, live chat, completing visits | [DOCTOR-PORTAL.md](./DOCTOR-PORTAL.md) |
| Admin | Platform team — users, doctors, reports, SOS alerts, demo reset | [ADMIN-PORTAL.md](./ADMIN-PORTAL.md) |

## Environment

- **Live (demo)**: `https://3100-<sandbox-id>.instabox.tech` — ask the owner for the current URL
- **Local**: `cd backend && dotnet run` (API on `:5000`) + `cd frontend && npm run dev` (web on `:3000/3100`)
- Backend API base: `/api` (proxied same-origin through the web app; direct on `:5000`)

## Test accounts (password for all: `demo1234`)

| Role | Email | Notes |
|---|---|---|
| Patient (cycle data) | `sita@demo.np` | 6 seeded cycles, appointments, contacts, posts |
| Patient (pregnant) | `gita@demo.np` | Active pregnancy ~week 20 |
| Doctor | `dr.anita@demo.np` | Has seeded appointments in all statuses |
| Doctor | `dr.sabina@demo.np` | 6 doctors exist: anita, sabina, binod, ritu, maya, puja |
| Admin | `admin@demo.np` | Full admin console |

## Ground rules for testers

1. **Reset between runs**: sign in as admin → Settings → **Reset demo data** (all accounts stay signed in; data returns to seed).
2. **Saathi AI is real (OpenAI)** — replies vary run to run; the safety phrases in the patient doc must ALWAYS escalate regardless of what the model would say.
3. **Demo mode**: SMS is logged, never sent; no real money or messages leave the system.
4. Report bugs with: portal, page URL, account used, steps, expected vs actual, screenshot.

## Known current limitations (do not file as bugs)

- No rate limiting on the API yet; dev JWT fallback secret is used in this demo environment (tracked as P0 for production).
- Box may sleep after ~30 idle minutes — if the URL is unreachable, ask the owner to wake it.
- SignalR uses long-polling through the sandbox proxy (slightly delayed message echo is normal, ≤5 s).
