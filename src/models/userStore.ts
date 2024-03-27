import { Document, Schema, model } from "mongoose";

const UserStore = new Schema<User & Document>({
  id: String,
  username: String,
});

const UserStoreModel = model<User & Document>("User", UserStore);

export default UserStoreModel;
