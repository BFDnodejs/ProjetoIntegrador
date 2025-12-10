import { IUserRepository } from '../core/interfaces/IUsers';
import { User } from '../core/models/User';

interface UserCreationRequest {
  email: string;
  password: string;
}

interface UserUpdateRequest {
  email?: string;
  password?: string;
}

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async register({ email, password }: UserCreationRequest): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const user = new User(null, email, password, "EMPLOYEE");
    return this.userRepository.save(user);
  }
  
  async getById(id: number): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.userRepository.findById(id);
    if (user) {
      return new User(user.id, user.email, '', user.role); 
    }
    return null;
  }

  async getAll(): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.userRepository.listAll();
    return users.map(user => new User(user.id, user.email, '', user.role));
  }

  async update(id: number, data: UserUpdateRequest): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found.");
    }

    if (data.email) user.email = data.email;
    if (data.password) user.passwordHash = data.password;

    await this.userRepository.save(user);
    
    return new User(user.id, user.email, '', user.role);
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found.");
    }
    await this.userRepository.delete(id);
  }
}