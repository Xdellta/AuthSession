import { Response } from 'express';
import prisma from '../../config/prisma.config';
import appCfg from '../../config/app.config';
import { v4 as uuidv4 } from 'uuid';

const refresh = async (sessionId: string, res: Response) => {
  try {
    if (!sessionId) {
      throw new Error('The session ID is unavailable or does not exist');
    }

    const newSessionId = uuidv4();
    const newExpiredAt = new Date(Date.now() + appCfg.session.duration);

    const updateResult = await prisma.session.update({
      where: { session_id: sessionId },
      data: {
        session_id: newSessionId,
        expired_at: newExpiredAt
      },
      select: {
        session_id: true,
        user_id: true,
        data: true,
        created_at: true,
        expired_at: true
      }
    });

    if (!updateResult) {
      throw new Error('Failed to refresh session');
    }

    res.cookie('sessionId', sessionId, {
      expires: updateResult.expired_at,
      httpOnly: true,
      secure: appCfg.protocol === 'https',
    });

    return { success: true, session: updateResult };

  } catch(err: any) {
    return { success: false, message: err.message };
  }
}

export default refresh;