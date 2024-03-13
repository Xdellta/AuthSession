import pool from '../config/database.config';
import { RowDataPacket } from 'mysql2';

interface UserModel {
  userId?: number;
  email: string;
  password: string;
  role: string;
}

const User = {
  // Wyszukiwanie i zwracanie użytkownika według wyszukanego parametru
  findOne: async (columnName: string, columnValue: string | number): Promise<UserModel | null> => {
    const query = `SELECT * FROM users WHERE ${columnName} = ?`;

    try {
      const [rows] = await pool.query<RowDataPacket[]>(query, [columnValue]);

      if (rows.length === 0) {
        throw new Error(`User with ${columnName} = ${columnValue} not found`);
      }

      const user: UserModel = {
        userId: rows[0].user_id,
        email: rows[0].email,
        password: rows[0].password,
        role: rows[0].role
      };

      return user;

    } catch (err) {
      console.error("Error occurred:", err);
      return null;
    }
  }
};

export default User;