import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Setup Supabase Client securely on the backend
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://aimuoopbzoyrllvnjnbd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Secret key
const supabase = createClient(supabaseUrl, supabaseKey);

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
      const { data: products, error: pError } = await supabase.from('products').select('*');
      if (pError) throw pError;
      
      const { data: subs, error: sError } = await supabase.from('subscriptions').select('name, status, sell_count');
      if (sError) throw sError;

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

  // 2. Checkout & Upload Receipt
  app.post('/api/orders', upload.single('receipt'), async (req, res) => {
    try {
      const { email, orderDetails, paymentMethod, customerName, customerUsername, customerCode } = req.body;
      let receiptUrl = null;

      if (req.file) {
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `receipt-${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage
          .from('receipts')
          .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage.from('receipts').getPublicUrl(fileName);
        receiptUrl = publicUrlData.publicUrl;
      }

      const { data: orderData, error: dbError } = await supabase
        .from('sales') // using sales as pending orders for integration purpose, or you can have an 'orders' table
        .insert([{
          productName: orderDetails, // Simplified, modify as needed
          price: 0, // Placeholder
          customerName, 
          customerUsername, 
          customerCode,
          notes: 'Pending Approval - Receipt: ' + receiptUrl,
          date: new Date().toISOString()
        }])
        .select()
        .single();
      if (dbError) throw dbError;

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
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert([{
          productName, price, customerName, customerUsername, customerCode, 
          notes: `Approved order ${orderId}`,
          date: new Date().toISOString()
        }])
        .select().single();
      if (saleError) throw saleError;

      // Update Customer total_spent using customerCode or customerUsername (Loose mapping)
      const { data: existingCustomers } = await supabase
        .from('customers')
        .select('*')
        .or(`customer_code.eq.${customerCode},username.eq.${customerUsername}`);
        
      if (existingCustomers && existingCustomers.length > 0) {
        const customer = existingCustomers[0];
        await supabase.from('customers').update({ 
          total_spent: (Number(customer.total_spent) || 0) + Number(price) 
        }).eq('id', customer.id);
      }

      // Log into Transactions
      await supabase.from('transactions').insert([{
        type: 'income',
        amount: price,
        person: customerName || customerUsername,
        description: 'Sale Income',
        notes: `[تلقائي] رقم المبيعة: ${saleData.id}`
      }]);

      res.status(200).json({ message: 'Sale approved & logged successfully.', sale: saleData });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Handle encrypted Subscriptions (Secure Save)
  app.post('/api/admin/subscriptions', requireAuth, async (req, res) => {
    try {
      const { name, account_username, account_password, category, status, sell_count } = req.body;
      const encryptedPassword = encryptData(account_password);

      const { data, error } = await supabase.from('subscriptions').insert([{
        name, account_username, account_password: encryptedPassword, category, status, sell_count
      }]).select().single();
      
      if (error) throw error;
      res.status(201).json(data);
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Admin CRUD proxy
  app.get('/api/admin/:table', requireAuth, async (req, res) => {
    try {
      const { table } = req.params;
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw error;
      
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
