import express from "express";
import OauthService from "./oauth";
import UserRepository from "./userRepo";
import TokenStore from "./tokenStore";
import { AuthRoutes, ClientRoutes } from "./routes";
import { Database } from "./base";
import app_config from "./config";
import { TokenManager } from "./utility";
import { rmSync } from "fs";
class App {
  private app_ = express();
  private oauthService_: OauthService;
  private userRepository_: UserRepository;
  private tokenStore_: TokenStore;
  private authRoutes_: AuthRoutes;
  private clientRoutes_: ClientRoutes;
  private readonly config_ = app_config;
  private readonly port_ = this.config_.port;
  private readonly mongoUrl_ = this.config_.mongoUrl;
  private database_: Database = new Database(this.mongoUrl_);
  private tokenManager_: TokenManager;
  constructor() {
    this.database_.connect();
    this.app_.use(express.urlencoded({ extended: true }));
    this.app_.use(express.json());
    this.userRepository_ = new UserRepository();
    this.tokenStore_ = new TokenStore();
    this.oauthService_ = new OauthService(
      this.userRepository_,
      this.tokenStore_
    );
    this.tokenManager_ = new TokenManager(this.mongoUrl_);
    // this.tokenManager_.deleteToken();
    this.authRoutes_ = new AuthRoutes(this.oauthService_);
    this.clientRoutes_ = new ClientRoutes();
    this.app_.use("/auth", this.authRoutes_.get_router());
    this.app_.use("/client", this.clientRoutes_.get_router());
  }
  public get_app() {
    return this.app_;
  }
  public start_server = async () => {
    this.app_.listen(this.port_, () => {
      console.log("Server started on http://localhost:1000");
    });
  };
}

export default App;
