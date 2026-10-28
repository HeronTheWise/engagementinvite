/**
 * Sahana & Akshath RSVP receiver.
 * Paste into Extensions > Apps Script opened FROM the private RSVP Google Sheet.
 * Deploy > New deployment > Web app; Execute as: Me; Access: Anyone.
 * The spreadsheet itself must NOT be shared publicly.
 */
const SHEET_NAME = 'RSVP Responses';
const HEADERS = ['Submitted At (IST)', 'Guest Name', 'Response', 'Guest Count', 'Message', 'Submission ID', 'Mobile Number', 'Last Updated (IST)'];

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
    const mobile = normalizeMobile_(p.mobile);
    // During migration, permit submissions from the previously deployed invitation,
    // which did not send a mobile number. New clients require a valid number.
    if (p.mobile && !mobile) return json_({ ok: false, error: 'Invalid mobile number' });
    if (!name || !['Joyfully accepts', 'Regretfully declines'].includes(answer) ||
        !Number.isInteger(count) || count < 1 || count > 20) {
      return json_({ ok: false, error: 'Invalid RSVP fields' });
    }
    lock.waitLock(10000);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Missing RSVP Responses tab');
    // Preserve the original six columns and extend the sheet non-destructively.
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');
    const normalizedName = normalizeName_(name);
    const lastRow = sheet.getLastRow();
    let existingRow = 0;
    let legacyMatch = 0;
    let legacyCount = 0;
    if (lastRow >= 2 && mobile) {
      // B:H = name, response, guests, note, id, mobile, last updated.
      const records = sheet.getRange(2, 2, lastRow - 1, 7).getValues();
      records.forEach((row, index) => {
        if (normalizeName_(row[0]) !== normalizedName) return;
        const rowMobile = normalizeMobile_(row[5]);
        if (rowMobile && rowMobile === mobile) existingRow = index + 2;
        if (!rowMobile) { legacyMatch = index + 2; legacyCount++; }
      });
    }
    // A single unambiguous older name-only record can be upgraded in place.
    if (!existingRow && legacyCount === 1) existingRow = legacyMatch;
    if (existingRow) {
      // Keep column A (first RSVP) and F (original submission ID) intact.
      sheet.getRange(existingRow, 2, 1, 4).setValues([[name, answer, count, message]]);
      sheet.getRange(existingRow, 7, 1, 2).setValues([[mobile, timestamp]]);
      return json_({ ok: true, action: 'updated' });
    }
    sheet.appendRow([timestamp, name, answer, count, message, Utilities.getUuid(), mobile, timestamp]);
    return json_({ ok: true, action: 'created' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'Could not record RSVP' });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function normalizeName_(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en');
}

function normalizeMobile_(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '';
  // Indian local, 0-prefixed, and +91 numbers resolve to one identity.
  if (digits.length === 10) digits = '91' + digits;
  if (digits.length === 11 && digits.startsWith('0')) digits = '91' + digits.slice(1);
  if (digits.length < 11 || digits.length > 15) return '';
  return '+' + digits;
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
