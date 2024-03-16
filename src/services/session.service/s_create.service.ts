import { Response } from 'express';
import prisma from '../../config/prisma.config';
import appCfg from '../../config/app.config';
import { v4 as uuidv4 } from 'uuid';

const create = async (userId: number, res: Response) => {
  try {
    if (!userId) throw { status: 400, message: 'Session unavailable or does not exist' };

    let sessionId;

    do {
      sessionId = uuidv4();
    } while (await prisma.session.findUnique({ where: { session_id: sessionId } }));

    const expires = new Date(Date.now() + appCfg.session.duration);

    const createResult = await prisma.session.create({
      data: {
        session_id: sessionId,
        user_id: userId,
        expires: expires
      }
    });

    if (!createResult) throw { status: 500 };

    res.cookie('sessionId', sessionId, {
      expires,
      httpOnly: true,
      secure: appCfg.protocol === 'https',
    });

    return { success: true };

  } catch (err: any) {
    return { success: false, status: err.status, message: err.message };
  }
}

export default create;