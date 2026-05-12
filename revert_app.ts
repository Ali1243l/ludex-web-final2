import { execSync } from 'child_process';
execSync('git checkout -- src/App.tsx');
console.log('Successfully reverted App.tsx via git!');
