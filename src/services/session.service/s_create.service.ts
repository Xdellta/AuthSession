import { Response } from 'express';
import prisma from '../../config/prisma.config';
import appCfg from '../../config/app.config';
import { v4 as uuidv4 } from 'uuid';

const create = async (userId: number, res: Response) => {
  try {
    if (!userId) {
      throw new Error('The session ID is unavailable or does not exist');
    }

    let sessionId;

    do {
      sessionId = uuidv4();
    } while (await prisma.session.findUnique({ where: { session_id: sessionId } }));

    const createdAt = new Date;
    const expiredAt = new Date(Date.now() + appCfg.session.duration);

    const createResult = await prisma.session.create({
      data: {
        session_id: sessionId,
        user_id: userId,
        created_at: createdAt,
        expired_at: expiredAt
      }
    });

    if (!createResult) {
      throw new Error('Failed to create session');
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