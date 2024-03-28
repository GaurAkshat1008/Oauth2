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
  async createUser(username: string, password: string): Promise<User> {
    const user: User = { id: v4(), username: username, password: password };
    await UserStoreModel.create(user);
    return user;
  }
  async getUserById(id: string): Promise<User | null> {
    const user = await UserStoreModel.findOne({
      where: {
        id: id,
      },
    });
    return user;
  }
}

export default UserRepository;
