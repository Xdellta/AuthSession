import { Response } from 'express';
import prisma from '../../config/prisma.config';
import appCfg from '../../config/app.config';
import { v4 as uuidv4 } from 'uuid';

const refresh = async (sessionId: string, res: Response) => {
  try {
    if (!sessionId) {
      throw { status: 400, message: 'The session ID is unavailable or does not exist' };
    }

    const newSessionId = uuidv4();
    const newExpires = new Date(Date.now() + appCfg.session.duration);

    const resultUpdate = await prisma.session.update({
      where: { session_id: sessionId },
      data: {
        session_id: newSessionId,
        expires: newExpires
      },
      select: {
        session_id: true,
        user_id: true,
        data: true,
        expires: true
      }
    });

    if (!resultUpdate) {
      throw { status: 500, message: 'Failed to refresh session' };
    }

    res.cookie('sessionId', sessionId, {
      expires: resultUpdate.expires,
      httpOnly: true,
      secure: appCfg.protocol === 'https',
    });

    return { success: true, session: resultUpdate };

  } catch(err: any) {
    return { success: false, status: err.status, message: err.message };
  }
}

export default refresh;