import { ClientStoreModel } from "../models";

class ClientManager {
  async saveClient(client: Client): Promise<void> {
    await ClientStoreModel.create(client);
  }

  async saveClients(clients: Client[]): Promise<void> {
    await ClientStoreModel.insertMany(clients);
  }

  async getClient(clientId: string): Promise<Client | null> {
    const client = await ClientStoreModel.findOne({ clientId: clientId });
    return client;
  }

  async validateClient(
    clientId: string,
    clientSecret: string
  ): Promise<boolean> {
    const client = await this.getClient(clientId);
    if (!client) {
      return false;
    }
    return client.clientSecret === clientSecret;
  }

  async removeClient(clientId: string): Promise<void> {
    await ClientStoreModel.deleteOne({ clientId: clientId });
  }
}

export default ClientManager;
