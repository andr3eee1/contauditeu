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
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background-color: #1a2340;
      padding: 32px 40px;
      text-align: center;
    }
    .logo {
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .logo span {
      color: #d4af37;
    }
    .content {
      padding: 40px;
    }
    h1 {
      color: #0f172a;
      font-size: 24px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 24px;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      margin-top: 0;
      margin-bottom: 24px;
      color: #475569;
    }
    .button-container {
      text-align: center;
      margin: 40px 0;
    }
    .button {
      display: inline-block;
      background-color: #1a2340;
      color: #ffffff !important;
      font-weight: 500;
      font-size: 16px;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 50px;
      box-shadow: 0 4px 14px 0 rgba(26, 35, 64, 0.39);
    }
    .footer {
      padding: 24px 40px;
      text-align: center;
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      font-size: 14px;
      color: #94a3b8;
    }
    .footer p {
      margin: 0;
      font-size: 14px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <!-- Preheader text hidden in body but shown in inbox preview -->
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${preheader}
  </div>
  
  <div class="container">
    <div class="header">
      <h2 class="logo">CONTAUDIT<span>.eu</span></h2>
    </div>
    
    <div class="content">
      ${content}
      
      <div class="button-container">
        <a href="${buttonLink}" class="button">${buttonText}</a>
      </div>
      
      <p style="font-size: 14px; margin-bottom: 0;">
        Dacă nu ați solicitat această acțiune, puteți ignora acest email.
      </p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Contaudit. Toate drepturile rezervate.</p>
    </div>
  </div>
</body>
</html>
`
