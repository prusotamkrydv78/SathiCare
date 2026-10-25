# Doctor Portal — Test Guide

Audience: consulting doctors. Teal console at `/doctor`. Sign in with any `dr.*@demo.np` account.

## 1. Access & routing

| # | Steps | Expected |
|---|---|---|
| D1 | Log in as `dr.anita@demo.np` | Auto-redirects to `/doctor` (not the patient dashboard) |
| D2 | Log in as a patient, then open `/doctor` directly | Redirected away — patients can never see the portal |
| D3 | Call `GET /api/appointments/doctor/mine` with a patient token | 403 "requires role doctor" (server-side, not just UI) |

## 2. Requests (accept / decline)

| # | Steps | Expected |
|---|---|---|
| D4 | Have a patient book you (see patient guide P22), open **Requests** | The request appears with patient name, date/time, reason |
| D5 | Press **Accept** | Card leaves the list; patient gets a "confirmed" notification; chat becomes available to both |
| D6 | On another request press **Decline** | Leaves the list; patient notified with the decline reason |
| D7 | Try to accept a request addressed to another doctor (via API `PUT /appointments/{id}/accept`) | 404 — doctors can only act on their own appointments |

## 3. Appointments & completing a consultation

| # | Steps | Expected |
|---|---|---|
| D8 | Open **Appointments** | All your appointments, newest first; status tabs (pending/accepted/completed/…) with counts; search by patient name works |
| D9 | Accepted appointment → **Complete** modal | Notes are required; prescription optional (2000-char limits shown) |
| D10 | Submit notes + prescription | Status → completed; notes/Rx visible to the patient in their appointment list; patient notified; consultation counter increments |
| D11 | Reopen a completed appointment → **Edit notes** | Notes updatable; status stays completed |

## 4. Live consultation chat

| # | Steps | Expected |
|---|---|---|
| D12 | Open chat for an accepted appointment | Connects (green "Connected"); patient name in the header; **End** button is doctor-only |
| D13 | Exchange messages with the patient (two windows) | Both sides see messages live (long-polling: ≤5 s is acceptable); the other side's name labels incoming bubbles |
| D14 | Reload mid-chat | Full history reloads from the server; connection re-establishes |
| D15 | **End** the consultation | Both sides see "consultation ended"; input disabled |
| D16 | Open chat for a pending (not yet accepted) appointment | Refused — chat opens only after acceptance |

## 5. Profile

| # | Steps | Expected |
|---|---|---|
| D17 | Open **Profile** | Your card: specialization, experience, fee, rating & consultation count, weekly availability grid |
| D18 | Verify availability matches what patients see when booking | Same slots in both places (single source of truth) |

## 6. Cross-portal negative tests

| # | Steps | Expected |
|---|---|---|
| D19 | Doctor token → `GET /api/admin/stats` | 403 |
| D20 | Doctor tries `POST /api/appointments/{other-doctor-id}` actions | Only own appointments are visible/mutable |
