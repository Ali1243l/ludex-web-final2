import fs from 'fs';

let content = fs.readFileSync('api/index.ts', 'utf8');

const replacement = `import { CognitoJwtVerifier } from "aws-jwt-verify";

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
};`;

content = content.replace(/const requireAuth = \(req.*?\n.*?}(?:;)?/s, replacement);
fs.writeFileSync('api/index.ts', content);
console.log("api/index.ts updated!");
