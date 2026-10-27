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

## Excel export

Open the Sheet → **File → Download → Microsoft Excel (.xlsx)**. This exports the latest rows any time, without exposing the Sheet to guests.

## Privacy

The RSVP form collects a name, attendance decision, guest count and optional message. Limit Sheet access to event organizers, and delete personal responses when no longer needed. No analytics or tracking scripts are included.
