# Patient Portal — Test Guide

Audience: girls and women using the mobile app (bottom tab bar: Home · Cycle · Saathi · Doctors · More).
Verify on a phone-sized viewport (~400 px wide) as well as desktop.

## 1. Landing & signup

| # | Steps | Expected |
|---|---|---|
| P1 | Open `/` | Editorial landing loads: serif headline, no gradients. Sign in / Create account in header |
| P2 | Click **Create account** → fill name/email/password (6+ chars) → submit | Account created, auto-signed-in, lands on dashboard with the empty state ("Start with one log") |
| P3 | Signup again with the same email | Error "Email already registered", no duplicate account |
| P4 | Short password (<6) | Blocked with a clear message |

## 2. Login & sessions

| # | Steps | Expected |
|---|---|---|
| P5 | Log out, log in as `sita@demo.np` | Lands on patient dashboard, greeting shows first name, cycle day 29+ with data |
| P6 | Wrong password | "Invalid email or password" (no hint about which field was wrong) |
| P7 | Keep the tab open 15+ min, then act | Silent token refresh; no forced logout |

## 3. Dashboard (Home tab)

| # | Steps | Expected |
|---|---|---|
| P8 | View as a brand-new user | Empty state card + 3 quick actions; no fake numbers anywhere |
| P9 | View as `sita@demo.np` | Dark cycle card with big day number, phase, "next period in ~N days"; next appointment row with Confirmed/Pending badge; recent notifications list |

## 4. Period tracker (Cycle tab)

| # | Steps | Expected |
|---|---|---|
| P10 | Press **Start period today** | Card flips to "Period in progress", calendar marks today, toast "Period started — take care" |
| P11 | Start again while one is active | Rejected with a clear message (no double cycles) |
| P12 | Pick symptoms + mood → **Save daily log** | Toast "Daily log saved", inputs clear |
| P13 | Press **End period** | Card returns to start state; history list shows the cycle with duration |
| P14 | Check history/predictions after reset seed | 6 seeded cycles, avg ~29.4 days, "regular", next period/ovulation/fertile window all dated |

## 5. Saathi AI (center button)

| # | Steps | Expected |
|---|---|---|
| P15 | Ask a normal question ("period pain relief") | Warm GPT reply ending with the disclaimer sentence; header shows "Powered by GPT" |
| P16 | Ask in Nepali | Reply in Nepali |
| P17 | **Safety phrases — each must show the red "Urgent — seek care now" card instantly with Call 102 / 1115 buttons**: "bleeding very heavily", "bleeding a lot since morning", "baby not moving since morning", "I feel faint and I'm bleeding", "I want to hurt myself", "पानी फुट्यो" | Instant red card (deterministic — must never depend on the AI) |
| P18 | Open a past chat from the sidebar | Full history loads; delete removes it |
| P19 | Kill API, send a message | Canned fallback reply or a graceful error — never a broken page |

## 6. Booking & consultation (Doctors tab)

| # | Steps | Expected |
|---|---|---|
| P20 | Doctors list | 6 doctors with real ratings/fees; search and specialty filters work |
| P21 | **Book** → pick date | Only that doctor's real free slots appear (already-booked slots missing) |
| P22 | Submit with a reason | Success screen "Request sent — the doctor will confirm" (NO countdown timer anywhere) |
| P23 | Book the same slot again (second account) | "That slot has just been taken" (409) |
| P24 | Book a past date | Rejected |
| P25 | After a doctor accepts (see doctor guide) | Chat button appears; both sides exchange messages live; messages persist after reload |
| P26 | Cancel a pending/accepted appointment | Status flips to cancelled; doctor is notified |

## 7. SOS (More → or dashboard quick action)

| # | Steps | Expected |
|---|---|---|
| P27 | Fresh account → SOS page | Button disabled, "Add at least one emergency contact"; 4 hotline cards (102/1115/100/1145) are always tappable |
| P28 | Add contact with a bad phone ("123") | "Enter a valid Nepal mobile number, e.g. +977 98…" |
| P29 | Add valid contact | Appears in list; SOS button turns active |
| P30 | Trigger SOS → confirm | Green success: each contact "notified ✓", demo-SMS note, hotline buttons |
| P31 | Trigger again immediately | 429 "SOS was just triggered" cooldown message |

## 8. Community, notifications, profile, find care (More tab)

| # | Steps | Expected |
|---|---|---|
| P32 | Share a post anonymously / named | Post appears instantly with the right author name ("Anonymous" when checked) |
| P33 | Like / unlike, comment | Counts update; comment shows with author + time |
| P34 | Report a post | Confirmation; post disappears from lists after an admin hides it |
| P35 | Notifications page | Unread highlighted; mark-one/mark-all works; **Clear all** actually clears (regression: this was broken in v1) |
| P36 | Profile: save name/phone/language + health details (age, blood group, height, weight, conditions, notes) | Toasts "Profile saved" / "Health details saved"; values persist after reload |
| P37 | Find care | Facilities sorted by distance from Janakpur; search/type filters; open a facility → reviews; post a 1–5 star review once (second attempt → "already reviewed") |
| P38 | Log out (More page bottom) | Returns to login (regression: logout was unreachable in the mobile shell — fixed) |
