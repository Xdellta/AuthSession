import { Request, Response, NextFunction } from 'express';
import Session, { SessionModel } from '../models/session.model';

declare global {
  namespace Express {
    interface Request {
      session?: SessionModel | null;
    }
  }
}

// pobieranie sid z ciastka >> wyszukiwanie sesji w bazie >> przypisywanie sesji do req
const session = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      next();
    }

    req.session = await Session.findOne('session_id', sessionId);
    next();

  } catch(error) {
    next(error);
  }
}

export default session;

// 1. Dorobić create po przez dołączenie req.session.userId
// 2. wykonać .destroy(), .refresh(), .roleAuth()