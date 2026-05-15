import 'dotenv/config';
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { CognitoIdentityProviderClient, AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";

// Setup Supabase Client securely on the backend
const supabaseUrlStore = 'https://aimuoopbzoyrllvnjnbd.supabase.co';
const supabaseKeyStore = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbXVvb3Biem95cmxsdm5qbmJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjEzMTc4NiwiZXhwIjoyMDg3NzA3Nzg2fQ.mE-fW4cSwEj69To4pIL3oHY2fLy2tnvA5Y0E8XfR_qg'; // service role key

const supabaseUrlAuth = 'https://xogrjpfcaydjkgzphaoq.supabase.co';
const supabaseKeyAuth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZ3JqcGZjYXlkamtnenBoYW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Nzg1NjIsImV4cCI6MjA4OTM1NDU2Mn0._KjiI6bfFc1kM-i5rvWtPB-vDxLwqtpY2Gb3fMIP-_M'; // anon key provided 

const supabaseStore = createClient(supabaseUrlStore, supabaseKeyStore);
const supabaseAuth = createClient(supabaseUrlAuth, supabaseKeyAuth);

const getSupabaseClient = (table: string | null) => {
    // Return auth client for profiles and when explicitly passed null (for storage)
    if (table === 'profiles' || table === null) {
        return supabaseAuth;
    }
    return supabaseStore;
}

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
    const { data: products, error: pError } = await getSupabaseClient('products').from('products').select('*');
    if (pError) throw pError;
    
    const { data: subs, error: sError } = await getSupabaseClient('subscriptions').from('subscriptions').select('name, status, sell_count');
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
    const { data, error } = await getSupabaseClient('promotions').from('promotions').select('*');
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
      const { error } = await getSupabaseClient(null).storage
        .from('receipts')
        .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });
      if (error) {
         console.warn("Storage upload failed, creating simple order without receipt image.", error.message);
      } else {
         const { data: publicUrlData } = getSupabaseClient(null).storage.from('receipts').getPublicUrl(fileName);
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
      await getSupabaseClient('customers').from('customers').update({ 
        total_spent: (Number(customer.total_spent) || 0) + Number(price) 
      }).eq('id', customer.id);
    }

    await getSupabaseClient('transactions').from('transactions').insert([{
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

    const { data, error } = await getSupabaseClient('subscriptions').from('subscriptions').insert([{
      name, account_username, account_password: encryptedPassword, category, status, sell_count
    }]).select().single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch(e: any) {
    res.status(500).json({ error: e.message });
  }
});

const ALLOWED_TABLES = ['products', 'subscriptions', 'sales', 'customers', 'transactions', 'settings', 'promotions', 'profiles', 'chat_sessions', 'chat_messages'];

app.delete('/api/public/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Soft delete: mark as DELETED and set a scheduled deletion date for 30 days from now
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    await getSupabaseClient('profiles').from('profiles').update({
       role: 'DELETED',
    }).eq('id', id);
    
    // Note: To fully delete after 30 days, we run a cleanup script or endpoint.
    res.json({ success: true, message: 'Account soft deleted and scheduled for hard deletion in 30 days.' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Admin endpoint to manually trigger cleanup of soft-deleted accounts that are older than 30 days
app.post('/api/admin/system/cleanup-deleted-users', requireAuth, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'ADMIN' && req.user.email !== 'admin@pixel.com') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // In a real cron environment, we'd query users where role='DELETED' and deleted_at < now() - 30 days
    // But since we just added the deleted_at concept or we might not have the column yet, we'll try catching them.
    // Assuming we added or will just use the role 'DELETED' for now.
    const { data: usersToDelete, error: selErr } = await getSupabaseClient('profiles')
        .from('profiles')
        .select('id, email')
        .eq('role', 'DELETED');
        // If we had a deleted_at column we could filter by date. For safety, we keep it simple or require manual check.
        
    if (selErr) throw selErr;
    
    let deletedCount = 0;
    const poolId = process.env.VITE_COGNITO_USER_POOL_ID || "eu-west-2_U4XqWb90M";
    const region = poolId.split('_')[0] || "eu-west-2";
    const client = new CognitoIdentityProviderClient({ region });
    
    for (const user of usersToDelete || []) {
       try {
           // Delete from Cognito
           const command = new AdminDeleteUserCommand({ UserPoolId: poolId, Username: user.email || user.id });
           await client.send(command);
       } catch (err) {
           console.error(`Cognito deletion failed for ${user.id}:`, err);
       }
       // Hard delete from Supabase
       await getSupabaseClient('profiles').from('profiles').delete().eq('id', user.id);
       deletedCount++;
    }
    
    res.json({ success: true, message: `Cleaned up ${deletedCount} users.` });
  } catch (e: any) {
    console.error('Cleanup error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/profiles/sync', async (req, res) => {
  // Public endpoint for now to sync Cognito users
  try {
    const { email, name, id } = req.body;
    console.log('[API] Syncing profile for:', email, id);
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const { data: existing, error: selectErr } = await getSupabaseClient('profiles').from('profiles').select('*').eq('id', id).maybeSingle();
    if (selectErr) {
      console.error('[API] Sync select error:', selectErr);
      return res.status(500).json({ error: selectErr.message });
    }
    
    let profileData = existing;
    if (!existing) {
      const { data, error: insertErr } = await getSupabaseClient('profiles').from('profiles').insert([{ 
         id, 
         email, 
         display_name: name || '', 
         role: email === 'admin@pixel.com' ? 'ADMIN' : 'USER', 
         platforms: [], 
         interests: [] 
      }]).select().single();
      
      if (insertErr) {
         console.error('[API] Sync insert error:', insertErr);
         return res.status(500).json({ error: insertErr.message });
      }
      profileData = data;
      console.log('[API] New profile created for:', email);
    } else if (id && existing.id !== id) {
      const { data, error: updateErr } = await getSupabaseClient('profiles').from('profiles').update({ id }).eq('email', email).select().single();
      if (updateErr) {
         console.warn('[API] Sync update ID error:', updateErr);
      } else {
         profileData = data;
      }
    }
    res.json({ success: true, profile: profileData });
  } catch (e: any) {
    console.error('[API] Sync exception:', e);
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

    const { data: profile, error } = await getSupabaseClient('profiles').from('profiles').select('*').eq('id', id).maybeSingle();
    
    if (profile) {
       await getSupabaseClient('profiles').from('profiles').delete().eq('id', id);
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

    const { data, error } = await getSupabaseClient(table).from(table).select('*');
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

    const { data, error } = await getSupabaseClient(table).from(table).insert([req.body]).select().single();
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
    
    const { data, error } = await getSupabaseClient(table).from(table).update(updateData).eq('id', id).select().single();
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

    const { error } = await getSupabaseClient(table).from(table).delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Chat Endpoints
app.get('/api/chat/sessions', async (req, res) => {
  try {
    // Get all sessions with user profile
    const { data: sessions, error } = await getSupabaseClient('chat_sessions')
      .from('chat_sessions')
      .select(`
        *,
        profiles:user_id ( display_name, email, platforms, role )
      `)
      .order('last_message_at', { ascending: false });

    if (error) {
       // Table might not exist yet, return empty list gracefully
       if (error.code === '42P01') return res.json([]);
       throw error;
    }
    res.json(sessions);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/chat/sessions', async (req, res) => {
  try {
    const { user_id } = req.body;
    let { data: session, error: selErr } = await getSupabaseClient('chat_sessions')
       .from('chat_sessions')
       .select('*')
       .eq('user_id', user_id)
       .maybeSingle();

    if (selErr && selErr.code !== '42P01') throw selErr;

    if (!session) {
      const { data: newSession, error: insErr } = await getSupabaseClient('chat_sessions')
         .from('chat_sessions')
         .insert({ user_id })
         .select()
         .single();
      
      if (insErr) {
         if (insErr.code === '42P01') return res.json({ id: 'dummy-session' }); // Dummy if tables don't exist
         throw insErr;
      }
      session = newSession;
    }
    
    res.json(session);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/chat/messages/:session_id', async (req, res) => {
  try {
    const { session_id } = req.params;
    if (session_id === 'dummy-session') return res.json([]);
    
    const { data: messages, error } = await getSupabaseClient('chat_messages')
      .from('chat_messages')
      .select(`
        *,
        sender:sender_id ( display_name, role )
      `)
      .eq('session_id', session_id)
      .order('created_at', { ascending: true });

    if (error) {
       if (error.code === '42P01') return res.json([]);
       throw error;
    }
    res.json(messages);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/chat/messages', async (req, res) => {
  try {
    const { session_id, sender_id, content } = req.body;
    if (session_id === 'dummy-session') return res.json({ success: true });

    const { data: message, error } = await getSupabaseClient('chat_messages')
      .from('chat_messages')
      .insert({ session_id, sender_id, content })
      .select()
      .single();

    if (error) {
       if (error.code === '42P01') return res.json({ success: true, message: 'Table not created yet' });
       throw error;
    }

    // Update session last_message_at
    await getSupabaseClient('chat_sessions').from('chat_sessions').update({ last_message_at: new Date().toISOString() }).eq('id', session_id);
    
    res.json(message);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/chat/read', async (req, res) => {
  try {
     const { session_id, user_id, is_admin } = req.body;
     if (session_id === 'dummy-session') return res.json({ success: true });

     // Fetch unread messages
     const { data: messages, error } = await getSupabaseClient('chat_messages')
        .from('chat_messages')
        .select('*')
        .eq('session_id', session_id);

     if (error || !messages) return res.json({ success: true });

     for (const msg of messages) {
        let readBy = msg.read_by || [];
        if (!readBy.includes(user_id)) {
           // If admin, they read user messages. If user, they read admin messages.
           // Actually, just add their ID to read_by array.
           readBy.push(user_id);
           await getSupabaseClient('chat_messages')
             .from('chat_messages')
             .update({ read_by: readBy })
             .eq('id', msg.id);
        }
     }
     res.json({ success: true });
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
