import UserRepository from "./userRepo";
import TokenStore from "./tokenStore";
import { v4 } from "uuid";

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
    scope: string
  ): Promise<string> {
    if (!clients[clientId]) {
      throw new Error("Invalid client id");
    }
    const user = await this.simulateLogin();
    if (!user) {
      return `http://localhost:100/login?error=access_denied`;
    }
    const authorizationCode = crypto
      .getRandomValues(new Uint8Array(16))
      .join("");

    const state = crypto.getRandomValues(new Uint8Array(16)).join("");
    this.storeAuthorizationCode(authorizationCode, user.id, state);
    return `http://localhost:1000/callback?code=${authorizationCode}&state=${state}`;
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

    const user = await this.userRepository.getUserByUsername("user1"); // Replace with actual user lookup based on user ID

    // Generate access token and (optional) refresh token
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

  private async simulateLogin(): Promise<User | undefined> {
    // Replace this with actual username/password login logic and validation
    // This is for demonstration purposes only
    return { id: "user1", username: "user1" };
  }

  private async storeAuthorizationCode(
    code: string,
    userId: string,
    state: string
  ): Promise<void> {
    // Implement logic to store the authorization code, user ID, and state in a database (or secure storage)
    // This is simplified for demonstration purposes
    console.log(
      `Storing authorization code: ${code}, user ID: ${userId}, state: ${state}`
    );
  }

  private async verifyAuthorizationCode(
    code: string
  ): Promise<string | undefined> {
    // Implement logic to retrieve the user ID associated with the authorization code from the database (or secure storage)
    // This is simplified for demonstration purposes
    if (code === "your-valid-authorization-code") {
      return "user1"; // Replace with actual user ID retrieval
    }
    return undefined;
  }
}

export default OauthService;
