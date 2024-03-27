import { model, Schema, Document } from "mongoose";

interface ClientStore {
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  grants: string[];
}

const ClientStoreSchema = new Schema<ClientStore & Document>({
  clientId: String,
  clientSecret: String,
  redirectUris: [String],
  grants: [String],
});

const ClientStoreModel = model<ClientStore & Document>(
  "ClientStore",
  ClientStoreSchema
);

export default ClientStoreModel;
