import { Schema, model } from "mongoose";

interface AuthCode {
  code: string;
  userId: string;
  state: string;
}

const AuthCodeStore = new Schema<AuthCode>({
  code: String,
  userId: String,
  state: String,
});

const AuthCodeModel = model("AuthCode", AuthCodeStore);

export default AuthCodeModel;
