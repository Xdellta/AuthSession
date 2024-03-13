import { Request, Response, NextFunction } from 'express';
import Session from '../../models/session.model';

const destroy = async (sessionId: number, res: Response) => {
  try {
    // Removing the session id from the user's cookie
    res.clearCookie('sessionId');

    // Checking if the session id exists
    if (!sessionId) {
      throw { status: 400 };
    }
    
    // Destroying sessions in the database based on session ID
    const destroyedSession = await Session.destroy({ where: { session_id: sessionId } });

    if (!destroyedSession) {
      throw { status: 404 };
    }

    return { success: true };

  } catch (error: any) {
    return { success: false, status: error.status || 500 };
  }
}

export default destroy;