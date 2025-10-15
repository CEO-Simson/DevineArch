# Core Data Model (High-Level)

- Organization (Tenant)
  - id, name, slug, contact, branding
  - campuses [Campus]

- User & Auth
  - User: id, name, email, password_hash, 2fa, status
  - Membership: user_id, org_id, role (Owner/Admin/Staff/Volunteer/Member), campus_id?
  - Session: refresh tokens, device info

- People & Groups
  - Household: id, name, address, primary_contact
  - Person: id, household_id, demographics, contact, custom_fields (jsonb), tags
  - Group: id, org_id, name, type, members
  - Attendance: id, person_id, group_id|event_id, occurred_at, notes

- Giving
  - Fund: id, name, restricted, active
  - Pledge: id, person_id, fund_id, amount, frequency, start/end
  - Donation: id, person_id, fund_id, method (cash/check/card/ach), amount, txn_ref
  - Batch: id, date, entered_by; Deposit: id, bank_ref; Statement: id, year, delivered_at

- Events & Registrations
  - Event: id, org_id, campus_id, starts_at, ends_at, capacity, visibility
  - Registration: id, event_id, person_id, status, payment_id?

- Check‑In
  - CheckinSession: id, event_id, opened_by, status
  - Station: id, session_id, mode (kiosk/self/admin), device_info
  - Checkin: id, person_id (child), guardian_id, labels, code, medical_notes

- Worship
  - Song: id, title, ccli_number, keys, arrangements
  - Plan: id, event_id, items; VolunteerAssignment

- Accounting
  - Account: id, type, parent_id
  - LedgerEntry: id, date, account_id, amount, memo, batch/deposit link
  - Budget: id, account_id, period, amount

- Communications
  - Template: id, type (email/sms), subject, body
  - Campaign: id, segment (smart list), scheduled_at
  - Delivery: id, campaign_id, channel, status, provider_ids

- Admin/Platform
  - ImportJob, ExportJob, AuditLog, Webhook, Integration (Stripe, Twilio)

Notes
- All tenant tables include `tenant_id` and RLS policies
- Prefer jsonb for flexible custom fields and label templates
- Strict foreign keys + cascade rules; soft deletes where useful
