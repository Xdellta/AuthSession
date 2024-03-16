import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.config';
import sessionSvc from '../services/session.service';

const sessionMdw = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      throw { status: 400, message: 'The session ID is unavailable or does not exist' }
    }

    // Finding session matching sid
    let session = await prisma.session.findUnique({ where: { session_id: sessionId } });

    if (!session) {
      throw { status: 404, message: 'Session unavailable or does not exist' };
    }

    // Verifying session activity
    if (new Date(session.expires) < new Date()) {
      throw { status: 401, message: 'Session has expired' };
    }

    // Refreshing session if 1 hour left
    if (new Date(session.expires).getTime() - Date.now() <= 3600000) {
      const resultRefresh = await sessionSvc.refresh(session.session_id, res);

      if (!resultRefresh.success) {
        throw { status: resultRefresh.status, message: resultRefresh.message };
      }

      session = resultRefresh.session || null;
    }

    res.locals.session = session;

    next();

  } catch(err) {
    next(err);
  }
}

export default sessionMdw;