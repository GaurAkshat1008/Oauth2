import { Router } from "express";
import { ClientManager } from "../base";

class ClientRoutes {
  private router_ = Router();
  private clientManager_: ClientManager = new ClientManager();
  constructor() {
    this.router_.post("/insertMany", async (req, res) => {
      const { clients } = req.body;
      if (!clients) {
        return res.status(400).send("Invalid request");
      }
      try {
        await this.clientManager_.saveClients(clients);
        res.status(200).send("Clients inserted successfully");
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

export default ClientRoutes;
