import mongoose from "mongoose";

class Database {
  private uri_: string;

  constructor(uri: string) {
    this.uri_ = uri;
  }
  connect() {
    try {
      mongoose.connect(this.uri_);
      console.log("DB Connected");
    } catch (err) {
      console.log(err);
    }
  }
}

export default Database;
