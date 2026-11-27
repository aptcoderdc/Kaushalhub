# Kaushal Hub website forms: Google Sheet setup

What it does for every Contact enquiry or Join the Community sign-up:

1. Saves a row in the **Contact** or **Community** tab. A **Status** column starts at "New" for the team to update.
2. Emails the **person** a confirmation of what they asked, from hello@kaushalhub.in. The **Sales BCC** address gets a blind copy.
3. Emails the **team** that a new submission needs attention. Pressing Reply answers the person directly.

The email addresses and on/off switches are in the **Settings** tab, so you change them there, not in the code.

**Access:** the script can only use **this one spreadsheet**. It cannot see or change any other file in the Google account. It can also send email, and it can contact Zoho, which is only used if you switch sending to Zoho.

## 1. Create the Sheet
1. Sign in to **sheets.google.com** as **hello@kaushalhub.in**.
2. Create a blank spreadsheet named `Kaushal Hub – Website Forms`.
3. Go to **File → Settings**, set **Time zone** to **(GMT+05:30) India Standard Time**, and save.

## 2. Add the script
1. In the Sheet, go to **Extensions → Apps Script**.
2. Click ⚙️ **Project Settings** and tick **Show "appsscript.json" manifest file in editor**.
3. Back in the **Editor**:
   - Open `appsscript.json` and replace everything in it with the contents of `google-apps-script/appsscript.json`. This is the file that limits the script to this spreadsheet.
   - Open `Code.gs` and replace everything in it with the contents of `google-apps-script/kaushal-hub-forms.gs`.
   - Save with ⌘S.

## 3. Run setup once
1. In the function dropdown, choose **`setup`** and click **Run**.
2. Click **Review permissions** and choose hello@kaushalhub.in.
3. You'll see **"Google hasn't verified this app"**. That's normal for your own script. Click **Advanced → Go to … (unsafe)**.
4. The permission list should be exactly these three. Click **Allow**.
   - *See, edit, create and delete only the specific Google Sheets that you use this app with*
   - *Send email as you*
   - *Connect to an external service*
5. Three tabs appear: **Contact**, **Community** and **Settings**. You can delete "Sheet1".

## 4. Fill in Settings
Edit column B of the **Settings** tab at any time. Changes apply to the next submission, with no redeploy.

| Setting | Example | Notes |
|---|---|---|
| Team notification email | `hello@kaushalhub.in` | Separate several addresses with commas |
| Sales BCC email | `sales@…` | Gets a blind copy of every confirmation; leave empty for none |
| Reply-to email | `hello@kaushalhub.in` | Where the person's replies go |
| Sender name | `Kaushal Hub` | |
| Send confirmation to the person | `Yes` | `No` turns it off |
| Send team notification | `Yes` | `No` turns it off |
| Send emails through | `Google` | `Google` or `Zoho` (see step 7) |
| Zoho data centre | `in` | Only used for Zoho |

To check the emails, choose **`sendTestEmails`** in the function dropdown and click **Run**. It sends a sample confirmation and a sample team email to the team address.

## 5. Deploy the web app
1. Go to **Deploy → New deployment**. Click ⚙️ next to "Select type" and choose **Web app**.
2. Set **Execute as** to **Me** and **Who has access** to **Anyone**, then click **Deploy**.
3. Copy the **Web app URL**, which ends in `/exec`, and send it to your developer. It goes in `src/lib/forms.ts`.
4. Open the URL in a browser to check it. It should show `{"ok":true,"service":"Kaushal Hub forms"}`.

**After editing the code later:** go to **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. The URL stays the same.

## 6. Important: email delivery
kaushalhub.in's email runs on **Zoho**, and the domain's SPF record only allows Zoho's servers to send for it. When **Google** sends "from hello@kaushalhub.in":

- **Team emails** reach your own Zoho inbox, but Zoho may put them in Spam. Fix: in **Zoho Mail → Settings → Allowed/Blocked → Allowed senders**, add `hello@kaushalhub.in`.
- **Confirmations to the person** can land in their spam folder or show "via google.com".

There are two ways to get confirmations into inboxes. Pick one:

- **A. Send through Zoho (recommended, no DNS access needed).** Follow step 7, then set **Send emails through** to `Zoho`.
- **B. DNS change (needs GoDaddy access).**
  - Add `include:_spf.google.com` to the SPF record. That helps, but Google still can't DKIM-sign for your domain.
  - Remove the duplicate DMARC record, so only one `_dmarc` record is left.

## 7. Optional: send through Zoho Mail
1. Go to **https://api-console.zoho.in**, signed in as hello@kaushalhub.in. Click **Add Client → Self Client → Create** and copy the **Client ID** and **Client Secret**.
2. Open the **Generate Code** tab and fill it in:
   - **Scope:** `ZohoMail.messages.CREATE,ZohoMail.accounts.READ`
   - **Duration:** 10 minutes
   - **Description:** `Website forms`
   - Click **Create** and copy the code.
3. In Apps Script, go to ⚙️ **Project Settings → Script Properties** and add:
   - `ZOHO_CLIENT_ID`: the client ID
   - `ZOHO_CLIENT_SECRET`: the client secret
   - `ZOHO_GRANT_CODE`: the code from step 2. Do this within 10 minutes.
4. In the **Editor**, run **`zohoConnect`**. The log should say *Connected to Zoho. Emails will be sent as hello@kaushalhub.in.*
5. In **Settings**, set **Send emails through** to `Zoho`, then run **`sendTestEmails`** to check.

The Zoho keys are kept in Script Properties, never in the Sheet.
