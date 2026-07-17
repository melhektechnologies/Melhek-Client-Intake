/**
 * Melhek Discovery Form - Backend Integration
 * Receives JSON webhook from the frontend, saves to Google Sheets, and sends a Telegram notification.
 */

// Replace these with your actual Telegram Bot Token, Chat ID, and Google Sheet URL
const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
const TELEGRAM_CHAT_ID = 'YOUR_TELEGRAM_CHAT_ID_HERE';
const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_SHEET_URL_HERE';

function doPost(e) {
  try {
    // 1. Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 2. Map JSON data to a flat array for the Google Sheet
    // Update these headers if your sheet columns change
    const rowData = [
      new Date(), // Timestamp
      data.id || 'Unknown ID',
      data.businessInfo?.businessName || '',
      data.businessInfo?.industry || '',
      data.businessInfo?.businessType || '',
      data.businessInfo?.branches || '',
      data.businessInfo?.address || '',
      data.businessInfo?.contactPerson || '',
      data.businessInfo?.phone || '',
      data.businessInfo?.email || '',
      
      // Overview
      data.businessOverview?.yearsInOperation || '',
      data.businessOverview?.totalEmployees || '',
      data.businessOverview?.monthlySalesRange || '',
      data.businessOverview?.productsServices || '',
      
      // Goals & Urgency
      data.projectGoals?.whyNow || '',
      data.projectQualification?.urgency || '',
      data.projectQualification?.budgetAllocated || '',
      data.projectQualification?.investmentRange || '',
      
      // Full raw JSON dump for deep inspection (optional)
      JSON.stringify(data)
    ];

    // 3. Append to the Google Sheet
    sheet.appendRow(rowData);

    // 4. Send Telegram Notification
    sendTelegramNotification(data);

    // 5. Return success to the frontend
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendTelegramNotification(data) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.includes('YOUR_TELEGRAM')) return;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  // Format the notification message
  const text = `
🚀 *New Discovery Form Submitted!*
*ID:* ${data.id || 'N/A'}

🏢 *Business:* ${data.businessInfo?.businessName || 'N/A'}
👤 *Contact:* ${data.businessInfo?.contactPerson || 'N/A'}
📱 *Phone:* ${data.businessInfo?.phone || 'N/A'}
📧 *Email:* ${data.businessInfo?.email || 'N/A'}

📊 *Industry:* ${data.businessInfo?.industry || 'N/A'}
💰 *Sales:* ${data.businessOverview?.monthlySalesRange || 'N/A'}
🔥 *Urgency:* ${data.projectQualification?.urgency || 'N/A'}
  `;

  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: 'Markdown',
    reply_markup: GOOGLE_SHEET_URL && !GOOGLE_SHEET_URL.includes('YOUR_GOOGLE_SHEET') ? {
      inline_keyboard: [
        [
          {
            text: "📊 Open Google Sheet",
            url: GOOGLE_SHEET_URL
          }
        ]
      ]
    } : undefined
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);
}

// Enable CORS for testing options request
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}
