/**
 * @OnlyCurrentDoc
 *
 * Kaushal Hub website forms → Google Sheet + emails.
 *
 * Receives the Contact and Join the Community forms from kaushalhub.in, then:
 *   1. saves each submission as a row ("Contact" and "Community" tabs, with a Status column),
 *   2. emails the person a confirmation of what they asked (BCC to the sales address, if set),
 *   3. emails the team that a new submission needs attention.
 *
 * All email addresses and switches live in the "Settings" tab of this spreadsheet, so they can
 * be changed there without touching this code.
 *
 * Access: the @OnlyCurrentDoc line above (and appsscript.json) limit this script to THIS
 * spreadsheet only. It cannot open, list or change any other file in the Google account.
 *
 * Setup: see google-apps-script/SETUP.md in the website project.
 */

const TIME_ZONE = "Asia/Kolkata";
/** The same person sending the same form again within this many seconds is ignored (double clicks). */
const DUPLICATE_WINDOW_SECONDS = 60;
const MAX_LENGTH = 5000;
const SETTINGS_SHEET = "Settings";

/** Editable settings: [key, default value, explanation]. Created in the Settings tab by `setup`. */
const SETTINGS = [
  ["Team notification email", "hello@kaushalhub.in", "Who is told about each new submission. Separate several addresses with commas."],
  ["Sales BCC email", "", "Gets a blind copy of every confirmation sent to the person (e.g. the sales person). Commas for several. Leave empty for none."],
  ["Reply-to email", "hello@kaushalhub.in", "Where replies to the confirmation email go."],
  ["Sender name", "Kaushal Hub", "The name people see the emails coming from."],
  ["Send confirmation to the person", "Yes", "Yes or No."],
  ["Send team notification", "Yes", "Yes or No."],
  ["Send emails through", "Google", "Google (works straight away) or Zoho (best inbox delivery; needs the Zoho steps in SETUP.md first)."],
  ["Zoho data centre", "in", "Only for Zoho: in (zoho.in), com, eu, com.au …"],
];

/** One tab per form: the columns in order, and which fields must be filled in. */
const FORMS = {
  contact: {
    sheet: "Contact",
    label: "enquiry",
    columns: [
      ["submittedAt", "Submitted at (IST)"],
      ["status", "Status"],
      ["name", "Full name"],
      ["email", "Email"],
      ["organisation", "Organisation"],
      ["enquiryType", "Enquiry type"],
      ["message", "Message"],
      ["page", "Sent from page"],
    ],
    required: ["name", "email", "enquiryType", "message"],
    teamSubject: (p) => `New enquiry needs attention: ${p.enquiryType} – ${p.name}`,
    personSubject: (p) => `We've received your enquiry – ${p.enquiryType}`,
    personIntro: (p) =>
      `Thank you for contacting Kaushal Hub. We've received your enquiry about <b>${esc(p.enquiryType)}</b>, and a member of our team will get back to you at this email address soon.`,
    personSummary: [
      ["enquiryType", "Enquiry type"],
      ["organisation", "Organisation"],
      ["message", "Your message"],
    ],
  },
  community: {
    sheet: "Community",
    label: "community sign-up",
    columns: [
      ["submittedAt", "Submitted at (IST)"],
      ["status", "Status"],
      ["name", "Full name"],
      ["email", "Email"],
      ["interest", "Primary area of interest"],
      ["background", "Role or background"],
      ["organisation", "Organisation"],
      ["linkedin", "LinkedIn"],
      ["contributionOrGain", "Wants to contribute or gain"],
      ["consent", "Consented to updates"],
      ["page", "Sent from page"],
    ],
    required: ["name", "email", "interest", "consent"],
    teamSubject: (p) => `New community member: ${p.name} (${p.interest})`,
    personSubject: () => "Welcome to the Kaushal Hub community",
    personIntro: (p) =>
      `Thank you for joining the Kaushal Hub community. We've noted your interest in <b>${esc(p.interest)}</b>, and our team will be in touch about community activities, resources and opportunities that match it.`,
    personSummary: [
      ["interest", "Area of interest"],
      ["background", "Role or background"],
      ["organisation", "Organisation"],
      ["contributionOrGain", "What you'd like to contribute or gain"],
    ],
  },
};

/* ------------------------------------------------------------------ setup & web app */

/** Run once from the editor: creates the tabs and asks for the needed permissions. */
function setup() {
  Object.keys(FORMS).forEach((kind) => sheetFor(kind));
  settingsSheet();
  MailApp.getRemainingDailyQuota();
  console.log("Setup complete. Settings:", JSON.stringify(readSettings()));
}

/** Opening the web app URL in a browser shows this, which confirms the deployment is live. */
function doGet() {
  return json({ ok: true, service: "Kaushal Hub forms" });
}

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};
    const kind = String(params.formType || "");
    const form = FORMS[kind];
    if (!form) return json({ ok: false, error: "Unknown form." });

    // Bots fill in the hidden field; accept quietly so they get no signal to retry.
    if (params.company_website) return json({ ok: true });

    const p = clean(params);
    const missing = form.required.filter((field) => !p[field]);
    if (missing.length) return json({ ok: false, error: `Missing: ${missing.join(", ")}` });
    if (!isEmail(p.email)) return json({ ok: false, error: "Invalid email address." });
    if (p.linkedin && !/^https?:\/\//i.test(p.linkedin)) return json({ ok: false, error: "Invalid LinkedIn URL." });

    const cache = CacheService.getScriptCache();
    const duplicateKey = `${kind}:${p.email.toLowerCase()}:${(p.message || p.interest || "").slice(0, 60)}`;
    if (cache.get(duplicateKey)) return json({ ok: true });

    p.submittedAt = Utilities.formatDate(new Date(), TIME_ZONE, "yyyy-MM-dd HH:mm:ss");
    p.status = "New";
    if (kind === "community") p.consent = p.consent ? "Yes" : "No";

    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      sheetFor(kind).appendRow(form.columns.map(([field]) => safeCell(p[field] || "")));
    } finally {
      lock.releaseLock();
    }
    cache.put(duplicateKey, "1", DUPLICATE_WINDOW_SECONDS);

    // The row is saved; emails are best effort and never fail the submission.
    sendEmails(form, p);
    return json({ ok: true });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: "Could not save the submission." });
  }
}

/* ------------------------------------------------------------------ emails */

function sendEmails(form, p) {
  let settings;
  try {
    settings = readSettings();
  } catch (error) {
    console.error("Could not read Settings:", error);
    return;
  }
  const fromName = settings["Sender name"] || "Kaushal Hub";

  if (yes(settings["Send confirmation to the person"])) {
    attempt("confirmation", () =>
      sendMail(settings, {
        to: p.email,
        bcc: emailList(settings["Sales BCC email"]),
        replyTo: firstEmail(settings["Reply-to email"]),
        name: fromName,
        subject: form.personSubject(p),
        html: personEmailHtml(form, p),
        text: personEmailText(form, p),
      }),
    );
  }

  const team = emailList(settings["Team notification email"]);
  if (yes(settings["Send team notification"]) && team) {
    attempt("team notification", () =>
      sendMail(settings, {
        to: team,
        replyTo: p.email, // "Reply" answers the person directly
        name: `${fromName} Website`,
        subject: form.teamSubject(p),
        html: teamEmailHtml(form, p),
        text: teamEmailText(form, p),
      }),
    );
  }
}

function attempt(what, send) {
  try {
    send();
  } catch (error) {
    console.error(`Sending the ${what} email failed:`, error);
  }
}

/** Sends through Google (MailApp, as this account) or Zoho Mail, per the Settings tab. */
function sendMail(settings, mail) {
  if (String(settings["Send emails through"]).trim().toLowerCase() === "zoho") return sendViaZoho(settings, mail);
  const options = { to: mail.to, subject: mail.subject, body: mail.text, htmlBody: mail.html, name: mail.name };
  if (mail.bcc) options.bcc = mail.bcc;
  if (mail.replyTo) options.replyTo = mail.replyTo;
  MailApp.sendEmail(options);
}

function personEmailHtml(form, p) {
  const rows = form.personSummary
    .filter(([field]) => p[field])
    .map(([field, label]) => summaryRow(label, p[field]))
    .join("");
  return frame(`
    <p style="margin:0 0 16px">Hi ${esc(p.name)},</p>
    <p style="margin:0 0 20px">${form.personIntro(p)}</p>
    ${rows ? `<p style="margin:0 0 8px;font-weight:600;color:#0F2747">What you shared with us</p><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 20px">${rows}</table>` : ""}
    <p style="margin:0 0 4px">If you have anything to add, simply reply to this email.</p>
    <p style="margin:20px 0 0">Warm regards,<br><b>Team Kaushal Hub</b></p>
  `);
}

function personEmailText(form, p) {
  const intro = form.personIntro(p).replace(/<[^>]+>/g, "");
  const rows = form.personSummary.filter(([field]) => p[field]).map(([field, label]) => `${label}: ${p[field]}`);
  return [`Hi ${p.name},`, "", intro, "", ...(rows.length ? ["What you shared with us:", ...rows, ""] : []),
    "If you have anything to add, simply reply to this email.", "", "Warm regards,", "Team Kaushal Hub", "",
    "Kaushal Hub · C-26, C Block, Sector 59, Noida 201309 · +91-9318497057 · kaushalhub.in"].join("\n");
}

function teamEmailHtml(form, p) {
  const rows = form.columns
    .filter(([field]) => p[field] && field !== "status")
    .map(([field, label]) => summaryRow(label, p[field]))
    .join("");
  return frame(`
    <p style="margin:0 0 6px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#C2410C;font-weight:700">Needs attention</p>
    <p style="margin:0 0 20px">A new ${form.label} has come in through the website. Reply to this email to answer ${esc(p.name)} directly, then update its Status in the sheet.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 20px">${rows}</table>
    <p style="margin:0"><a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}" style="color:#0F2747;font-weight:600">Open all submissions →</a></p>
  `);
}

function teamEmailText(form, p) {
  const rows = form.columns.filter(([field]) => p[field] && field !== "status").map(([field, label]) => `${label}: ${p[field]}`);
  return [`A new ${form.label} has come in through the website and needs attention.`, "", ...rows, "",
    `All submissions: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`].join("\n");
}

function summaryRow(label, value) {
  return `<tr><td style="padding:10px 12px;border:1px solid #E5E7EB;background:#F7F8FB;width:38%;vertical-align:top;font-size:13px;color:#475569">${esc(label)}</td><td style="padding:10px 12px;border:1px solid #E5E7EB;vertical-align:top;white-space:pre-wrap">${esc(value)}</td></tr>`;
}

/** Brand frame shared by every email: navy header, white body, footer with contact details. */
function frame(inner) {
  return `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#F4F1EA;font-family:Arial,Helvetica,sans-serif;color:#1F2937;font-size:15px;line-height:1.6">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EA;padding:24px 12px"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:14px;overflow:hidden">
      <tr><td style="background:#0F2747;padding:22px 28px;color:#FFFFFF;font-size:20px;font-weight:700">Kaushal Hub<div style="height:3px;width:40px;background:#E8913A;margin-top:10px;border-radius:2px"></div></td></tr>
      <tr><td style="padding:28px">${inner}</td></tr>
      <tr><td style="padding:18px 28px;background:#F7F8FB;font-size:12px;color:#64748B;line-height:1.6">Kaushal Hub, an initiative of SNN Eduworld Pvt. Ltd.<br>C-26, C Block, Sector 59, Noida, Uttar Pradesh 201309 · +91-9318497057<br><a href="https://kaushalhub.in" style="color:#0F2747">kaushalhub.in</a></td></tr>
    </table>
  </td></tr></table></body></html>`;
}

/* ------------------------------------------------------------------ Zoho Mail (optional) */

/**
 * Sends through the Zoho Mail API as the real hello@kaushalhub.in mailbox, so emails pass the
 * domain's SPF/DKIM checks and reach inboxes. Needs the Zoho steps in SETUP.md: the client ID,
 * client secret and refresh token are kept in Script Properties, never in the sheet.
 */
function sendViaZoho(settings, mail) {
  const dc = String(settings["Zoho data centre"] || "in").trim();
  const accountId = prop("ZOHO_ACCOUNT_ID") || zohoAccountId(dc);
  const fromAddress = prop("ZOHO_FROM_ADDRESS");
  // Zoho shows the mailbox's own display name; replies go to the mailbox, and team emails list
  // the person's address in the body.
  const body = {
    fromAddress,
    toAddress: mail.to,
    subject: mail.subject,
    content: mail.html,
    mailFormat: "html",
  };
  if (mail.bcc) body.bccAddress = mail.bcc;
  const response = UrlFetchApp.fetch(`https://mail.zoho.${dc}/api/accounts/${accountId}/messages`, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: `Zoho-oauthtoken ${zohoAccessToken(dc)}` },
    payload: JSON.stringify(body),
    muteHttpExceptions: true,
  });
  if (response.getResponseCode() >= 300) throw new Error(`Zoho ${response.getResponseCode()}: ${response.getContentText()}`);
}

function zohoAccessToken(dc) {
  const cache = CacheService.getScriptCache();
  const cached = cache.get("zoho_access_token");
  if (cached) return cached;
  const response = UrlFetchApp.fetch(`https://accounts.zoho.${dc}/oauth/v2/token`, {
    method: "post",
    payload: {
      refresh_token: prop("ZOHO_REFRESH_TOKEN"),
      client_id: prop("ZOHO_CLIENT_ID"),
      client_secret: prop("ZOHO_CLIENT_SECRET"),
      grant_type: "refresh_token",
    },
    muteHttpExceptions: true,
  });
  const data = JSON.parse(response.getContentText());
  if (!data.access_token) throw new Error(`Zoho token error: ${response.getContentText()}${zohoHint(response.getContentText(), dc)}`);
  cache.put("zoho_access_token", data.access_token, 50 * 60);
  return data.access_token;
}

function zohoAccountId(dc) {
  const response = UrlFetchApp.fetch(`https://mail.zoho.${dc}/api/accounts`, {
    headers: { Authorization: `Zoho-oauthtoken ${zohoAccessToken(dc)}` },
    muteHttpExceptions: true,
  });
  const data = JSON.parse(response.getContentText());
  const account = data.data && data.data[0];
  if (!account) throw new Error(`Zoho accounts error: ${response.getContentText()}`);
  const props = PropertiesService.getScriptProperties();
  props.setProperty("ZOHO_ACCOUNT_ID", String(account.accountId));
  if (!props.getProperty("ZOHO_FROM_ADDRESS")) props.setProperty("ZOHO_FROM_ADDRESS", account.primaryEmailAddress || account.mailboxAddress);
  return account.accountId;
}

/**
 * Zoho step: paste the one-time "grant code" from the Zoho API console into ZOHO_GRANT_CODE in
 * Script Properties (with ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET), then run this once.
 */
function zohoConnect() {
  const props = PropertiesService.getScriptProperties();
  const dc = String(readSettings()["Zoho data centre"] || "in").trim();
  ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_GRANT_CODE"].forEach((name) => {
    if (!prop(name)) throw new Error(`Script Property ${name} is missing (Project Settings → Script Properties).`);
  });
  const response = UrlFetchApp.fetch(`https://accounts.zoho.${dc}/oauth/v2/token`, {
    method: "post",
    payload: {
      code: prop("ZOHO_GRANT_CODE"),
      client_id: prop("ZOHO_CLIENT_ID"),
      client_secret: prop("ZOHO_CLIENT_SECRET"),
      grant_type: "authorization_code",
    },
    muteHttpExceptions: true,
  });
  const data = JSON.parse(response.getContentText());
  if (!data.refresh_token) throw new Error(`Zoho did not return a refresh token: ${response.getContentText()}${zohoHint(response.getContentText(), dc)}`);
  props.setProperty("ZOHO_REFRESH_TOKEN", data.refresh_token);
  props.deleteProperty("ZOHO_GRANT_CODE");
  CacheService.getScriptCache().put("zoho_access_token", data.access_token, 50 * 60);
  zohoAccountId(dc);
  console.log(`Connected to Zoho. Emails will be sent as ${props.getProperty("ZOHO_FROM_ADDRESS")}.`);
}

/** Sends one test confirmation and one team notification to the team address, using the current settings. */
function sendTestEmails() {
  const settings = readSettings();
  const to = firstEmail(settings["Team notification email"]);
  if (!to) throw new Error("Set 'Team notification email' in the Settings tab first.");
  const p = { name: "Test Person", email: to, enquiryType: "General enquiry", organisation: "Test", message: "This is a test enquiry.", page: "/contact", submittedAt: "now" };
  sendEmails(FORMS.contact, p);
  console.log(`Test emails sent through ${settings["Send emails through"]} to ${to}.`);
}

/* ------------------------------------------------------------------ helpers */

/** A Script Property with stray spaces or line breaks (common when pasting) removed. */
function prop(name) {
  return String(PropertiesService.getScriptProperties().getProperty(name) || "").trim();
}

/** Turns Zoho's terse OAuth errors into a next step. */
function zohoHint(text, dc) {
  if (/invalid_client/.test(text))
    return ` → Zoho does not recognise ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET at accounts.zoho.${dc}. Check both were copied in full from https://api-console.zoho.${dc} (the console must be on the same .${dc} domain as the "Zoho data centre" setting), then create a new code.`;
  if (/invalid_code/.test(text))
    return " → The code has expired or was already used. Generate a new one (Generate Code tab), paste it into ZOHO_GRANT_CODE and run zohoConnect within 10 minutes.";
  return "";
}

/** The form's tab, created with a bold, frozen header row if it doesn't exist yet. */
function sheetFor(kind) {
  const form = FORMS[kind];
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(form.sheet);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(form.sheet);
    const headers = form.columns.map(([, label]) => label);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function settingsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SETTINGS_SHEET);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SETTINGS_SHEET);
    sheet.getRange(1, 1, 1, 3).setValues([["Setting", "Value (edit this column)", "What it does"]]).setFontWeight("bold");
    sheet.getRange(2, 1, SETTINGS.length, 3).setValues(SETTINGS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Settings tab as { key: value }, falling back to the defaults for anything missing. */
function readSettings() {
  const settings = {};
  SETTINGS.forEach(([key, value]) => (settings[key] = value));
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS_SHEET);
  if (sheet && sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues().forEach(([key, value]) => {
      if (key) settings[String(key).trim()] = String(value).trim();
    });
  }
  return settings;
}

/** "a@x.com, b@y.com" → the valid addresses joined with commas, or "" if none. */
function emailList(value) {
  return String(value || "").split(/[,;\s]+/).filter(isEmail).join(",");
}

function firstEmail(value) {
  return emailList(value).split(",")[0] || "";
}

function isEmail(value) {
  return /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(String(value || ""));
}

function yes(value) {
  return /^(yes|y|true|on|1)$/i.test(String(value || "").trim());
}

/** Trimmed, length-limited copies of the submitted fields. */
function clean(params) {
  const out = {};
  Object.keys(params).forEach((key) => {
    out[key] = String(params[key]).trim().slice(0, MAX_LENGTH);
  });
  return out;
}

/** Stops a value like "=HYPERLINK(...)" from being run as a spreadsheet formula. */
function safeCell(value) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
