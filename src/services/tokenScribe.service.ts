import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/prisma.config';

const tokenScribe = async (userId: number, duration: number) => {
  try {
    const token = uuidv4();
    const createdAt = new Date;
    const expiredAt = new Date(Date.now() + duration);

    const createdToken = await prisma.token.create({
      data: {
        token: token,
        user_id: userId,
        created_at: createdAt,
        expired_at: expiredAt
      }
    });

    if (!createdToken) {
      throw new Error('Error writing verification token to database');
    }

    return { success: true, token };

  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export default tokenScribe;