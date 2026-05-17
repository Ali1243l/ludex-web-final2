import { Amplify } from 'aws-amplify';

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID || '';
const userPoolClientId = import.meta.env.VITE_COGNITO_CLIENT_ID || '';
const domain = import.meta.env.VITE_COGNITO_DOMAIN || '';

// Dynamically use the current origin for redirects to prevent cross-origin errors in preview/deployments
const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
const redirectSignIn = import.meta.env.VITE_COGNITO_REDIRECT_SIGNIN || `${currentOrigin}/`;
const redirectSignOut = import.meta.env.VITE_COGNITO_REDIRECT_SIGNOUT || `${currentOrigin}/`;

if (!userPoolId || !userPoolClientId) {
  console.warn('[AWS Config] Cognito User Pool ID or Client ID is missing. Authentication will fail.');
}

const config = {
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        oauth: {
          domain,
          scopes: ['email', 'profile', 'openid'],
          redirectSignIn: [redirectSignIn],
          redirectSignOut: [redirectSignOut],
          responseType: 'code' as const
        }
      }
    }
  }
};

Amplify.configure(config);
