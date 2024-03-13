import pool from '../config/database.config';
import { RowDataPacket } from 'mysql2';

export interface SessionModel {
  sessionId?: string;
  userId: number;
  data: string;
  expires: Date;
}

const Session = {
  // Wyszukiwanie i zwracanie sesji według wyszukanego parametru
  findOne: async (columnName: string, columnValue: string | number): Promise<SessionModel | null> => {
    const query = `SELECT * FROM sessions WHERE ${columnName} = ?`;

    try {
      const [rows] = await pool.query<RowDataPacket[]>(query, [columnValue]);

      if (rows.length === 0) {
        throw new Error(`Session with ${columnName} = ${columnValue} not found`);
      }

      const session: SessionModel = {
        sessionId: rows[0].session_id,
        userId: rows[0].user_id,
        data: rows[0].data,
        expires: rows[0].expires
      };

      return session;

    } catch (err) {
      console.error("Error occurred:", err);
      return null;
    }
  }
};

export default Session;