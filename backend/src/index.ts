import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const UPLOADS_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';

// --- AUTHENTICATION --- //

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Determine role: if it's the first user ever, make them ADMIN
    const totalUsers = await prisma.user.count();
    const role = totalUsers === 0 ? 'ADMIN' : 'CLIENT';

    const passwordHash = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const isVerified = role === 'ADMIN'; // Auto-verify the first admin user

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        verifyToken,
        isVerified
      }
    });

    if (!isVerified) {
      const verifyLink = `https://contaudit.eu/verify?token=${verifyToken}`;
      try {
        await transporter.sendMail({
          from: `"Contaudit" <${process.env.SMTP_USER}>`,
          to: email,
          subject: 'Verifică adresa de email - Contaudit',
          html: `
            <h3>Salut, ${name}!</h3>
            <p>Îți mulțumim pentru înregistrarea pe platforma Contaudit.</p>
            <p>Pentru a activa contul, te rugăm să dai click pe linkul de mai jos:</p>
            <a href="${verifyLink}" style="display:inline-block;padding:10px 20px;background-color:#1a2340;color:#ffffff;text-decoration:none;border-radius:5px;">Verifică Contul</a>
            <p>Dacă nu ai solicitat crearea unui cont, poți ignora acest mesaj.</p>
          `,
        });
      } catch (mailError) {
        console.error('Failed to send verification email:', mailError);
        // Continue, don't fail registration, but maybe admin has to manually verify
      }
    }

    res.status(201).json({ message: 'User registered successfully', userId: user.id, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, isVerified: user.isVerified }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/verify', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token invalid' });
    }

    const user = await prisma.user.findFirst({ where: { verifyToken: token } });
    if (!user) {
      return res.status(400).json({ error: 'Token invalid sau expirat' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verifyToken: null }
    });

    res.json({ message: 'Email verificat cu succes' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email este necesar' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    // If user doesn't exist or is already verified, we still return a success message
    // to prevent email enumeration (security best practice)
    if (!user || user.isVerified) {
      return res.json({ message: 'Dacă adresa există și nu este verificată, vei primi un email în curând.' });
    }

    const verifyToken = crypto.randomBytes(32).toString('hex');
    
    await prisma.user.update({
      where: { id: user.id },
      data: { verifyToken }
    });

    const verifyLink = `https://contaudit.eu/verify?token=${verifyToken}`;
    
    await transporter.sendMail({
      from: `"Contaudit" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verifică adresa de email - Contaudit',
      html: `
        <h3>Salut, ${user.name}!</h3>
        <p>Ai solicitat retransmiterea linkului de activare pentru platforma Contaudit.</p>
        <p>Pentru a activa contul, te rugăm să dai click pe linkul de mai jos:</p>
        <a href="${verifyLink}" style="display:inline-block;padding:10px 20px;background-color:#1a2340;color:#ffffff;text-decoration:none;border-radius:5px;">Verifică Contul</a>
        <p>Dacă nu ai solicitat crearea unui cont, poți ignora acest mesaj.</p>
      `,
    });

    res.json({ message: 'Email de verificare retrimis cu succes!' });
  } catch (error) {
    console.error('Failed to resend verification email:', error);
    res.status(500).json({ error: 'Eroare la trimiterea email-ului. Încearcă din nou mai târziu.' });
  }
});

// --- MIDDLEWARES --- //

const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};

app.get('/api/auth/me', authenticate, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- CLIENT DASHBOARD --- //

app.get('/api/client/dashboard', authenticate, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const requests = await prisma.request.findMany({ where: { clientId: userId }, orderBy: { createdAt: 'desc' } });
    const documents = await prisma.document.findMany({ where: { clientId: userId }, orderBy: { createdAt: 'desc' } });
    
    res.json({ requests, documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/client/requests', authenticate, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { title, description } = req.body;
    
    const request = await prisma.request.create({
      data: { title, description, clientId: userId }
    });
    
    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- ADMIN DASHBOARD --- //

app.get('/api/admin/users', authenticate, requireAdmin, async (req: any, res: any) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'CLIENT' },
      select: { id: true, name: true, email: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/requests', authenticate, requireAdmin, async (req: any, res: any) => {
  try {
    const requests = await prisma.request.findMany({
      include: { client: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/requests/:id', authenticate, requireAdmin, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: { status }
    });
    
    res.json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/documents/:clientId', authenticate, requireAdmin, upload.single('file'), async (req: any, res: any) => {
  try {
    const { clientId } = req.params;
    const { title } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = req.file.filename;
    
    const doc = await prisma.document.create({
      data: { title, fileUrl, clientId }
    });
    
    res.status(201).json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- FILE DOWNLOAD (Shared) --- //
app.get('/api/documents/:id/download', authenticate, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (role !== 'ADMIN' && doc.clientId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const filePath = path.join(UPLOADS_DIR, doc.fileUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    res.download(filePath, doc.fileUrl.split('-').slice(1).join('-') || doc.fileUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- CONTACT FORM (Public) --- //
app.post('/api/contact', async (req: any, res: any) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const msg = await prisma.contactMessage.create({
      data: { name, email, message }
    });
    
    res.status(201).json({ success: true, message: 'Message sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
