import express from "express";
import OauthService from "./oauth";
import UserRepository from "./userRepo";
import TokenStore from "./tokenStore";
import AuthRoutes from "./routes";
class Main {
  private app_ = express();
  private oauthService_: OauthService;
  private userRepository_: UserRepository;
  private tokenStore_: TokenStore;
  private authRoutes_: AuthRoutes;
  constructor() {
    this.app_.use(express.urlencoded({ extended: true }));
    this.app_.use(express.json());
    this.userRepository_ = new UserRepository();
    this.tokenStore_ = new TokenStore();
    this.oauthService_ = new OauthService(
      this.userRepository_,
      this.tokenStore_
    );
    this.authRoutes_ = new AuthRoutes(this.oauthService_);
    this.app_.use("/auth", this.authRoutes_.get_router());
  }
  public get_app() {
    return this.app_;
  }
  public start_server() {
    this.app_.listen(1000, () => {
      console.log("Server started on http://localhost:1000");
    });
  }
}

export default Main;
