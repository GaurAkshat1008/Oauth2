import { Router } from "express";
import OauthService from "../oauth";
class AuthRoutes {
  private router_ = Router();
  constructor(oauthService: OauthService) {
    this.router_.get("/authorize", async (req, res) => {
      const clientId = req.query.client_id?.toString();
      const redirectUri = req.query.redirect_uri?.toString();
      const scope = req.query.scope?.toString();
      const username = req.query.username?.toString();
      const password = req.query.password?.toString();
      if (!clientId || !redirectUri || !scope || !username || !password) {
        return res.status(400).send("Invalid request");
      }
      try {
        const authorizationUrl = await oauthService.authorize(
          clientId,
          redirectUri,
          scope,
          username,
          password
        );
        res.redirect(authorizationUrl);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });
    this.router_.get("/callback", async (req, res) => {
      const code = req.query.code?.toString();
      const clientId = req.query.client_id?.toString();
      const redirectUri = req.query.redirect_uri?.toString();
      const state = req.query.state?.toString();
      if (!code || !clientId || !redirectUri || !state) {
        return res.status(400).send("Invalid request");
      }
      try {
        const token = await oauthService.handleAuthorizationCodeGrant(
          code,
          clientId,
          redirectUri,
          state
        );
        if (token) {
          // Redirect the user back to the client application with the access token (and optional refresh token)
          res.redirect(
            `${redirectUri}?access_token=${token.accessToken}&refresh_token=${token.refreshToken}`
          );
        } else {
          res.status(400).send("Invalid authorization code");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });
  }
  public get_router() {
    return this.router_;
  }
}

export default AuthRoutes;
