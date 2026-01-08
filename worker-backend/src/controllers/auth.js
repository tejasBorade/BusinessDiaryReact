import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/auth';

export class AuthController {
  constructor(env) {
    this.db = env.DB;
    this.env = env;
  }

  async login(request) {
    try {
      const { email, password } = await request.json();

      const user = await this.db.prepare(
        'SELECT * FROM users WHERE email = ?'
      ).bind(email).first();

      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Invalid credentials' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return new Response(
          JSON.stringify({ error: 'Invalid credentials' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const token = generateToken(user, this.env);
      
      const { password: _, ...userWithoutPassword } = user;

      return new Response(
        JSON.stringify({ 
          token, 
          user: userWithoutPassword 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  async register(request) {
    try {
      const { email, password, full_name, phone, role = 'store_owner' } = await request.json();

      // Check if user exists
      const existingUser = await this.db.prepare(
        'SELECT id FROM users WHERE email = ?'
      ).bind(email).first();

      if (existingUser) {
        return new Response(
          JSON.stringify({ error: 'Email already registered' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const result = await this.db.prepare(
        'INSERT INTO users (email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?)'
      ).bind(email, hashedPassword, full_name, phone, role).run();

      const user = await this.db.prepare(
        'SELECT id, email, full_name, phone, role, is_active FROM users WHERE id = ?'
      ).bind(result.meta.last_row_id).first();

      const token = generateToken(user, this.env);

      return new Response(
        JSON.stringify({ token, user }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
}
