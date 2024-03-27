import { TokenStoreModel } from "./models";

const tokens: Token[] = [];

class TokenStore {
  async saveToken(token: Token): Promise<void> {
    tokens.push(token);
  }
  async getToken(accessToken: string): Promise<Token | null> {
    const token = await TokenStoreModel.findOne({ accessToken: accessToken });
    return token;
  }
  async removeExpiredTokens(): Promise<void> {
    const currentTime = Date.now();
    console.log(`[${currentTime}]Removing expired tokens`);
    await TokenStoreModel.deleteMany({ expiresAt: { $lt: currentTime } });
  }
}

export default TokenStore;
