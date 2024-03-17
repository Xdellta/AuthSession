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
      throw { status: 401, message: 'Session unavailable or does not exist' };
    }

    // If the session has expired
    if (new Date(session.expired_at) < new Date()) {
      throw { status: 401, message: 'Session has expired' };
    }

    // Refreshing session if 1 hour left
    if (new Date(session.expired_at).getTime() - Date.now() <= 3600000) {
      const refreshResult = await sessionSvc.refresh(sessionId, res);

      if (!refreshResult.success) {
        throw { message: refreshResult.message };
      }

      session = refreshResult.session || null;
    }

    res.locals.session = session;

    next();

  } catch(err) {
    next(err);
  }
}

export default sessionMdw;