const fs = require('fs');
let code = fs.readFileSync('backend/src/index.ts', 'utf8');

// Add import
code = code.replace(
  "import jwt from 'jsonwebtoken';",
  "import jwt from 'jsonwebtoken';\nimport { getEmailTemplate } from './emailTemplate';"
);

// Update Register email
code = code.replace(
  /await transporter\.sendMail\(\{[\s\S]*?\}\);/m,
  `await transporter.sendMail({
      from: \`"Contaudit" <\${process.env.SMTP_USER}>\`,
      to: email,
      subject: 'Activare Cont - Contaudit',
      html: getEmailTemplate(
        'Activare Cont',
        'Activează-ți noul cont pe platforma Contaudit',
        \`<h1>Salut, \${name}!</h1><p>Bine ai venit pe platforma <strong>Contaudit</strong>. Pentru a putea accesa documentele tale și a interacționa cu echipa noastră, te rugăm să îți activezi contul dând click pe butonul de mai jos.</p>\`,
        'Activează Contul',
        \`https://contaudit.eu/verify?token=\${verifyToken}\`
      )
    });`
);

// Update Resend verification email
code = code.replace(
  /await transporter\.sendMail\(\{[\s\S]*?subject: 'Verifică adresa de email - Contaudit'[\s\S]*?\}\);/m,
  `await transporter.sendMail({
      from: \`"Contaudit" <\${process.env.SMTP_USER}>\`,
      to: email,
      subject: 'Verifică adresa de email - Contaudit',
      html: getEmailTemplate(
        'Verificare Email',
        'Retrimitere link de activare cont',
        \`<h1>Salut, \${user.name}!</h1><p>Ai solicitat retransmiterea linkului de activare pentru platforma <strong>Contaudit</strong>.</p><p>Pentru a-ți activa contul, te rugăm să dai click pe butonul de mai jos:</p>\`,
        'Verifică Contul',
        verifyLink
      )
    });`
);

// Add forgot/reset password endpoints
const authMeRegex = /app\.get\('\/api\/auth\/me'[\s\S]*?\}\);/m;
const forgotResetEndpoints = `

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email este necesar' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success anyway for security
      return res.json({ message: 'Dacă contul există, vei primi un email de resetare.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken, resetPasswordExpires: resetExpires }
    });

    const resetLink = \`https://contaudit.eu/reset-password?token=\${resetToken}\`;
    
    await transporter.sendMail({
      from: \`"Contaudit" <\${process.env.SMTP_USER}>\`,
      to: email,
      subject: 'Resetare Parolă - Contaudit',
      html: getEmailTemplate(
        'Resetare Parolă',
        'Ai solicitat resetarea parolei pentru contul tău.',
        \`<h1>Salut, \${user.name}!</h1><p>Am primit o cerere pentru resetarea parolei contului tău de pe platforma <strong>Contaudit</strong>.</p><p>Acest link este valabil timp de <strong>1 oră</strong>.</p>\`,
        'Resetează Parola',
        resetLink
      )
    });

    res.json({ message: 'Dacă contul există, vei primi un email de resetare.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token și parolă nouă necesare' });

    const user = await prisma.user.findFirst({
      where: { 
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() } // Must not be expired
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Link invalid sau expirat.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    res.json({ message: 'Parola a fost resetată cu succes!' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
`;

code = code.replace(authMeRegex, (match) => match + forgotResetEndpoints);

fs.writeFileSync('backend/src/index.ts', code);
console.log('Patched index.ts');
