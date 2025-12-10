import { IUserRepository } from '../core/interfaces/IUsers';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../core/models/User';

interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

export class AuthenticateUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials.");
    }
    
    const secret = process.env.JWT_SECRET || 'fallback_secret_key'; 
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '1d' }
    );

    const userWithoutHash = new User(user.id, user.email, '', user.role);

    return {
      user: userWithoutHash,
      token,
    };
  }
}