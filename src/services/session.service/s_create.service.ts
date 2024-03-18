import { Response } from 'express';
import prisma from '../../config/prisma.config';
import appCfg from '../../config/app.config';
import { v4 as uuidv4 } from 'uuid';

const create = async (userId: number, res: Response) => {
  try {
    if (!userId) {
      throw new Error('The session ID is unavailable or does not exist');
    }

    const sessionId = uuidv4();
    const createdAt = new Date;
    const expiredAt = new Date(Date.now() + appCfg.session.duration);

    const createdSession = await prisma.session.create({
      data: {
        session_id: sessionId,
        user_id: userId,
        created_at: createdAt,
        expired_at: expiredAt
      }
    });

    if (!createdSession) {
      throw new Error('Error writing session to database');
    }

    res.cookie('sessionId', sessionId, {
      expires: expiredAt,
      httpOnly: true,
      secure: appCfg.protocol === 'https',
    });

    return { success: true };

  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export default create;