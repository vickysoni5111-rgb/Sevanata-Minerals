const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();


// यहाँ अपनी Vercel वाली वेबसाइट का URL डालें
app.use(cors({
  origin: "https://sevanta-minerals-frontend-y737-mu.vercel.app", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// 🚀 होम रूट (Home Root)
app.get('/', (req, res) => {
  res.send('🚀 Sevanta Minerals Backend is Live and Running!');
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Sevantaminerals@gmail.com', 
    pass: process.env.EMAIL_PASS   
  }
});

app.post('/api/send-lead', async (req, res) => {
  const { name, email, countryCode, phone, companyName, service, budget, projectDetails } = req.body;
  const currentDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

  const emailSubject = `💎 B2B Lead Alert: ${name} | ${service || 'New Request'}`;

  // ✨ CSS की % वाली गड़बड़ को रोकने के लिए वेरिएबल्स बना दिए
  const bgPercent25 = "25%";
  const bgPercent100 = "100%";

  const emailHtmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          background: #f4f1ea linear-gradient(135deg, #f5efe6 ${bgPercent25}, #eadecc ${bgPercent100});
          margin: 0;
          padding: 40px 15px;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(156, 111, 58, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(184, 135, 79, 0.2);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #1e272e, #0f1418);
          padding: 35px 30px;
          text-align: center;
          border-bottom: 4px solid #b8874f;
        }
        .header h1 {
          margin: 0;
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .header p {
          margin: 8px 0 0 0;
          color: #b8874f;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .body-content {
          padding: 35px 30px;
        }
        .meta-bar {
          display: table;
          width: 100%;
          font-size: 13px;
          color: #7f8c8d;
          padding-bottom: 18px;
          margin-bottom: 25px;
          border-bottom: 1px solid #f2edd6;
        }
        .meta-left {
          display: table-cell;
          text-align: left;
        }
        .meta-right {
          display: table-cell;
          text-align: right;
        }
        .status-pill {
          background-color: #fcf3e8;
          color: #9c6f3a;
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 12px;
          border: 1px solid #ead7bc;
        }
        .table-title {
          font-size: 15px;
          font-weight: 700;
          color: #1e272e;
          margin-bottom: 15px;
        }
        .data-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-bottom: 30px;
          border: 1px solid #ead7bc;
          border-radius: 10px;
          overflow: hidden;
        }
        .data-table tr td {
          padding: 15px 18px;
          font-size: 14px;
          border-bottom: 1px solid #fff5e6;
          vertical-align: middle;
        }
        .data-table tr:last-child td {
          border-bottom: none;
        }
        .label-column {
          background-color: #fffdf9;
          font-weight: 600;
          color: #9c6f3a;
          width: 38%;
          border-right: 1px solid #fff5e6;
        }
        .value-column {
          background-color: #ffffff;
          color: #2c3e50;
        }
        .service-highlight {
          color: #1e272e;
          font-weight: 700;
        }
        .budget-tag {
          display: inline-block;
          padding: 4px 12px;
          background: linear-gradient(135deg, #b8874f, #9c6f3a);
          color: #ffffff;
          font-weight: 600;
          border-radius: 6px;
          font-size: 12px;
        }
        .section-heading {
          font-size: 14px;
          font-weight: 700;
          color: #1e272e;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .requirements-box {
          background: #fffdf9;
          border: 1px solid #ead7bc;
          border-left: 4px solid #b8874f;
          border-radius: 8px;
          padding: 20px;
          font-size: 14px;
          color: #4f4f4f;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        .footer-bar {
          background-color: #1e272e;
          padding: 22px;
          text-align: center;
          font-size: 11px;
          color: #8a8a8a;
        }
      </style>
    </head>
    <body>

      <div class="wrapper">
        <div class="header">
          <h1>Lead Details Form</h1>
          <p>Sevanta Minerals Internal Portal</p>
        </div>

        <div class="body-content">
          <div class="meta-bar">
            <div class="meta-left">
              <strong>Status:</strong> <span class="status-pill">Active Verified Lead</span>
            </div>
            <div class="meta-right">
              <strong>Date/Time:</strong> ${currentDateTime}
            </div>
          </div>

          <div class="table-title">💼 Customer Information</div>
          
          <table class="data-table">
            <tbody>
              <tr>
                <td class="label-column">👤 Client Name</td>
                <td class="value-column" style="font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td class="label-column">📧 Email Address</td>
                <td class="value-column">
                  <a href="mailto:${email}" style="color: #9c6f3a; text-decoration: none; font-weight: 600;">${email}</a>
                </td>
              </tr>
              <tr>
                <td class="label-column">📞 Contact Number</td>
                <td class="value-column">${countryCode ? countryCode + ' ' : ''}${phone}</td>
              </tr>
              <tr>
                <td class="label-column">🏢 Company Name</td>
                <td class="value-column">${companyName || '<em>Not Provided</em>'}</td>
              </tr>
              <tr>
                <td class="label-column">🛠️ Service/Product</td>
                <td class="value-column service-highlight">${service || 'General Enquiry'}</td>
              </tr>
              <tr>
                <td class="label-column">💰 Estimated Budget</td>
                <td class="value-column">
                  <span class="budget-tag">${budget || 'N/A'}</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="section-heading">📝 Detailed Requirements</div>
          <div class="requirements-box">
            ${projectDetails || 'No specific technical parameters described.'}
          </div>
        </div>

        <div class="footer-bar">
          This is an automated sales notification generated by Sevanta Minerals Hub.
        </div>
      </div>

    </body>
    </html>
  `;

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: 'Sevantaminerals@gmail.com', 
    replyTo: email,
    subject: emailSubject,
    html: emailHtmlBody
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Lead sent successfully!' });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server fully operational on port ${PORT}`));