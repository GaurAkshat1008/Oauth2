import UserRepository from "./userRepo";
import TokenStore from "./tokenStore";
import { v4 } from "uuid";
import { AuthCodeModel } from "./models";

const clients: { [clientId: string]: string } = {
  client1: "client1secret",
  client2: "client2secret",
};

class OauthService {
  private readonly userRepository: UserRepository;
  private readonly tokenStore: TokenStore;

  constructor(userRepository: UserRepository, tokenStore: TokenStore) {
    this.userRepository = userRepository;
    this.tokenStore = tokenStore;
  }

  async authorize(
    clientId: string,
    redirectUri: string,
    scope: string,
    username: string,
    password: string
  ): Promise<string> {
    if (!clients[clientId]) {
      throw new Error("Invalid client id");
    }
    const user = await this.simulateLogin(username, password);
    if (!user) {
      return `http://localhost:1000/login?error=access_denied`;
    }
    const authorizationCode = crypto
      .getRandomValues(new Uint8Array(16))
      .join("");

    const state = crypto.getRandomValues(new Uint8Array(16)).join("");
    this.storeAuthorizationCode(authorizationCode, user.id, state);
    const redirectUrl = `${redirectUri}?code=${authorizationCode}&state=${state}`;
    return redirectUrl;
  }

  async handleAuthorizationCodeGrant(
    code: string,
    clientId: string,
    redirectUri: string,
    state: string
  ): Promise<Token | undefined> {
    if (state !== "your-stored-state") {
      throw new Error("Invalid state");
    }
    if (!clients[clientId] || redirectUri !== "/") {
      throw new Error("Invalid client or redirect URI");
    }
    const userId = await this.verifyAuthorizationCode(code);
    if (!userId) {
      throw new Error("Invalid authorization code");
    }

    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }
    const accessToken = crypto.getRandomValues(new Uint8Array(16)).join("");
    const refreshToken = crypto.getRandomValues(new Uint16Array(32)).join(""); // Optional refresh token
    const expiresAt = Date.now() + 3600000; // Token expires in 1 hour

    const token: Token = {
      accessToken,
      refreshToken,
      clientId,
      userId,
      expiresAt,
    };

    await this.tokenStore.saveToken(token);

    return token;
  }

  private async simulateLogin(
    username: string,
    password: string
  ): Promise<User | undefined> {
    const user = await this.userRepository.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return undefined;
  }

  private async storeAuthorizationCode(
    code: string,
    userId: string,
    state: string
  ): Promise<void> {
    try {
      await AuthCodeModel.create({ code, userId, state });
      console.log(
        `Storing authorization code: ${code}, user ID: ${userId}, state: ${state}`
      );
    } catch (error) {
      console.error(`Error storing authorization code: ${error}`);
    }
  }

  private async verifyAuthorizationCode(
    code: string
  ): Promise<string | undefined> {
    const authCodeDetails = await AuthCodeModel.findOne({
      code: code,
    });
    if (authCodeDetails) {
      return authCodeDetails.userId;
    }
    return undefined;
  }
}

export default OauthService;
