import { Amplify } from 'aws-amplify';

// Helper to safely access environment variables in both Vite and Next.js/Webpack
const getEnvVar = (viteKey: string, nextKey: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[viteKey] || (import.meta.env as any)[nextKey] || '';
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[nextKey] || process.env[viteKey] || '';
  }
  return '';
};

const config = {
  Auth: {
    Cognito: {
      userPoolId: getEnvVar('VITE_AWS_USER_POOL_ID', 'NEXT_PUBLIC_COGNITO_USER_POOL_ID'),
      userPoolClientId: getEnvVar('VITE_AWS_USER_POOL_CLIENT_ID', 'NEXT_PUBLIC_COGNITO_CLIENT_ID'),
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        oauth: {
          domain: getEnvVar('VITE_AWS_OAUTH_DOMAIN', 'NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN'),
          scopes: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
          redirectSignIn: [window.location.origin, window.location.origin + '/'],
          redirectSignOut: [window.location.origin, window.location.origin + '/'],
          responseType: 'code' as const
        }
      }
    }
  }
};

Amplify.configure(config);
