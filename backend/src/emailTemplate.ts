export const getEmailTemplate = (title: string, preheader: string, content: string, buttonText: string, buttonLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      color: #334155;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 24px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
    }
    .header {
      background-color: #1a2340;
      padding: 40px 40px 30px 40px;
      text-align: center;
    }
    .logo {
      color: #ffffff;
      font-size: 32px;
      font-weight: 600;
      letter-spacing: -1px;
      margin: 0;
      text-decoration: none;
    }
    .logo span {
      color: #d4af37;
      font-size: 32px;
      font-weight: 600;
      letter-spacing: -1px;
    }
    .content {
      padding: 20px 40px 40px 40px;
    }
    h1 {
      color: #0f172a;
      font-size: 24px;
      font-weight: 500;
      margin-top: 0;
      margin-bottom: 24px;
      text-align: center;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      margin-top: 0;
      margin-bottom: 24px;
      color: #475569;
      text-align: center;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background-color: #1a2340;
      color: #ffffff !important;
      font-weight: 500;
      font-size: 15px;
      text-decoration: none;
      padding: 16px 36px;
      border-radius: 50px;
      box-shadow: 0 8px 20px rgba(26, 35, 64, 0.25);
    }
    .footer {
      padding: 32px 40px;
      text-align: center;
      background-color: #f8fafc;
      border-top: 1px solid #f1f5f9;
    }
    .footer p {
      margin: 0;
      font-size: 13px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${preheader}
  </div>
  
  <div class="container">
    <div class="header">
      <div class="logo">contaudit<span>.eu</span></div>
    </div>
    
    <div class="content">
      ${content}
      
      <div class="button-container">
        <a href="${buttonLink}" class="button">${buttonText}</a>
      </div>
      
      <p style="font-size: 13px; color: #94a3b8; margin-bottom: 0; margin-top: 40px;">
        Dacă nu ați solicitat această acțiune, puteți ignora acest email.
      </p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Contaudit. Toate drepturile rezervate.</p>
    </div>
  </div>
</body>
</html>
`;
