# Admin Portal — Test Guide

Audience: platform team. Console at `/admin`. Sign in as `admin@demo.np` (violet sidebar).

## 1. Access & RBAC

| # | Steps | Expected |
|---|---|---|
| A1 | Log in as admin | Auto-redirects to `/admin` overview |
| A2 | Patient/doctor opens `/admin` | Redirected away; server rejects their tokens on all `/api/admin/*` with 403 |
| A3 | Anonymous `GET /api/admin/stats` | 401 |

## 2. Overview

| # | Steps | Expected |
|---|---|---|
| A4 | Open overview | Cards: patients, doctors, posts, SOS (7 d); attention panel (pending appointments / open reports / unresolved SOS); recent activity feed |
| A5 | Trigger patient actions (book, post, SOS), refresh | Numbers and activity feed update accordingly |

## 3. Users

| # | Steps | Expected |
|---|---|---|
| A6 | Open **Users** | All 9 seeded + any signed-up users with role badges (patient/doctor/admin) |
| A7 | Search by name/email | List filters live |
| A8 | Disable a patient account | Button flips to "Disabled"; that user's API calls now fail with "account deactivated" |
| A9 | Try to disable an admin | Button disabled — admins cannot lock themselves out |
| A10 | Re-enable the account | User can log in again |

## 4. Doctors

| # | Steps | Expected |
|---|---|---|
| A11 | Open **Doctors** | 6 doctors with rating, fee, availability toggle |
| A12 | **Add doctor** (name/email/specialization/years/fee) | Created; message shows the new login (`email / demo1234`); appears in patient booking list immediately; can sign in and land on `/doctor` |
| A13 | Add with an existing email | "That email is already in use" |
| A14 | Toggle a doctor off duty | Patients no longer see them in booking |

## 5. Reports (forum moderation)

| # | Steps | Expected |
|---|---|---|
| A15 | Have a patient report a post (patient guide P34), open **Reports** | Report listed with post excerpt and reason |
| A16 | Press **Hide post** | Report leaves the queue AND the post disappears from the community feed |
| A17 | On another report press **Dismiss** | Leaves the queue; post stays visible |

## 6. SOS alerts

| # | Steps | Expected |
|---|---|---|
| A18 | Trigger a patient SOS, open **SOS alerts** | Alert listed with user, time, location + map link (OpenStreetMap) |
| A19 | Press **Resolve** | Badge flips to resolved |

## 7. Settings & demo reset

| # | Steps | Expected |
|---|---|---|
| A20 | Open **Settings** | Demo accounts table with roles and shared password |
| A21 | Press **Reset demo data** → confirm | Everything returns to seed (users 9, doctors 6, 3 appointments, 8 posts). **Signed-in demo accounts stay signed in** (stable IDs) — verify you are still logged in after reset |
| A22 | Records created during your test run (new posts/bookings) | Gone after reset — this is expected |

## 8. Environment & ops notes for testers

- The demo runs on a sandbox that sleeps after ~30 idle minutes; if unreachable, ask the owner to wake it.
- Known P0 for production (tracked, not bugs for this demo): no API rate limiting, dev JWT secret in this environment, Development-mode error detail.
