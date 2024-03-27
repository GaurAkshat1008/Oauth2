import { v4 } from "uuid";

const users: User[] = [];

class UserRepository {
  async getUserByUsername(username: string): Promise<User | undefined> {
    return users.find((user) => user.username === username);
  }
  async createUser(username: string): Promise<User> {
    const user: User = { id: v4(), username: username };
    users.push(user);
    return user;
  }
}

export default UserRepository;
