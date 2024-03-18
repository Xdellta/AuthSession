import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma.config';

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = res.locals.session;

    if (!session) {
      throw { status: 400, message: 'Session unavailable or does not exist' };
    }

    const deletedSession = await prisma.session.delete({ where: { session_id: session.session_id } });

    if (!deletedSession) {
      throw { status: 500, message: 'Internal error while deleting sessions' };
    }

    res.status(200).send('Logout successful');

  } catch(err) {
    next(err);
  }
}

export default logout;