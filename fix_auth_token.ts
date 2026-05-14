import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const helper = `const getAuthToken = async (): Promise<string | null> => {
   try {
      const { fetchAuthSession } = await import('aws-amplify/auth');
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() || localStorage.getItem('pixel_token');
   } catch {
      return localStorage.getItem('pixel_token');
   }
};
`;

content = content.replace("export default function App() {\n", helper + "\nexport default function App() {\n");
content = content.replaceAll("localStorage.getItem('pixel_token')", "(await getAuthToken())");

fs.writeFileSync('src/App.tsx', content);
console.log("App.tsx updated!");
