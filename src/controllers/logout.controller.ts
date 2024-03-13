import { Request, Response, NextFunction } from 'express';
import sessionSvc from '../services/session.service';

// Logout controller for sessions
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extracting session id from the request
    const sessionId = res.locals.session.session_id;

    if (!sessionId) {
      throw { status: 400 };
    }

    // Destroying the session by the function and checking the result
    const destroyResult = await sessionSvc.destroy(sessionId, res);

    if (!destroyResult.success) {
      throw { status: destroyResult.status };
    }

    return res.sendStatus(200).send('Logout successful');;

  } catch(error) {
    next(error);
  }
}

export default logout;