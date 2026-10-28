# Sahana & Akshath — Official Engagement Invitation

An animated, responsive digital invitation for **Friday, 27 November 2026, 10 AM onwards**, at **Asthitva Teak Meadows, Bengaluru**.

## Public invitation

GitHub Pages URL after activation: <https://heronthewise.github.io/engagementinvite/>

This is a static website. It has an animated envelope, a countdown, family blessings, Google Maps driving directions, add-to-calendar, WhatsApp-friendly share link, and an RSVP form.

## Enable GitHub Pages

1. GitHub repository → **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`, click **Save**.
4. Allow the Pages build to finish and open the public URL above.

The repository must be public on the free GitHub plan. `.nojekyll` is included.

## Activate private Google Sheets RSVP collection

1. Open the private Google Sheet **Sahana & Akshath — Engagement RSVPs** (provided separately). Confirm there is a tab named **RSVP Responses** with headers as in `GoogleAppsScript.gs`.
2. From that spreadsheet select **Extensions → Apps Script**. Replace the sample code with the complete contents of [`GoogleAppsScript.gs`](GoogleAppsScript.gs); save.
3. Select **Deploy → New deployment → Web app**. Choose **Execute as: Me** and **Who has access: Anyone**. Authorize the script using the Google account that owns the Sheet.
4. Copy the deployed web app URL ending `/exec`.
5. In `index.html` find `const RSVP_ENDPOINT=''` and insert that `/exec` URL between the quotes. Commit to `main` (GitHub Pages republishes).
6. Submit a **test** RSVP through the live invitation. Verify a new row in the private Sheet before sending invitations. Delete the test row in the Sheet after checking.

Do not publish or share the Google Sheet itself. Only the Apps Script **web app** is public. The endpoint validates name, attendance response and party size, and ignores a honeypot field. A publicly accessible form can still attract spam, so review sheet entries periodically.

**Important:** A static page using `no-cors` cannot inspect the response from Apps Script. The UI reports that a request was sent, but this is not cryptographic acknowledgement of storage; confirm delivery in the Sheet. The form intentionally displays a setup message until a real web-app URL is configured.

## Upgrade: prevent duplicate RSVPs (mobile number + name)

The latest `GoogleAppsScript.gs` performs an **upsert**: it finds an existing row by normalized guest name and mobile number, and updates attendance, guest count, optional message and `Last Updated (IST)` in that same row. It preserves the original submitted date and submission ID. Phone numbers entered as `9876543210`, `09876543210`, or `+91 98765 43210` are treated as the same Indian number. Distinct names sharing one phone remain separate guests.

To activate this upgrade on an existing deployment:

1. Open your **private Google Sheet → Extensions → Apps Script**.
2. Replace the entire `Code.gs` content with the latest [`GoogleAppsScript.gs`](GoogleAppsScript.gs) and **Save**.
3. Select **Deploy → Manage deployments**. Open the current web app deployment, click **Edit** (pencil), select **New version**, then click **Deploy**. Keep **Execute as: Me** and **Who has access: Anyone**. The `/exec` URL should remain unchanged for the edited deployment.
4. Submit a clearly labeled test with a name and mobile, then repeat it with the same identity and a changed guest count. Check that the same row updates rather than creating another.

The script expands the existing table to eight columns without deleting the first six: **G: Mobile Number** and **H: Last Updated (IST)**. Older rows without a mobile number can be claimed by a matching name only when there is exactly one unambiguous legacy match. Ambiguous older duplicates need manual review.

**Status (28 October 2026):** The mobile-number form is live, the backend version `2.0-DUPLICATE-PROTECTION` responded successfully, and the create/update test returned `created` then `updated`. Guests now need to provide a mobile number. Never share this spreadsheet publicly, as mobile numbers are personal data. After confirming the test row, remove the clearly labeled test record from the Sheet.

## Excel export

Open the Sheet → **File → Download → Microsoft Excel (.xlsx)**. This exports the latest rows any time, without exposing the Sheet to guests.

## Privacy

The RSVP form collects a name, attendance decision, guest count and optional message. Limit Sheet access to event organizers, and delete personal responses when no longer needed. No analytics or tracking scripts are included.
