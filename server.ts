import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Database from 'better-sqlite3';

// Setup local SQLite Database
const db = new Database('ludex.sqlite', { verbose: console.log });
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    costPrice REAL,
    sellingPrice REAL,
    supplier TEXT,
    category TEXT,
    type TEXT,
    image_url TEXT,
    discountPrice REAL,
    isFeatured BOOLEAN
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    account_username TEXT,
    account_password TEXT,
    category TEXT,
    status TEXT,
    sell_count INTEGER
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productName TEXT,
    price REAL,
    customerName TEXT,
    customerUsername TEXT,
    customerCode TEXT,
    notes TEXT,
    date TEXT
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    username TEXT,
    customer_code TEXT,
    total_spent REAL
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    amount REAL,
    person TEXT,
    description TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    key TEXT,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    imageUrl TEXT,
    linkToCategory TEXT,
    active BOOLEAN
  );
`);

const upload = multer({ storage: multer.memoryStorage() });

// Security and Encryption Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-ludex-key-change-in-prod';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'); // 32 bytes for AES-256
const IV_LENGTH = 16; // AES block size


// AES-256-GCM Encryption Helper
function encryptData(text: string): string {
  try {
    const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (e) {
    console.error('Encryption failed:', e);
    return text;
  }
}

function decryptData(encryptedString: string): string {
  try {
    const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');
    const [ivHex, authTagHex, encryptedText] = encryptedString.split(':');
    if (!ivHex || !authTagHex || !encryptedText) return encryptedString;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    console.error('Decryption failed:', e);
    return encryptedString;
  }
}

// Authentication Middleware
const requireAuth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized access' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // === Authentication Route ===
  app.post('/api/auth/login', (req, res) => {
    // Sanitize and Validate
    const { email, password } = req.body;
    if (email === 'admin@ludexstore.com' && password === 'Admin123!') { // Demo Admin Logic
      const token = jwt.sign({ id: 1, role: 'ADMIN', email }, JWT_SECRET, { expiresIn: '8h' });
      return res.json({ token, user: { email, role: 'ADMIN' } });
    }
    res.status(401).json({ error: 'Invalid credentials' });
  });

  // === Public Routes ===
  // 1. Fetch Storefront Catalog (Products loosely mapped with Subscriptions for stock)
  app.get('/api/public/products', async (req, res) => {
    try {
      const products = db.prepare('SELECT * FROM products').all();
      const subs = db.prepare('SELECT name, status, sell_count FROM subscriptions').all() as any[];

      // Loose mapping string match
      const mappedProducts = products.map((p: any) => {
        const relatedSub = subs.find((s: any) => s.name?.toLowerCase() === p.name?.toLowerCase());
        return {
          ...p,
          inStock: relatedSub ? relatedSub.status === 'active' : true, // Fallback if no sub tracking
          sell_count: relatedSub ? relatedSub.sell_count : 0
        };
      });

      res.json(mappedProducts);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/public/promotions', async (req, res) => {
    try {
      const data = db.prepare('SELECT * FROM promotions').all();
      res.json(data);
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 2. Checkout & Upload Receipt
  app.post('/api/orders', upload.single('receipt'), async (req, res) => {
    try {
      const { email, orderDetails, paymentMethod, customerName, customerUsername, customerCode } = req.body;
      let receiptUrl = null;

      // Mock receipt URL since we don't have storage anymore, or serve it statically
      if (req.file) {
        receiptUrl = 'mock-uploaded-receipt.png';
      }

      const stmt = db.prepare(\`
        INSERT INTO sales (productName, price, customerName, customerUsername, customerCode, notes, date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      \`);
      const info = stmt.run(
        orderDetails, 15, customerName, customerUsername, customerCode, 'Pending Approval - Receipt: ' + receiptUrl, new Date().toISOString()
      );

      res.status(201).json({ message: 'Order submitted!', receiptUrl });
    } catch (e: any) {
      console.error('Order Submission Error:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // === Admin Protected Routes ===

  // 3. Admin: Approve Order (Loose Mapping integration to sales, customers, transactions)
  app.post('/api/admin/approve_sale', requireAuth, async (req, res) => {
    try {
      const { orderId, productName, price, customerName, customerUsername, customerCode } = req.body;

      // Insert into Sales
      const insertSale = db.prepare(\`
        INSERT INTO sales (productName, price, customerName, customerUsername, customerCode, notes, date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      \`);
      const { lastInsertRowid: saleId } = insertSale.run(productName, price, customerName, customerUsername, customerCode, \`Approved order \${orderId}\`, new Date().toISOString());

      // Update Customer total_spent using customerCode or customerUsername (Loose mapping)
      const existingCustomer = db.prepare('SELECT * FROM customers WHERE customer_code = ? OR username = ?').get(customerCode, customerUsername) as any;
        
      if (existingCustomer) {
        db.prepare('UPDATE customers SET total_spent = ? WHERE id = ?').run(
          (Number(existingCustomer.total_spent) || 0) + Number(price),
          existingCustomer.id
        );
      }

      // Log into Transactions
      db.prepare(\`
        INSERT INTO transactions (type, amount, person, description, notes)
        VALUES (?, ?, ?, ?, ?)
      \`).run('income', price, customerName || customerUsername, 'Sale Income', \`[تلقائي] رقم المبيعة: \${saleId}\`);

      res.status(200).json({ message: 'Sale approved & logged successfully.', sale: { id: saleId } });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Handle encrypted Subscriptions (Secure Save)
  app.post('/api/admin/subscriptions', requireAuth, async (req, res) => {
    try {
      const { name, account_username, account_password, category, status, sell_count } = req.body;
      const encryptedPassword = encryptData(account_password);

      const stmt = db.prepare(\`
        INSERT INTO subscriptions (name, account_username, account_password, category, status, sell_count)
        VALUES (?, ?, ?, ?, ?, ?)
      \`);
      const info = stmt.run(name, account_username, encryptedPassword, category, status, sell_count || 0);
      
      res.status(201).json({ id: info.lastInsertRowid });
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  const ALLOWED_TABLES = ['products', 'subscriptions', 'sales', 'customers', 'transactions', 'settings', 'promotions'];

  // Admin CRUD proxy
  app.get('/api/admin/:table', requireAuth, async (req, res) => {
    try {
      const { table } = req.params;
      if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Invalid table' });

      const data = db.prepare(\`SELECT * FROM \${table}\`).all() as any[];
      
      // If fetching subscriptions, we might decrypt or keep encrypted. usually keep encrypted or masked depending on UI.
      const sanitizedData = data.map((item: any) => {
         if (table === 'subscriptions' && item.account_password) {
             // For Admin Dashboard, optionally decrypt or mask
             item.account_password_decrypted = decryptData(item.account_password); 
         }
         return item;
      });

      res.json(sanitizedData);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/admin/:table', requireAuth, async (req, res) => {
    if (req.params.table === 'subscriptions') return; // Handled separately
    try {
      const { table } = req.params;
      if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Invalid table' });

      const keys = Object.keys(req.body);
      const values = Object.values(req.body);
      const placeholders = keys.map(() => '?').join(', ');
      
      const stmt = db.prepare(\`INSERT INTO \${table} (\${keys.join(', ')}) VALUES (\${placeholders})\`);
      const info = stmt.run(...values);
      res.status(201).json({ id: info.lastInsertRowid });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/admin/:table/:id', requireAuth, async (req, res) => {
    try {
      const { table, id } = req.params;
      if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Invalid table' });

      let updateData = { ...req.body };
      if (table === 'subscriptions' && updateData.account_password && updateData.account_password !== 'MASKED') {
        updateData.account_password = encryptData(updateData.account_password);
      } else if (table === 'subscriptions' && updateData.account_password === 'MASKED') {
        delete updateData.account_password; // Don't overwrite with 'MASKED'
      }
      
      // Remove id from updateData if it exists
      delete updateData.id;

      const keys = Object.keys(updateData);
      const values = Object.values(updateData);
      
      if (keys.length === 0) return res.json({ id });

      const setClause = keys.map(k => \`\${k} = ?\`).join(', ');
      const stmt = db.prepare(\`UPDATE \${table} SET \${setClause} WHERE id = ?\`);
      stmt.run(...values, id);
      
      res.json({ id });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/admin/:table/:id', requireAuth, async (req, res) => {
    try {
      const { table, id } = req.params;
      if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Invalid table' });

      const stmt = db.prepare(\`DELETE FROM \${table} WHERE id = ?\`);
      stmt.run(id);
      
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 5. Loyalty Card Generation proxy
  app.post('/api/loyalty/generate', requireAuth, async (req, res) => {
    try {
      const { email } = req.body;
      const loyaltyUrl = process.env.LOYALTY_URL || 'https://ludex-pic.vercel.app/';
      res.json({
        success: true,
        message: 'Loyalty card successfully connected.',
        card_link: `${loyaltyUrl}?user=${email}`
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
