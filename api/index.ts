import express from 'express';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { CognitoIdentityProviderClient, AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";

// Setup Supabase Client securely on the backend
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://aimuoopbzoyrllvnjnbd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const upload = multer({ storage: multer.memoryStorage() });

// Security and Encryption Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-ludex-key-change-in-prod';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'); // AES-256
const IV_LENGTH = 16; 

// AES-256-GCM Encryption Helper
function encryptData(text: string): string {
  try {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    let authTag = cipher.getAuthTag().toString('hex');
    return iv.toString('hex') + ':' + authTag + ':' + encrypted;
  } catch (e) {
    console.error("Encryption error:", e);
    return text;
  }
}

function decryptData(text: string): string {
  try {
    let parts = text.split(':');
    if (parts.length !== 3) return text;
    let iv = Buffer.from(parts[0], 'hex');
    let authTag = Buffer.from(parts[1], 'hex');
    let encryptedText = Buffer.from(parts[2], 'hex');
    let decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    console.error("Decryption error:", e);
    return text; // Return encrypted if failed (prevents app crash)
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// === Authentication Middleware ===
import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.VITE_COGNITO_USER_POOL_ID || "eu-west-2_U4XqWb90M",
  tokenUse: "id", // Use ID token
  clientId: process.env.VITE_COGNITO_CLIENT_ID || null, 
});

const requireAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = authHeader.split(' ')[1];
  
  if (token.length < 500) {
    // Custom JWT token
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Invalid or expired custom token' });
      req.user = user;
      next();
    });
  } else {
    // Cognito JWT token
    try {
      const payload = await verifier.verify(token);
      req.user = { id: payload.sub, email: payload.email, ...payload };
      next();
    } catch (err2) {
      console.error("Cognito JWT Verify failed", err2);
      return res.status(403).json({ error: 'Invalid or expired Cognito token' });
    }
  }
};

// Login Endpoint generating JWT
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'AbuHassan_Admin' && password === 'Admin123!') {
    const token = jwt.sign({ username: email, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { role: 'ADMIN', username: email } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// === Public Routes ===
app.get('/api/public/products', async (req, res) => {
  try {
    const { data: products, error: pError } = await supabase.from('products').select('*');
    if (pError) throw pError;
    
    const { data: subs, error: sError } = await supabase.from('subscriptions').select('name, status, sell_count');
    if (sError) throw sError;

    const mappedProducts = products.map((p: any) => {
      const relatedSub = subs.find((s: any) => s.name?.toLowerCase() === p.name?.toLowerCase());
      return {
        ...p,
        stock: relatedSub && relatedSub.status === 'active' ? 1 : 0
      };
    });
    res.json(mappedProducts);
  } catch(e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/public/showcase', async (req, res) => {
  try {
    const { data, error } = await supabase.from('promotions').select('*');
    if (error) {
      if (error.message && error.message.includes('Could not find the table')) {
        return res.json([]);
      }
      throw error;
    }
    res.json(data);
  } catch(e: any) {
    res.status(500).json({ error: e.message });
  }
});

// 2. Submit Public Order & Upload Receipt
app.post('/api/public/orders', upload.single('receipt'), async (req, res) => {
  try {
    const { email, orderDetails, paymentMethod, customerName, customerUsername, customerCode } = req.body;
    let receiptUrl = null;

    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `receipt-${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage
        .from('receipts')
        .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });
      if (error) {
         console.warn("Storage upload failed, creating simple order without receipt image.", error.message);
      } else {
         const { data: publicUrlData } = supabase.storage.from('receipts').getPublicUrl(fileName);
         receiptUrl = publicUrlData.publicUrl;
      }
    }

    const { data: orderData, error: dbError } = await supabase
      .from('sales') 
      .insert([{
        productName: orderDetails, 
        price: 0, 
        customerName, 
        customerUsername, 
        customerCode,
        notes: 'Pending Approval - Receipt: ' + (receiptUrl || 'None Attached'),
        date: new Date().toISOString()
      }])
      .select()
      .single();
    if (dbError) throw dbError;

    res.status(201).json({ message: 'Order submitted!', receiptUrl });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// === Admin Protected Routes ===

app.post('/api/admin/approve_sale', requireAuth, async (req, res) => {
  try {
    const { orderId, productName, price, customerName, customerUsername, customerCode } = req.body;

    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert([{
        productName, price, customerName, customerUsername, customerCode, 
        notes: `Approved order ${orderId}`,
        date: new Date().toISOString()
      }])
      .select().single();
    if (saleError) throw saleError;

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

const ALLOWED_TABLES = ['products', 'subscriptions', 'sales', 'customers', 'transactions', 'settings', 'promotions', 'profiles'];

app.delete('/api/public/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.from('profiles').delete().eq('id', id);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/profiles/sync', async (req, res) => {
  // Public endpoint for now to sync Cognito users
  try {
    const { email, name, id } = req.body;
    const { data: existing, error } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle();
    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
    let profileData = existing;
    if (!existing) {
      const { data } = await supabase.from('profiles').insert([{ id, email, display_name: name || '', role: email === 'admin@pixel.com' ? 'ADMIN' : 'USER', platforms: [], interests: [] }]).select().single();
      profileData = data;
    } else if (id && existing.id !== id) {
      const { data } = await supabase.from('profiles').update({ id }).eq('email', email).select().single();
      profileData = data;
    }
    res.json({ success: true, profile: profileData });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/admin/profiles/cognito/:id', requireAuth, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Authorization check
    // req.user from Custom JWT has role: 'ADMIN', from Cognito has no role but we look it up in Supabase if needed
    // However, if req.user.id is the same as the id, allow self-deletion
    let isAdmin = req.user.role === 'ADMIN' || req.user.email === 'admin@pixel.com';
    const reqUserId = req.user.id || req.user.sub || req.user.username; // depending on token type

    if (reqUserId !== id && !isAdmin) {
        // If not deleting self, and not clearly an admin, forbid.
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    
    if (profile) {
       await supabase.from('profiles').delete().eq('id', id);
    }
    
    // Attempt Cognito Detetion
    try {
        const poolId = process.env.VITE_COGNITO_USER_POOL_ID || "eu-west-2_U4XqWb90M";
        const region = poolId.split('_')[0] || "eu-west-2";
        const client = new CognitoIdentityProviderClient({
          region: region,
        });
        
        // Find user by email instead if that is their username
        const command = new AdminDeleteUserCommand({
          UserPoolId: poolId, // Process env
          Username: (profile?.email) || id
        });
        
        await client.send(command);
    } catch(err) {
        console.error("Cognito deletion failed. It might not exist or ID is incorrect.", err);
    }

    res.json({ success: true });
  } catch(e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/admin/:table', requireAuth, async (req, res) => {
  try {
    const { table } = req.params;
    if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Invalid table' });

    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    
    const sanitizedData = data.map((item: any) => {
       if (table === 'subscriptions' && item.account_password) {
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
  if (req.params.table === 'subscriptions') return;
  try {
    const { table } = req.params;
    if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Invalid table' });

    const { data, error } = await supabase.from(table).insert([req.body]).select().single();
    if (error) throw error;
    res.status(201).json(data);
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
      delete updateData.account_password;
    }
    
    const { data, error } = await supabase.from(table).update(updateData).eq('id', id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/admin/:table/:id', requireAuth, async (req, res) => {
  try {
    const { table, id } = req.params;
    if (!ALLOWED_TABLES.includes(table)) return res.status(400).json({ error: 'Invalid table' });

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

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

export default app;
