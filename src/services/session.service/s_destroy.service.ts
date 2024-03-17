import { Response } from 'express';
import prisma from '../../config/prisma.config';

const destroy = async (sessionId: string, res: Response) => {
  try {
    res.clearCookie('sessionId');

    if (!sessionId) {
      throw new Error('The session ID is unavailable or does not exist');
    }
    
    const destroyResult = await prisma.session.delete({ where: { session_id: sessionId } });

    if (!destroyResult) {
      throw new Error('Session unavailable or does not exist');
    }

    res.clearCookie('sessionId');

    return { success: true };

  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export default destroy;