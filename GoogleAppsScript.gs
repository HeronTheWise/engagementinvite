/**
 * Sahana & Akshath RSVP receiver.
 * Paste into Extensions > Apps Script opened FROM the private RSVP Google Sheet.
 * Deploy > New deployment > Web app; Execute as: Me; Access: Anyone.
 * The spreadsheet itself must NOT be shared publicly.
 */
const SHEET_NAME = 'RSVP Responses';
const HEADERS = ['Submitted At (IST)', 'Guest Name', 'Response', 'Guest Count', 'Message', 'Submission ID'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const p = (e && e.parameter) || {};
    // Honeypot: silently reject bots. Never write arbitrary columns/formulas.
    if (p.website) return json_({ ok: true });
    const name = clean_(p.name, 90);
    const answer = clean_(p.response, 40);
    const message = clean_(p.note, 220);
    const count = Number(p.guests);
    if (!name || !['Joyfully accepts', 'Regretfully declines'].includes(answer) ||
        !Number.isInteger(count) || count < 1 || count > 20) {
      return json_({ ok: false, error: 'Invalid RSVP fields' });
    }
    lock.waitLock(10000);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Missing RSVP Responses tab');
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([
      Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss'),
      name, answer, count, message, Utilities.getUuid()
    ]);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'Could not record RSVP' });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function clean_(value, maxLength) {
  let s = String(value || '').trim().slice(0, maxLength);
  // Prevent spreadsheet formula injection when exported to Excel.
  if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
  return s;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
