import { Document, Schema, model } from "mongoose";

const TokenStore = new Schema<Token & Document>({
  userId: String,
  clientId: String,
  accessToken: String,
  refreshToken: String,
  expiresAt: Date,
});

const TokenStoreModel = model<Token & Document>("Token", TokenStore);

export default TokenStoreModel;
