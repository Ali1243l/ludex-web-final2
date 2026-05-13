import { Amplify } from 'aws-amplify';

const config = {
  Auth: {
    Cognito: {
      userPoolId: String(import.meta.env.VITE_COGNITO_USER_POOL_ID),
      userPoolClientId: String(import.meta.env.VITE_COGNITO_CLIENT_ID),
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN,
          scopes: ['email', 'profile', 'openid'],
          redirectSignIn: [import.meta.env.VITE_COGNITO_REDIRECT_SIGNIN],
          redirectSignOut: [import.meta.env.VITE_COGNITO_REDIRECT_SIGNOUT],
          responseType: 'code' as const
        }
      }
    }
  }
};

Amplify.configure(config);
