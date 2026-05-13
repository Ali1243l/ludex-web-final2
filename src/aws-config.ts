import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
      signUpVerificationMethod: 'code',
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_AWS_OAUTH_DOMAIN || '',
          scopes: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
          redirectSignIn: [window.location.origin],
          redirectSignOut: [window.location.origin],
          responseType: 'code'
        }
      }
    }
  }
});
