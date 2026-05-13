import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || '',
      identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID || '',
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_AWS_OAUTH_DOMAIN || '',
          scopes: ['email', 'profile', 'openid'],
          redirectSignIn: [window.location.origin],
          redirectSignOut: [window.location.origin],
          responseType: 'code'
        }
      }
    }
  }
});
