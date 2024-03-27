const tokens: Token[] = [];

class TokenStore {
  async saveToken(token: Token): Promise<void> {
    tokens.push(token);
  }
  async getToken(accessToken: string): Promise<Token | undefined> {
    return tokens.find((token) => token.accessToken === accessToken);
  }
  async removeExpiredTokens(): Promise<void> {
    const currentTime = Date.now();
    tokens.forEach((token, index) => {
      if (token.expiresAt < currentTime) {
        tokens.splice(index, 1);
      }
    });
  }
}

export default TokenStore;
