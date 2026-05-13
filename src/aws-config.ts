import { Amplify } from 'aws-amplify';

const oauthDomain = import.meta.env.VITE_AWS_OAUTH_DOMAIN;

const cognitoConfig: any = {
  userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || '',
  userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || '',
};

if (import.meta.env.VITE_AWS_IDENTITY_POOL_ID) {
  cognitoConfig.identityPoolId = import.meta.env.VITE_AWS_IDENTITY_POOL_ID;
}

if (oauthDomain) {
  cognitoConfig.loginWith = {
    oauth: {
      domain: oauthDomain,
      scopes: ['email', 'profile', 'openid'],
      redirectSignIn: [window.location.origin],
      redirectSignOut: [window.location.origin],
      responseType: 'code'
    }
  };
}

Amplify.configure({
  Auth: {
    Cognito: cognitoConfig
  }
});
