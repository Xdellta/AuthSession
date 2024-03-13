import { Request, Response, NextFunction } from 'express';
import appCfg from '../../config/app.config';
import Session from '../../models/session.model';
import { v4 as uuidv4 } from 'uuid';

const create = async (userId: number, res: Response) => {
  try {
    // Checking if the user id exists
    if (!userId) {
      throw { status: 400 };
    }

    // Generating a unique session id
    let sessionId;

    do {
      sessionId = uuidv4();
    } while (await Session.findOne({ where: { session_id: sessionId }, raw: true }));

    // Set a session expiration time
    const sessionDuration = appCfg.session?.duration || 0;
    const expires = new Date(Date.now() + sessionDuration);

    // Saving a new session to the database
    await Session.create({
      session_id: sessionId,
      user_id: userId,
      data: null,
      expires,
    });

    // Saving the session id to the user's cookie
    res.cookie('sessionId', sessionId, {
      expires,
      httpOnly: true,
      secure: appCfg.protocol === 'https',
    });

    return { success: true };

  } catch (error: any) {
    return { success: false, status: error.status || 500 };
  }
}

export default create;