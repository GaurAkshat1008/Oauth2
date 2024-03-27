import { JobScheduler } from "../base";
import TokenStore from "../tokenStore";

class TokenManager {
  private tokenStore_: TokenStore;
  private sheduler_: JobScheduler;
  constructor(schedulerUrl: string) {
    this.tokenStore_ = new TokenStore();
    this.sheduler_ = new JobScheduler({ db: { address: schedulerUrl } });
  }
  private deleteTokenCallback = async () => {
    await this.tokenStore_.removeExpiredTokens();
  };
  public deleteToken = async () => {
    await this.sheduler_.start();
    const callback = async () => {
      await this.deleteTokenCallback();
    };
    this.sheduler_.define_task("deleteToken", callback);
    await this.sheduler_.repeat_task("1 minute", "deleteToken");
  };
}

export default TokenManager;
