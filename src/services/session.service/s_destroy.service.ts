import { Response } from 'express';
import prisma from '../../config/prisma.config';

const destroy = async (sessionId: string, res: Response) => {
  try {
    res.clearCookie('sessionId');

    if (!sessionId) {
      throw { status: 400, message: 'Session unavailable or does not exist' };
    }
    
    const resultDestroy = await prisma.session.delete({ where: { session_id: sessionId } });

    if (!resultDestroy) {
      throw { status: 404, message: 'Session not found or already deleted' };
    }

    res.clearCookie('sessionId');

    return { success: true };

  } catch (err: any) {
    return { success: false, status: err.status, message: err.message };
  }
}

export default destroy;