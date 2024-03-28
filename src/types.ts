interface User {
  id: string;
  username: string;
  password: string;
}

interface Token {
  clientId: string;
  accessToken: string;
  refreshToken?: string; // optional refresh token
  userId: string;
  expiresAt: number; // Token expiration time in miliseconds
}

interface Client {
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  grants: string[];
}
