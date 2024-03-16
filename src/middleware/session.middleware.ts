import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.config';
import appCfg from '../config/app.config';

const sessionMdw = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.cookies['sessionId'];

    if (!req.cookies.sessionId) {
      throw { status: 400, message: 'Session unavailable or invalid' }
    }

    // Wysuzkiwanie sesji na podstawie sid
    const session = await prisma.session.findUnique({ where: { session_id: sessionId } });

    if (!session) throw { status: 404, message: 'Session not found' };

    // Sprawdzanie zgodności czasu i odświeżanie
    if (session.expires < new Date()) throw { status: 401, message: 'Session has expired' };

    // zaimplementować refresh sesji jeżeli czas wygaśnięcia jest bliski

    res.locals.session = session;

    next();

  } catch(err) {
    next(err);
  }
}

export default sessionMdw;