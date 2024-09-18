import { query } from "../database";
import { User } from "../types";

export const getUserByEmail = async (email: string): Promise<User> => {
  const result = await query('SELECT email, password FROM users WHERE email = $1', [email])
  return result.rows[0] || null
}