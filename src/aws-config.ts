import { Amplify } from 'aws-amplify';

const config = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_OAUTH_DOMAIN || '',
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
