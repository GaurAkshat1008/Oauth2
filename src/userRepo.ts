import { v4 } from "uuid";
import { UserStoreModel } from "./models";

class UserRepository {
  async getUserByUsername(username: string): Promise<User | null> {
    const user = await UserStoreModel.findOne({
      where: {
        username: username,
      },
    });
    return user;
  }
  async createUser(username: string): Promise<User> {
    const user: User = { id: v4(), username: username };
    await UserStoreModel.create(user);
    return user;
  }
}

export default UserRepository;
